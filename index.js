const Container = require('./lib/container');
const Type = require('./lib/type');
const Injectable = require('./lib/injectable');
const Util = require('./lib/util');

/**
 *
 * @param {String | Type} name
 * @return {Object}
 */
const inject = (name)=> {
    return new Injectable(Util.validateType(name));
};

module.exports = {Container, Type, inject};