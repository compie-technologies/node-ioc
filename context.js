class Context {

    /**
     * @package
     * @param {String} name
     */
    constructor(name) {
        this.contextName = name || 'globalContext';
    }

    /**
     *
     * @return {{}|*}
     * @package
     */
    _getValueMap() {
        let valueMap = this.valueMap;
        if (!valueMap) {
            valueMap = this.valueMap = {};
        }
        return valueMap;
    }

    /**
     * @package
     * @param {Type} type
     * @return {{}|*}
     */
    _getValue(type) {
        const stringName = type.stringName;
        let valueMap = this._getValueMap();
        return valueMap[stringName];
    }

    /**
     * @package
     * @param {Type} type
     * @param value
     */
    _insertValue(type, value) {
        const stringName = type.stringName;
        let valueMap = this._getValueMap();
        valueMap[stringName] = value;
    }

    /**
     * @package
     */
    _destroy(){
        this.valueMap = undefined;
    }
}

module.exports = Context;