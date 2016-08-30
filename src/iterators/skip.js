'use strict';

//
// Data-forge enumerator for iterating a standard JavaScript array.
//
var SkipIterator = function (iterable, skipAmount) {

	var self = this;
	var iterator = iterable.getIterator();

	self.moveNext = function () {
		while (--skipAmount >= 0 && iterator.moveNext()) {
			// Skip first rows.
		}
		return iterator.moveNext();
	};

	self.getCurrent = function () {
		return iterator.getCurrent();
	};

};

module.exports = SkipIterator;