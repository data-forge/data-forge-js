'use strict';

var assert = require('chai').assert;

//
// Data-forge enumerator for iterating a standard JavaScript array.
//
var ArrayIterator = function (arr) {

	assert.isArray(arr);
	
	var self = this;
	self._rowIndex = -1;
	self._arr = arr;
};

module.exports = ArrayIterator;

ArrayIterator.prototype.moveNext = function () {

	var self = this;
	if (self._rowIndex < self._arr.length-1) {
		++self._rowIndex;
		return true;
	}
	
	return false;
};

ArrayIterator.prototype.getCurrent = function () {

	var self = this;
	if (self._rowIndex >= 0 && self._rowIndex < self._arr.length) {
		return self._arr[self._rowIndex];
	}
	else {
		return undefined;
	}		
};

//
// Bake the iterator into an array.
//
ArrayIterator.prototype.realize = function () {

	var self = this;

	var output = [];

	while (self.moveNext()) {
		output.push(self.getCurrent());
	}

	return output;
};