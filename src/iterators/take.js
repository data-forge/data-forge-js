'use strict';

//
// Data-forge enumerator for iterating a standard JavaScript array.
//
var TakeIterator = function (iterable, takeAmount) {

	var self = this;
	var iterator = iterable.getIterator();

	self.moveNext = function () {
		if (--takeAmount >= 0) {
			return iterator.moveNext();
		}
		return false;
	};

	self.getCurrent = function () {
		return iterator.getCurrent();
	};

};

module.exports = TakeIterator;