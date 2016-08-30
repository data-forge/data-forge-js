'use strict';

var assert = require('chai').assert;

//
// An iterator that can step multiple other iterators at once.
//
var ConcatIterator = function (iterables) {

	assert.isArray(iterables);

	var self = this;

	var workingIterator;
	var nextIteratorIndex = 0;

	self.moveNext = function () {

		for (;;) {
			if (workingIterator) {
				if (workingIterator.moveNext()) {
					return true; // Moved next on current iterator.
				}
			}				

			if (nextIteratorIndex >= iterables.length) {
				return false; // Reached the end of all iterables.
			}

			var nextIterable = iterables[nextIteratorIndex++]; // Grab the next iterable.
			workingIterator = nextIterable.getIterator(); // Materialize an iterator.
		}
	};

	self.getCurrent = function () {
		if (!workingIterator) {
			return undefined;
		}

		return workingIterator.getCurrent();
	};

};

module.exports = ConcatIterator;