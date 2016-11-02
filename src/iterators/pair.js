'use strict';

var E = require('linq');

//
// An iterator that can step multiple other iterators at once.
//
var PairIterator = function (it1, it2) {

	var self = this;
	self._started = false;
	self._it1 = it1;
	self._it2 = it2;
};

module.exports = PairIterator;

PairIterator.prototype.moveNext = function () {	

	var self = this;
	if (!self._started) {
		self._started = true;
	}

	if (self._it1.moveNext() && self._it2.moveNext()) {
		return true;
	}

	return false;
};

PairIterator.prototype.getCurrent = function () {

	var self = this;
	if (!self._started) {
		return undefined;
	}

	return [
		self._it1.getCurrent(),
		self._it2.getCurrent(),
	];
};

//
// Bake the iterator into an array.
//
PairIterator.prototype.realize = function () {

	var self = this;

	var output = [];

	while (self.moveNext()) {
		output.push(self.getCurrent());
	}

	return output;
};