class Type {

    constructor(stringName){
        this.stringName = stringName;
    }

    static for(stringName){
        return new Type(stringName)
    }
}

module.exports = Type;