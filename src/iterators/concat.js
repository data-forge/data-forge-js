'use strict';

var assert = require('chai').assert;
var E = require('linq');

var validateIterator = require('./validate');


//
// An iterator that can step multiple other iterators at once.
//
var MultiIterator = function (iterators) {
	assert.isArray(iterators);

	iterators.forEach(function (iterator) {
			validateIterator(iterator);
		});

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

			++curIterator;
			if (curIterator >= iterators.length) {
				return false;
			}
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

module.exports = MultiIterator;