'use strict';

var E = require('linq');

//
// An iterator that can step multiple other iterators at once.
//
var ConcatIterator = function (iterators) {

	var self = this;

	var curIterator = -1;

	self.moveNext = function () {				
		
		if (iterators.length === 0) {
			return false;
		}

		if (curIterator < 0) {
			++curIterator;
		}
		
		for (;;) {
			if (iterators[curIterator].moveNext()) {
				return true;
			}

			if (curIterator >= iterators.length-1) {
				return false;
			}

			++curIterator;
		}
	};

	self.getCurrent = function () {
		if (curIterator >= 0) {
			return iterators[curIterator].getCurrent();
		}
		else {
			return undefined;
		}
	};

};

module.exports = ConcatIterator;