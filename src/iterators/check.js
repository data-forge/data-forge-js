'use strict';

var assert = require('chai').assert;
var sugar = require('sugar');

//
// Check if an object is an iterator.
//
module.exports = function (iterator) {
	var type = typeof(iterator);
	return (type === 'object' || type === 'function') &&
		Object.isFunction(iterator.moveNext) &&
		Object.isFunction(iterator.getCurrent);
};