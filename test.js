const {Container, Type, inject} = require("./index");

const TYPES = {
    TOKEN_SERVICE : Type.for('TOKEN_SERVICE'),
    AUTH_SERVICE : Type.for('AUTH_SERVICE'),
    USER_SERVICE : Type.for('USER_SERVICE'),
    CONFIG : Type.for('CONFIG'),
    TEST_SERVICE : Type.for('TEST_SERVICE'),
};

class TokenService {

    constructor(){
        console.log('TokenService generated',config);
    }

}

class AuthService {

    constructor(){
        this.config = inject(TYPES.CONFIG);
        console.log('AuthService generated');
    }

    onDependenciesInjected(){
        console.log('AuthService dependencies were injected', this.config);
    }

}

class UserService {

    constructor(){
        this.authService = inject(TYPES.AUTH_SERVICE);
        this.tokenService = inject(TYPES.TOKEN_SERVICE);
        console.log('UserService generated');
    }

    check(){
        console.log('check');
    }

}

const config = {
    conf:'conf'
};


const container = new Container();
const lazyInject = container.lazyInject;
container.bind(TYPES.TOKEN_SERVICE).toSingleton(TokenService);
container.bind(TYPES.USER_SERVICE).to(UserService);
container.bind(TYPES.AUTH_SERVICE).toSingleton(AuthService);
container.bind(TYPES.CONFIG).toConstantValue(config);
container.bind(TYPES.TEST_SERVICE).toProvider((context) => {
    return () => {
        return new Promise((resolve) => {
            let userService = context.container.get(TYPES.USER_SERVICE);
            resolve(userService);
        });
    }

});

const userService1 = container.get(TYPES.USER_SERVICE);
const userService2 = container.get(TYPES.USER_SERVICE);
const userService3 = container.get(TYPES.USER_SERVICE);
const testServiceProvider = container.get(TYPES.TEST_SERVICE);
testServiceProvider.then((userService)=>{
    console.log(userService);
});

class HttpRequest{

    constructor(){
        this.authService = lazyInject(TYPES.AUTH_SERVICE);
        console.log('HttpRequest generated', this.authService)
    }
}


const httpRequest = new HttpRequest();