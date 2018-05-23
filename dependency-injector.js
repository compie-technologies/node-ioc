const Type = require('./type');
const Injectable = require('./injectable');

class DependencyInjector {

    constructor(instance, container){
        this.instance = instance;
        this.container = container;
    }

    async inject(globalContext, currentContext) {
        // iterate over keys then
        const keys = Object.keys(this.instance);
        for (let key of keys){
            let propValue = this.instance[key];
            if (propValue instanceof Injectable) {
                const injectable = propValue;
                const type = injectable.type;
                const dependency = this.container._get(type, globalContext, currentContext);
                console.debug('dependency: ',dependency);
                this.instance[key] = dependency;
            }
        }
        const onDependenciesInjected = this.instance.onDependenciesInjected;
        if(onDependenciesInjected) {
            const methodToInvoke = onDependenciesInjected.bind(this.instance);
            await methodToInvoke();
        }
    }

}

module.exports = DependencyInjector;