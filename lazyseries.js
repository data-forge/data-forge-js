'use strict';

//
// Implements a time series data structure.
//

var DateIndex = require('./dateindex');

var assert = require('chai').assert;

var LazySeries = function (index, valuesFn) {
	assert.instanceOf(index, DateIndex, "Expected 'index' parameter to LazySeries constructor be an instance of DateIndex.");
	assert.isFunction(valuesFn, "Expected 'valuesFn' parameter to LazySeries constructor be a function.");

	var self = this;
	self._index = index;
	self._valuesFn = valuesFn;	
};

LazySeries.prototype.index = function () {
	var self = this;
	return self._index;
};

LazySeries.prototype.values = function () {
	var self = this;
	return self._valuesFn();
};

//
// Bake the lazy series to a normal seris. 
//
LazySeries.prototype.bake = function () {
	var Series = require('./series'); // Local require, to prevent circular reference.
	
	var self = this;
	return new Series(self._index, self.values());
};


module.exports = LazySeries;