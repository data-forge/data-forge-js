'use strict';

var assert = require('chai').assert;

var ArrayIterator = require('../iterators/array');

//
// Data-forge iterable for iterating a standard JavaScript array.
//
var ArrayIterable = function (arr) {
	assert.isArray(arr);

	var self = this;

	self.getIterator = function () {
		return new ArrayIterator(arr);
	};
};

module.exports = ArrayIterable;