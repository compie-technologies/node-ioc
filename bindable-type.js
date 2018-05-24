const Util = require('./util');

const InitializationType = Object.freeze({
    VALUE: Symbol("value"),
    PROVIDER: Symbol("provider"),
    VOLATILE: Symbol("volatile"),
    SINGLETON: Symbol("singleton")
});

class BindableType {


    constructor(type, container) {
        this.container = container;
        this.type = type;
        this._generateInstance = this._generateInstance.bind(this);
    }

    to(constructor) {
        Util.validateConstructor(constructor);
        this.constructor = constructor;
        this.initializationType = InitializationType.VOLATILE;
        this.container._bindType(this);
    }

    toSingleton(constructor) {
        Util.validateConstructor(constructor);
        this.constructor = constructor;
        this.initializationType = InitializationType.SINGLETON;
        this.container._bindType(this);
    }

    toProvider(provider) {
        if (!provider) {
            throw new Error('provider cannot be undefined!')
        }
        this.provider = provider;
        this.initializationType = InitializationType.PROVIDER;
        this.container._bindType(this);
    }

    toConstantValue(constantValue) {
        if (!constantValue) {
            throw new Error('constantValue cannot be undefined!')
        }
        this.constantValue = constantValue;
        this.initializationType = InitializationType.VALUE;
        this.container._bindType(this);
    }


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