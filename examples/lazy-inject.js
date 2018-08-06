const {Container, Type, inject} = require("../index");

const TYPES = {
    TOKEN_SERVICE : Type.for('TOKEN_SERVICE'),
    AUTH_SERVICE : Type.for('AUTH_SERVICE'),
    USER_SERVICE : Type.for('USER_SERVICE'),
    CONFIG : Type.for('CONFIG'),
    TEST_SERVICE : Type.for('TEST_SERVICE'),
};


class AuthService {

    constructor(){
        this.config = inject(TYPES.CONFIG);
        console.log('AuthService generated');
    }

    onDependenciesInjected(){
        console.log('AuthService dependencies were injected', this.config);
    }

}

const container = new Container();
const lazyInject = container.lazyInject;

class HttpRequest{

    constructor(){
        this.authService = lazyInject(TYPES.AUTH_SERVICE);
        console.log('HttpRequest generated', this.authService)
    }
}


const httpRequest = new HttpRequest();