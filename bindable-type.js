const Util = require('./util');

const InitializationType = Object.freeze({
    VALUE: Symbol("value"),
    PROVIDER: Symbol("provider"),
    VOLATILE: Symbol("volatile"),
    SINGLETON: Symbol("singleton")
});

class BindableType {


    /**
     * @package
     * @param {Type} type
     * @param {Container} container
     */
    constructor(type, container) {
        //TODO: make private propertire...
        this.container = container;
        this.type = type;
        this._generateInstance = this._generateInstance.bind(this);
    }

    /**
     * @public
     * @param {constructor} constructor
     */
    to(constructor) {
        Util.validateConstructor(constructor);
        this.constructor = constructor;
        this.initializationType = InitializationType.VOLATILE;
        this.container._bindType(this);
    }

    /**
     * @public
     * @param {constructor} constructor
     */
    toSingleton(constructor) {
        Util.validateConstructor(constructor);
        this.constructor = constructor;
        this.initializationType = InitializationType.SINGLETON;
        this.container._bindType(this);
    }

    /** Description of the provider function
     @name ProviderFunction
     @function
     @param {...*} args
     @return {Promise}
     */

    /** Description of the provider
     @callback Provider
     @param {Object} context
     @return ProviderFunction
     */


    /**
     * @public
     * @param {Provider} provider
     */
    toProvider(provider) {
        if (!provider) {
            throw new Error('provider cannot be undefined!')
        }
        this.provider = provider;
        this.initializationType = InitializationType.PROVIDER;
        this.container._bindType(this);
    }

    /**
     * @public
     * @param {Object} constantValue
     */
    toConstantValue(constantValue) {
        if (!constantValue) {
            throw new Error('constantValue cannot be undefined!')
        }
        this.constantValue = constantValue;
        this.initializationType = InitializationType.VALUE;
        this.container._bindType(this);
    }


    /**
     * @private
     * @param {Object} options
     */
    _generateInstance(options) {
        if (!this.initializationType) {
            //TODO: throw error...
        }
        switch (this.initializationType) {
            case InitializationType.VOLATILE:
                return new this.constructor();
            case InitializationType.SINGLETON:
                return new this.constructor();
            case InitializationType.VALUE:
                return this.constantValue;
            case InitializationType.PROVIDER:
                return this.provider(options);
            default:
                throw new Error('no matching initialization type found!')
        }
    }
}


module.exports = {BindableType, InitializationType};