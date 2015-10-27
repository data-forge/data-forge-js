'use strict';

//
// Implements a time series data structure.
//

var DateIndex = require('./dateindex');

var assert = require('chai').assert;

var Series = function (index, values) {
	assert.instanceOf(index, DateIndex, "Expected 'index' parameter to Series constructor be an instance of DateIndex.");
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

module.exports = Series;