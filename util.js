const Type = require('./type');

class Util {

    static validateType(name){
        if (typeof name === 'string' || name instanceof String){
            name = Type.for(name);
        }

        if (!(name instanceof Type)){
            throw Error('injected name type mismatch! only string or Type are supported')
        }
        return name;
    }
}

module.exports = Util;