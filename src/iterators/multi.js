'use strict';

var E = require('linq');

//
// An iterator that can step multiple other iterators at once.
//
var MultiIterator = function (iterators) {

	var self = this;
	self._started = false;
	self._iterators = iterators;
};

module.exports = MultiIterator;

//
// Move all iterators to the next element.
// Returns false when complete and there are no more elements.
// Completes when first iterator completes.
//	
MultiIterator.prototype.moveNext = function () {

	var self = this;				
	self._started = true;

	if (self._iterators.length > 0) {
		return E.from(self._iterators)
			.select(function (iterator) {
				return iterator.moveNext();
			})
			.all();
	}
	else {
		return false;
	}
};

MultiIterator.prototype.getCurrent = function () {

	var self = this;
	if (!self._started) {
		return undefined;
	}
	
	return E.from(self._iterators)
		.select(function (iterator) {
			return iterator.getCurrent();
		})
		.toArray();
};

//
// Bake the iterator into an array.
//
MultiIterator.prototype.realize = function () {

	var self = this;

	var output = [];

	while (self.moveNext()) {
		output.push(self.getCurrent());
	}

	return output;
};