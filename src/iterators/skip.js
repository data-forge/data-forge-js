'use strict';

//
// Data-forge enumerator for iterating a standard JavaScript array.
//
var SkipIterator = function (iterator, skipAmount) {

	var self = this;
	self._iterator = iterator;
	self._skipAmount = skipAmount;
};

module.exports = SkipIterator;

SkipIterator.prototype.moveNext = function () {

	var self = this;
	while (--self._skipAmount >= 0 && self._iterator.moveNext()) {
		// Skip first rows.
	}

	return self._iterator.moveNext();
};

SkipIterator.prototype.getCurrent = function () {
	
	var self = this;
	return self._iterator.getCurrent();
};
