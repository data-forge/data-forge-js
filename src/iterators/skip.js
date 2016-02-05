'use strict';

var assert = require('chai').assert;
var validateIterator = require('./validate');

//
// Data-forge enumerator for iterating a standard JavaScript array.
//
var SkipIterator = function (iterator, skipAmount) {

	validateIterator(iterator);
	assert.isNumber(skipAmount);

	var self = this;

	self.moveNext = function () {
		while (--skipAmount >= 0 && iterator.moveNext()) {
			// Skip first rows.
		}
		return iterator.moveNext();
	};

	self.getCurrent = function () {
		return iterator.getCurrent();
	};
};

module.exports = SkipIterator;