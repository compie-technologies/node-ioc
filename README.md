# Nodejs-ioc

## About

Nodej-ioc is an inversion of control (IoC) container for JavaScript apps.
An IoC container uses a class constructor to identify and inject its dependencies.
Nodej-ioc allows JavaScript developers to write code that adheres to the SOLID principles.


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
const {Type} = require("node-ioc");

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
const {Container, inject} = require("node-ioc");

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
//binds to a class
container.bind(TYPES.USER_SERVICE).to(UserService);
//binds to a singleton class
container.bind(TYPES.AUTH_SERVICE).toSingleton(AuthService);
//binds to a constant value
container.bind(TYPES.CONFIG).toConstantValue(config);

module.exports = { container }

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
- The requested dependencies will be injected after the class instance is created — i.e., not inside the constructor.
For catching the dependencies injection we can use `onDependenciesInjected` method

```js
class AuthService {
    constructor(){
        this.config = inject(TYPES.CONFIG);
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

Using `lazyInject` doesn't delay the injection of the dependencies, all dependencies are injected when the class instance is created.

```js
const lazyInject = container.lazyInject;

class HttpRequest{

    constructor(){
        this.authService = lazyInject(TYPES.AUTH_SERVICE);
        console.log('HttpRequest generated', this.authService)
    }
}

const httpRequest = new HttpRequest();
```
