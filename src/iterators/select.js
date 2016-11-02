'use strict';

var E = require('linq');

//
// An iterator that can step multiple other iterators at once.
//
var SelectIterator = function (iterator, selector) {

	var self = this;
	self._i = -1;
	self._iterator = iterator;
	self._selector = selector;



};

module.exports = SelectIterator;

SelectIterator.prototype.moveNext = function () {

	var self = this;

	++self._i;
	return self._iterator.moveNext();
};

SelectIterator.prototype.getCurrent = function () {

	var self = this;
	return self._selector(self._iterator.getCurrent(), self._i);
};

//
// Bake the iterator into an array.
//
SelectIterator.prototype.realize = function () {

	var self = this;

	var output = [];

	while (self.moveNext()) {
		output.push(self.getCurrent());
	}

	return output;
};