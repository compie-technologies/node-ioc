const Context = require('./context');
const DependencyInjector = require('./dependency-injector');
const Util = require('./util');
const {BindableType, InitializationType} = require('./bindable-type');

class Container {

    constructor(){
        /**
         * @private
         * @readonly
         * @member {Context}
         */
        this.globalContext = new Context();
        this.lazyInject = this.lazyInject.bind(this);
    }

    /**
     * @public
     * @param {String | Type} type
     * @returns {BindableType}
     */
    bind(type) {
        if (!type){
            throw Error('Type cannot be undefined!')
        }
        type = Util.validateType(type);
        const containerRef = Util.generateWeakRef(this);
        return new BindableType(type, containerRef);
    }

    /**
     * @public
     * @param {String | Type} type
     * @returns {Object}
     */
    get(type) {
        if (!type){
            throw new Error('Type cannot be undefined!')
        }
        type = Util.validateType(type);
        const currentContext = new Context('currentContext');
        const value = this._get(type, this.globalContext, currentContext);
        currentContext._destroy();
        return value;
    }

    /**
     * @public
     * @param {String | Type} type
     * @returns {Object}
     */
    lazyInject(type) {
        return this.get(type);
    }

    /**
     * @private
     * @param {String | Type} type
     * @param {Context} globalContext
     * @param {Context} currentContext
     * @returns {Object}
     */
    _get(type, globalContext, currentContext) {
        if (!type){
            throw new Error('Type cannot be undefined!')
        }
        const stringName = type.stringName;
        let bindableTypeMap = this._getBindableTypeMap();
        let bindableType = bindableTypeMap[stringName];
        if (!bindableType){
            throw new Error('BindableType cannot be undefined!')
        }
        return this._getInstance(bindableType, globalContext, currentContext)
    }

    /**
     * @private
     * @param {BindableType} bindableType
     */
    _bindType(bindableType){
        const type = bindableType.type;
        const stringName = type.stringName;
        const bindableTypeMap = this._getBindableTypeMap();
        bindableTypeMap[stringName] = bindableType;
    }

    /**
     * @private
     * @return {Object}
     */
    _getBindableTypeMap() {
        let bindableTypeMap = this.bindableTypeMap;
        if (!bindableTypeMap) {
            /**
             * @private
             */
            this.bindableTypeMap = {};
            bindableTypeMap = this.bindableTypeMap;
        }
        return bindableTypeMap;
    }

    /**
     * @private
     * @param {BindableType} bindableType
     * @param {Context} globalContext
     * @param {Context} currentContext
     * @return {Object}
     */
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

        const containerRef = Util.generateWeakRef(this);
        const instance = bindableType._generateInstance({container: containerRef});
        if (!instance) {
            throw new Error('Error generating instance!');
        }

        //store the value into current context
        currentContext._insertValue(type,instance);
        //store the value into global context if needed
        if (bindableType.initializationType === InitializationType.SINGLETON || bindableType.initializationType === InitializationType.VALUE) {
            globalContext._insertValue(type,instance);
        }
        //inject dependencies...
        new DependencyInjector(instance, containerRef).inject(globalContext, currentContext);
        return instance;
    }

}

module.exports = Container;