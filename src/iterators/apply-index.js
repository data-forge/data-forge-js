'use strict';

var assert = require('chai').assert;

var MultiIterator = require('./multi');
var validateIterator = require('./validate');

//
// Applys an index to another iterator.
//
var ApplyIndexIterator = function (iterator, indexIterator) {

	validateIterator(iterator);
	validateIterator(indexIterator);

	var self = this;
	var multi = new MultiIterator([indexIterator, iterator]);
	
	self.moveNext = function () {
		return multi.moveNext();
	};

	self.getCurrent = function () {
		return multi.getCurrent()[1];
	};

	self.getCurrentIndex = function () {
		return multi.getCurrent()[0];	
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

	//
	// Extract all indices and values.
	//
	self.toPairs = function () {
		var output = [];

		while (self.moveNext()) {
			output.push([self.getCurrentIndex(), self.getCurrent()]);
		}

		return output;
	};
};

module.exports = ApplyIndexIterator;