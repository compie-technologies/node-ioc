const InitializationType = Object.freeze({
    VALUE:   Symbol("value"),
    VOLATILE:  Symbol("volatile"),
    SINGLETON: Symbol("singleton")
});

class BindableType {


    constructor(type, container){
        this.container = container;
        this.type = type;
    }

    to(constructor) {
        this.constructor = constructor;
        this.initializationType = InitializationType.VOLATILE;
        this.container._bindType(this);
    }

    toSingleton(constructor) {
        this.constructor = constructor;
        this.initializationType = InitializationType.SINGLETON;
        this.container._bindType(this);
    }

    toConstantValue(constantValue) {
        this.constantValue = constantValue;
        this.initializationType = InitializationType.VALUE;
        this.container._bindType(this);
    }


    _generateInstance(options){
        if (!this.initializationType){
            //TODO: throw error...
        }
        switch (this.initializationType) {
            case InitializationType.VOLATILE:
                return new this.constructor(options);
            case InitializationType.SINGLETON:
                return new this.constructor(options);
            case InitializationType.VALUE:
                return this.constantValue;
            default:

                break;
        }
    }
}


module.exports = {BindableType, InitializationType};