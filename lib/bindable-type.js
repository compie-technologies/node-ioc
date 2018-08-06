const Util = require('./util');

const InitializationType = Object.freeze({
    VALUE: Symbol("value"),
    PROVIDER: Symbol("provider"),
    VOLATILE: Symbol("volatile"),
    SINGLETON: Symbol("singleton")
});

class BindableType {


    /**
     * @private
     * @param {Type} type
     * @param {Container} container
     */
    constructor(type, container) {
        /**
         * @private
         * @readonly
         */
        this.container = container;
        /**
         * @private
         * @readonly
         */
        this.type = type;
        this._generateInstance = this._generateInstance.bind(this);
    }

    /**
     * @public
     * @param {constructor} constructor
     */
    to(constructor) {
        Util.validateConstructor(constructor);
        /**
         * @private
         */
        this.constructorValue = constructor;
        /**
         * @private
         */
        this.initializationType = InitializationType.VOLATILE;
        this.container._bindType(this);
    }

    /**
     * @public
     * @param {constructor} constructor
     */
    toSingleton(constructor) {
        Util.validateConstructor(constructor);
        /**
         * @private
         */
        this.constructorValue = constructor;
        /**
         * @private
         */
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
        /**
         * @private
         */
        this.provider = provider;
        /**
         * @private
         */
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
        /**
         * @private
         */
        this.constantValue = constantValue;
        /**
         * @private
         */
        this.initializationType = InitializationType.VALUE;
        this.container._bindType(this);
    }


    /**
     * @private
     * @param {Object} options
     */
    _generateInstance(options) {
        if (!this.initializationType) {
            throw new Error('No initialization type found!')
        }
        switch (this.initializationType) {
            case InitializationType.VOLATILE:
                return new this.constructorValue();
            case InitializationType.SINGLETON:
                return new this.constructorValue();
            case InitializationType.VALUE:
                return this.constantValue;
            case InitializationType.PROVIDER:
                return this.provider(options);
            default:
                throw new Error('No matching initialization type found!')
        }
    }
}


module.exports = {BindableType, InitializationType};