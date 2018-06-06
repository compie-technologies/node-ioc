const Container = require('./container');
const Type = require('./type');
const Injectable = require('./injectable');
const Util = require('./util');

/**
 *
 * @param {String | Type} name
 * @return {Object}
 */
const inject = (name)=> {
    return new Injectable(Util.validateType(name));
};

module.exports = {Container, Type, inject};