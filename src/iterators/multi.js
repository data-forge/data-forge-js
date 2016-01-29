'use strict';

var assert = require('chai').assert;
var E = require('linq');

var validateIterator = require('./validate');


//
// An iterator that can step multiple other iterators at once.
//
var MultiIterator = function (iterables) {
	assert.isArray(iterables);

	iterables.forEach(function (iterable) {
		assert.isObject(iterable);
		assert.isFunction(iterable.getIterator);
	});

	var self = this;
	var iterators = null;

	var lazyInit = function () {
		if (!iterators) {
			iterators = E.from(iterables)
				.select(function (iterable) {
					var iterator = iterable.getIterator();
					validateIterator(iterator);
					return iterator;
				})
				.toArray();
		}
	}

	var ok = false;

	//
	// Move all iterators to the next element.
	// Returns false when complete and there are no more elements.
	// Completes when first iterator completes.
	//	
	self.moveNext = function () {				
		lazyInit();

		if (iterators.length > 0) {
			ok = E.from(iterators)
					.select(function (iterator) {
						return iterator.moveNext();
					})
					.all();
		}

		return ok;
	};

	self.getCurrent = function () {
		if (ok) {
			return E.from(iterators)
				.select(function (iterator) {
					return iterator.getCurrent();
				})
				.toArray();
		}
		else {
			return undefined;
		}
	};
};

module.exports = MultiIterator;