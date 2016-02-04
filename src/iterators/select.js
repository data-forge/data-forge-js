'use strict';

var assert = require('chai').assert;
var E = require('linq');

var validateIterator = require('./validate');
var validateIterable = require('../iterables/validate');


//
// An iterator that can step multiple other iterators at once.
//
var SelectIterator = function (iterable, selector) {

	var self = this;

	validateIterable(iterable);
	assert.isFunction(selector);

	var iterator = null;

	self.moveNext = function () {				
		if (!iterator) {
			iterator = iterable.getIterator();
		}

		return iterator.moveNext();
	};

	self.getCurrent = function () {
		if (!iterator) {
			return undefined;
		}
		return selector(iterator.getCurrent());
	};
};

module.exports = SelectIterator;