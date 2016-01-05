'use strict';

var assert = require('chai').assert;

//
// Data-forge enumerator for iterating a standard JavaScript array.
//
var ArrayIterator = function (arr) {
	assert.isArray(arr);

	var self = this;

	var rowIndex = -1;
	
	self.moveNext = function () {
		return ++rowIndex < arr.length;
	};

	self.getCurrent = function () {
		return arr[rowIndex];
	};
};

module.exports = ArrayIterator;