class Context {

    constructor(name) {
        this.contextName = name || 'globalContext';

    }

    _getValueMap() {
        let valueMap = this.valueMap;
        if (!valueMap) {
            valueMap = this.valueMap = {};
        }
        return valueMap;
    }

    _getValue(type) {
        const stringName = type.stringName;
        let valueMap = this._getValueMap();
        return valueMap[stringName];
    }

    _insertValue(type, value) {
        const stringName = type.stringName;
        let valueMap = this._getValueMap();
        valueMap[stringName] = value;
    }

    _destroy(){
        this.valueMap = undefined;
    }
}

module.exports = Context;