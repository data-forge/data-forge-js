'use strict';

var assert = require('chai').assert;
var validateIterator = require('./validate');

//
// Iterator that takes elements while the predicate returns true.
//
var TakeWhileIterator = function (iterator, predicate) {

	validateIterator(iterator);
	assert.isFunction(predicate);

	var self = this;
	var taking = true;

	self.moveNext = function () {
		if (!taking) {
			return false;
		}

		if (!iterator.moveNext()) {
			return false;
		}

		if (!predicate(iterator.getCurrent())) {
			taking = false;
			return false;
		}

		return true;
	};

	self.getCurrent = function () {
		return iterator.getCurrent();
	};

	self.getCurrentIndex = function () {
		return iterator.getCurrentIndex();
	};
};

module.exports = TakeWhileIterator;