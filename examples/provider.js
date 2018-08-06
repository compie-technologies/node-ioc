const {Container, Type, inject} = require("../index");

const TYPES = {
    TOKEN_SERVICE : Type.for('TOKEN_SERVICE'),
    AUTH_SERVICE : Type.for('AUTH_SERVICE'),
    USER_SERVICE : Type.for('USER_SERVICE'),
    CONFIG : Type.for('CONFIG'),
    TEST_SERVICE : Type.for('TEST_SERVICE'),
};


const container = new Container();


class UserService {

    constructor(){
        console.log('UserService generated');
    }

    check(){
        return "check";
    }

}

container.bind(TYPES.TEST_SERVICE).toProvider((context) => {
    return (args) => {
        console.log(args);
        return new Promise((resolve) => {
            let userService = context.container.get(TYPES.USER_SERVICE);
            const result = userService.check();
            resolve(result);
        });
    }

});


const testServiceProvider = container.get(TYPES.TEST_SERVICE);
testServiceProvider("test arg").then(
    (result) =>{
    console.log(result);
});
