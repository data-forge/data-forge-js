'use strict';

var assert = require('chai').assert;
var E = require('linq');

var validateIterator = require('./validate');

//
// An iterator that can step multiple other iterators at once.
//
var SelectIterator = function (iterator, selector) {

	var self = this;

	validateIterator(iterator);
	assert.isFunction(selector);

	self.moveNext = function () {				
		return iterator.moveNext();
	};

	self.getCurrent = function () {
		return selector(iterator.getCurrent());
	};
};

module.exports = SelectIterator;