'use strict';

//
// Implements a time series data structure.
//

var assert = require('chai').assert;
var E = require('linq');

var LazySeries = function (index, valuesFn) {
	assert.isObject(index, "Expected 'index' parameter to LazySeries constructor be an index object.");
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

//
// Get all data as an array of arrays (includes index and values).
//
LazySeries.prototype.rows = function () {
	var self = this;
	return E
		.from(self._index.values())
		.zip(self.values(), function (index, value) {
			return [index, value];
		})
		.toArray();
};

module.exports = LazySeries;