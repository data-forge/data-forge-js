'use strict';

var assert = require('chai').assert;
var E = require('linq');

var validateIterator = require('./validate');
var ArrayIterator = require('./array');
var SelectIterator = require('./select');

//
// An iterator that can step multiple other iterators at once.
//
var SelectManyIterator = function (iterator, selector) {

	var self = this;

	validateIterator(iterator);
	assert.isFunction(selector);

	var expandIterator = new SelectIterator(iterator, selector);
	var childIterator = null;

	self.moveNext = function () {				
		if (!childIterator) {
			if (!expandIterator.moveNext()) {
				return false;
			}

			childIterator = expandIterator.getCurrent();
			if (Object.isArray(childIterator)) {
				childIterator = new ArrayIterator(childIterator);
			}

			return childIterator.moveNext();
		}
		else {
			if (childIterator.moveNext()) {
				return true;
			}

			if (!expandIterator.moveNext()) {
				return false;
			}

			childIterator = expandIterator.getCurrent();
			if (Object.isArray(childIterator)) {
				childIterator = new ArrayIterator(childIterator);
			}

			return childIterator.moveNext();
		}
	};

	self.getCurrent = function () {
		return childIterator.getCurrent();
	};

	self.getCurrentIndex = function () {
		return expandIterator.getCurrentIndex();
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

module.exports = SelectManyIterator;