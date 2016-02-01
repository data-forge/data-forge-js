'use strict';

var assert = require('chai').assert;

//
// Validate an iterable.
//
module.exports = function (iterable) {
	assert.isObject(iterable, "Expected an 'iterable' object.");
	assert.isFunction(iterable.getIterator, "Expected iterable to have function 'getIterator'.");
};