const {Container, Type, inject} = require("../index");

const TYPES = {
    TOKEN_SERVICE : Type.for('TOKEN_SERVICE'),
    USER_SERVICE : Type.for('USER_SERVICE')
};


class TokenService {

    constructor(){
        console.log('TokenService generated');
    }

    logToConsole(){
        console.log('Hello');
    }
}

class UserService {

    constructor(){
        this.tokenService = inject(TYPES.TOKEN_SERVICE);
        console.log('UserService generated');
    }

    check(){
        console.log('check');
    }

}


const container = new Container();
container.bind(TYPES.TOKEN_SERVICE).to(TokenService);
container.bind(TYPES.TOKEN_SERVICE).toSingleton(UserService);


const userService = container.get(TYPES.USER_SERVICE);

userService.check();
