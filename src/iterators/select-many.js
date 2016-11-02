'use strict';

var E = require('linq');

var ArrayIterator = require('./array');
var SelectIterator = require('./select');

//
// An iterator that can step multiple other iterators at once.
//
var SelectManyIterator = function (iterator, selector) {

	var self = this;

	self._expandIterator = new SelectIterator(iterator, selector);
	self._childIterator = null;
};

SelectManyIterator.prototype.moveNext = function () {

	var self = this;			

	if (!self._childIterator) {
		if (!self._expandIterator.moveNext()) {
			return false;
		}

		self._childIterator = self._expandIterator.getCurrent();
		if (Object.isArray(self._childIterator)) {
			self._childIterator = new ArrayIterator(self._childIterator);
		}

		return self._childIterator.moveNext();
	}
	else {
		if (self._childIterator.moveNext()) {
			return true;
		}

		if (!self._expandIterator.moveNext()) {
			return false;
		}

		self._childIterator = self._expandIterator.getCurrent();
		if (Object.isArray(self._childIterator)) {
			self._childIterator = new ArrayIterator(self._childIterator);
		}

		return self._childIterator.moveNext();
	}
};

SelectManyIterator.prototype.getCurrent = function () {

	var self = this;
	return self._childIterator.getCurrent();
};

//
// Bake the iterator into an array.
//
SelectManyIterator.prototype.realize = function () {

	var self = this;

	var output = [];

	while (self.moveNext()) {
		output.push(self.getCurrent());
	}

	return output;
};

module.exports = SelectManyIterator;