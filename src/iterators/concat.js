'use strict';

var assert = require('chai').assert;
var E = require('linq');

var validateIterator = require('./validate');


//
// An iterator that can step multiple other iterators at once.
//
var MultiIterator = function (iterables) {
	assert.isArray(iterables);

	var self = this;

	var curIterable = -1;
	var curIterator = null;

	self.moveNext = function () {				
		
		if (iterables.length === 0) {
			return false;
		}
		
		if (!curIterator) {
			curIterator = iterables[0].getIterator();
			curIterable = 0;
		}

		for (;;) {
			if (curIterator.moveNext()) {
				return true;
			}

			++curIterable;
			if (curIterable >= iterables.length) {
				return false;
			}

			curIterator = iterables[curIterable].getIterator();
		}
	};

	self.getCurrent = function () {
		if (curIterator) {
			return curIterator.getCurrent();
		}
		else {
			return undefined;
		}
	};
};

module.exports = MultiIterator;