'use strict';

var assert = require('chai').assert;
var validateIterator = require('./validate');

//
// Data-forge enumerator for iterating a standard JavaScript array.
//
var TakeIterator = function (iterator, takeAmount) {

	validateIterator(iterator);
	assert.isNumber(takeAmount);

	var self = this;

	self.moveNext = function () {
		if (--takeAmount >= 0) {
			return iterator.moveNext();
		}
		return false;
	};

	self.getCurrent = function () {
		return iterator.getCurrent();
	};

};

module.exports = TakeIterator;