'use strict';

var E = require('linq');

//
// An iterator that can step multiple other iterators at once.
//
var ConcatIterator = function (iterators) {

	var self = this;
	self._curIterator = -1;
	self._iterators = iterators;
};

module.exports = ConcatIterator;

ConcatIterator.prototype.moveNext = function () {				
	
	var self = this;
	if (self._iterators.length === 0) {
		return false;
	}

	if (self._curIterator < 0) {
		++self._curIterator;
	}
	
	for (;;) {
		if (self._iterators[self._curIterator].moveNext()) {
			return true;
		}

		if (self._curIterator >= self._iterators.length-1) {
			return false;
		}

		++self._curIterator;
	}
};

ConcatIterator.prototype.getCurrent = function () {

	var self = this;
	if (self._curIterator >= 0) {
		return self._iterators[self._curIterator].getCurrent();
	}
	else {
		return undefined;
	}
};