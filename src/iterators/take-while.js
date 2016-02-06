'use strict';

var assert = require('chai').assert;
var validateIterator = require('./validate');

//
// Iterator that takes elements while the predicate returns true.
//
var TakeWhileIterator = function (iterator, predicate) {

	validateIterator(iterator);
	assert.isFunction(predicate);

	var taking = true;
	return {
		moveNext: function () {
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
		},

		getCurrent: function () {
			return iterator.getCurrent();
		},
	};

};

module.exports = TakeWhileIterator;