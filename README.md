# Nodejs-ioc

## About

Nodejs-ioc is an inversion of control (IoC) container for JavaScript apps.

An IoC container uses a class constructor to identify and inject its dependencies.

Nodejs-ioc allows JavaScript developers to write code that adheres to the SOLID principles.


## Installation

You can get the latest release using npm:

```
$ npm install nodejs-ioc --save
```
> :warning: **Important!** Nodejs-ioc requires JavaScript ES6 


## The Basics
Let’s take a look at the basic usage and APIs of Nodejs-ioc with JavaScript:


### Step 1: Declare your types
```js
const {Type} = require("nodejs-ioc");

const TYPES = {
    AUTH_SERVICE : Type.for('AUTH_SERVICE'),
    USER_SERVICE : Type.for('USER_SERVICE'),
    CONFIG : Type.for('CONFIG'),
    TEST_SERVICE : Type.for('TEST_SERVICE'),
};

```

> **Note**: It is recommended to use Types but Nodejs-ioc also support the usage of string literals.


### Step 2: Create and configure a Container
```js
const {Container, inject} = require("nodejs-ioc");

class UserService {
}

class AuthService {
    constructor(){
        this.config = inject(TYPES.CONFIG);
        console.log('AuthService generated');
    }
}

const config = {
    conf:'conf'
};

const container = new Container();
container.bind(TYPES.USER_SERVICE).to(UserService);

module.exports = { container }

```

### bind options
Binds to a singleton class
```js
container.bind(TYPES.AUTH_SERVICE).toSingleton(AuthService);
```

Binds to a constant value
```js
container.bind(TYPES.CONFIG).toConstantValue(config);
```

### Step 3: Resolve dependencies
You can use the method `get` from the `container` class to resolve a dependency.
```js
const authService = container.get(TYPES.AUTH_SERVICE);

expect(authService.config.conf).eql("conf"); // true
```

As we can see the `config` was successfully resolved and injected into `AuthService`.


### inject
There are two important things to remember when using `inject`:
- It must be used inside a constructor
- The requested dependencies will be injected after the class instance is created — i.e., not inside the constructor (the `inject` keyword only marks the class members as flags and doesn't injects the dependency immediately).

For catching the dependencies' injection we can use `onDependenciesInjected` method

```js
class AuthService {
    constructor(){
        this.config = inject(TYPES.CONFIG);
        //config is not injected yet
        console.log('AuthService generated');
    }

    onDependenciesInjected(){
        console.log('AuthService dependencies were injected', this.config);
    }

}
```

## Injecting a Provider (asynchronous Factory)

Binds an abstraction to a Provider. A provider is an asynchronous factory, this 
is useful when dealing with asynchronous I/O operations.

```js
container.bind(TYPES.TEST_SERVICE).toProvider((context) => {
    return (args) => {
        console.log(args);
        return new Promise((resolve) => {
            let userService = context.container.get(TYPES.USER_SERVICE);
            resolve(userService);
        });
    }

});

const testServiceProvider = container.get(TYPES.TEST_SERVICE);
testServiceProvider("hello").then((userService)=>{
    console.log(userService);
});
```


## Lazy inject

Using `lazyInject` allows the container to inject dependencies into objects that are not bound to it.
For example, when using a service in an Express middleware that exists inside a container.

`lazyInject` works differently from the `inject` method provided above, since it injects the dependency immediately (uses the `get` method)

`lazyInject` is linked to a specific container, hence needs to be exported after instantiating the container.

```js
const lazyInject = container.lazyInject;

class HttpRequest{

    constructor(){
        this.authService = lazyInject(TYPES.AUTH_SERVICE);
        //authService is now injected
        console.log('HttpRequest generated', this.authService)
    }
}

const httpRequest = new HttpRequest();
```
