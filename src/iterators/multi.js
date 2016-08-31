'use strict';

var E = require('linq');

//
// An iterator that can step multiple other iterators at once.
//
var MultiIterator = function (iterators) {

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