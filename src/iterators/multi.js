'use strict';

var assert = require('chai').assert;
var E = require('linq');

var validateIterator = require('./validate');


//
// An iterator that can step multiple other iterators at once.
//
var MultiIterator = function (iterators) {
	assert.isArray(iterators);

	iterators.forEach(function (iterator) {
			validateIterator(iterator);
		});

	var self = this;

	var ok = false;

	//
	// Move all iterators to the next element.
	// Returns false when complete and there are no more elements.
	// Completes when first iterator completes.
	//	
	self.moveNext = function () {				

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

module.exports = MultiIterator;