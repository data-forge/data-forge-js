'use strict';

//
// Implements a time series data structure.
//

var assert = require('chai').assert;
var E = require('linq');

var Series = function (index, values) {
	assert.isObject(index, "Expected 'index' parameter to Series constructor be an index object.");
	assert.isArray(values, "Expected 'values' parameter to Series constructor be an array.");

	var self = this;
	self._index = index;
	self._values = values;	
};

Series.prototype.index = function () {
	var self = this;
	return self._index;
};

Series.prototype.values = function () {
	var self = this;
	return self._values;
};

//
// For compatability with LazySeries. A Series is already baked, so just return self. 
//
Series.prototype.bake = function () {
	var self = this;
	return self;
};

//
// Get all data as an array of arrays (includes index and values).
//
Series.prototype.rows = function () {
	var self = this;
	return E
		.from(self._index.values())
		.zip(self.values(), function (index, value) {
			return [index, value];
		})
		.toArray();
};

module.exports = Series;