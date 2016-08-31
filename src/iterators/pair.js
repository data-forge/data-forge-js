'use strict';

var E = require('linq');

//
// An iterator that can step multiple other iterators at once.
//
var PairIterator = function (it1, it2) {

	var self = this;
	var started = false;

	self.moveNext = function () {	

		if (!started) {
			started = true;
		}

		if (it1.moveNext() && it2.moveNext()) {
			return true;
		}

		return false;
	};

	self.getCurrent = function () {
		if (!started) {
			return undefined;
		}

		return [
			it1.getCurrent(),
			it2.getCurrent(),
		];
	};

	//
	// Bake the iterator into an array.
	//
	self.realize = function () {

		var output = [];

		while (self.moveNext()) {
			output.push(self.getCurrent());
		}

		return output;
	};
};

module.exports = PairIterator;