'use strict';

var E = require('linq');

//
// An iterator that can step multiple other iterators at once.
//
var SelectIterator = function (iterable, selector) {

	var self = this;
	var i = -1;

	var iterator = iterable.getIterator();

	self.moveNext = function () {				
		++i;
		return iterator.moveNext();
	};

	self.getCurrent = function () {
		return selector(iterator.getCurrent(), i);
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

module.exports = SelectIterator;