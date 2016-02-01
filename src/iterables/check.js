'use strict';

var assert = require('chai').assert;

//
// Check if an object is an iterable.
//
module.exports = function (iterable) {
	var type = typeof(iterable);
	return (type === 'object' || type === 'function') &&
		Object.isFunction(iterable.getIterator);
};