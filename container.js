const weak = require('weak');
const Context = require('./context');
const DependencyInjector = require('./dependency-injector');
const Util = require('./util');
const {BindableType, InitializationType} = require('./bindable-type');

class Container {

    constructor(){
        this.globalContext = new Context();
        this.lazyInject = this.lazyInject.bind(this);
    }

    bind(type) {
        if (!type){
            throw Error('type cannot be undefined!')
        }
        type = Util.validateType(type);
        const containerRef = weak(this, () => {
            // `this` inside the callback is the EventEmitter.
            // console.debug('"containerRef" has been garbage collected!')
        });
        return new BindableType(type, containerRef);
    }

    get(type) {
        if (!type){
            throw Error('type cannot be undefined!')
        }
        type = Util.validateType(type);
        const currentContext = new Context('currentContext');
        const value = this._get(type, this.globalContext, currentContext);
        currentContext._destroy();
        return value;
    }

    lazyInject(type) {
        return this.get(type);
    }

    _get(type, globalContext, currentContext) {
        if (!type){
            throw Error('type cannot be undefined!')
        }
        const stringName = type.stringName;
        let bindableTypeMap = this._getBindableTypeMap();
        let bindableType = bindableTypeMap[stringName];
        if (!bindableType){
            //TODO: throw an error...
        }
        return this._getInstance(bindableType, globalContext, currentContext)
    }

    _bindType(bindableType){
        const type = bindableType.type;
        const stringName = type.stringName;
        const bindableTypeMap = this._getBindableTypeMap();
        bindableTypeMap[stringName] = bindableType;
    }

    _getBindableTypeMap() {
        let bindableTypeMap = this.bindableTypeMap;
        if (!bindableTypeMap) {
            bindableTypeMap = this.bindableTypeMap = {};
        }
        return bindableTypeMap;
    }

    _getInstance(bindableType, globalContext, currentContext){
        const type = bindableType.type;
        //check current context for value
        let value = currentContext._getValue(type);
        if (value){
            return value;
        }
        // if value not available in current context check global context...
        value = globalContext._getValue(type);
        if (value){
            return value;
        }

        //**initialization stage**//
        // initialize - get instance
        const instance = bindableType._generateInstance('config');
        if (!instance) {
            throw Error('error generating instance!')
        }

        //store the value into current context
        currentContext._insertValue(type,instance);
        //store the value into global context if needed
        if (bindableType.initializationType === InitializationType.SINGLETON || bindableType.initializationType === InitializationType.VALUE) {
            globalContext._insertValue(type,instance);
        }
        //inject dependencies...
        const containerRef = weak(this, () => {
            // `this` inside the callback is the EventEmitter.
            // console.debug('"containerRef" has been garbage collected!')
        });
        new DependencyInjector(instance, containerRef).inject(globalContext, currentContext);
        return instance;
    }

}

module.exports = Container;