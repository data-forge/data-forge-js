'use strict';

//
// Data-forge enumerator for iterating a standard JavaScript array.
//
var TakeIterator = function (iterator, takeAmount) {

	var self = this;

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