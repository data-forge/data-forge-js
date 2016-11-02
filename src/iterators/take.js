'use strict';

//
// Data-forge enumerator for iterating a standard JavaScript array.
//
var TakeIterator = function (iterator, takeAmount) {

	var self = this;
	self._iterator = iterator;
	self._takeAmount = takeAmount;
};

module.exports = TakeIterator;

TakeIterator.prototype.moveNext = function () {

	var self = this;
	if (--self._takeAmount >= 0) {
		return self._iterator.moveNext();
	}
	return false;
};

TakeIterator.prototype.getCurrent = function () {
	
	var self = this;
	return self._iterator.getCurrent();
};
