const Type = require('./type');
const weak = require('weak');

const handler={construct(){return handler}};

class Util {

    static validateType(name){
        if (typeof name === 'string' || name instanceof String){
            name = Type.for(name);
        }

        if (!(name instanceof Type)){
            throw new Error('Injected name type mismatch! only string or Type are supported')
        }
        return name;
    }

    static isConstructor(x){
        try{
            return !!(new (new Proxy(x,handler))())
        }catch(e){
            return false
        }
    }

    static validateConstructor(constructor){
        if(!constructor){
            throw new Error('Constructor cannot be undefined!')
        }
        if(!Util.isConstructor(constructor)){
            throw new Error('Not a constructor')
        }
    }

    static generateWeakRef(ref){
        return weak(ref, () => {
            // `this` inside the callback is the EventEmitter.
            // console.debug('"containerRef" has been garbage collected!')
        });
    }
}

module.exports = Util;