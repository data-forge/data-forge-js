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

	var i = -1; //todo: test this.

	self.moveNext = function () {				
		++i;
		return iterator.moveNext();
	};

	self.getCurrent = function () {
		return selector(iterator.getCurrent(), i);
	};

	//
	// Bake the iterator into an array.
	//
	self.realize = function () {

		var output = [];

		while (self.moveNext()) {
			output.push(self.getCurrent());
		}

		return output;
	};
};

module.exports = SelectIterator;