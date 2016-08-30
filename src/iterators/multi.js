'use strict';

var E = require('linq');
var assert = require('chai').assert;

//
// An iterator that can step multiple other iterators at once.
//
var MultiIterator = function (iterables) {

	assert.isArray(iterables);

	var iterators = E.from(iterables)
		.select(function (iterable) {
			return iterable.getIterator();
		})
		.toArray()
		;

	var self = this;
	var started = false;

	//
	// Move all iterators to the next element.
	// Returns false when complete and there are no more elements.
	// Completes when first iterator completes.
	//	
	self.moveNext = function () {				
		started = true;

		if (iterators.length > 0) {
			return  E.from(iterators)
					.select(function (iterator) {
						return iterator.moveNext();
					})
					.all();
		}
		else {
			return false;
		}
	};

	self.getCurrent = function () {
		if (!started) {
			return undefined;
		}
		
		return E.from(iterators)
			.select(function (iterator) {
				return iterator.getCurrent();
			})
			.toArray();
	};

};

module.exports = MultiIterator;