'use strict';

//
// Implements a time series data structure.
//

var assert = require('chai').assert;
var E = require('linq'); 

var Series = function (index, values) {
	assert.isArray(index, "Expected 'index' parameter to Series constructor be an array.");
	assert.isArray(values, "Expected 'values' parameter to Series constructor be an array.");
	
	if (index.length != values.length) {
		throw new Error("Expect 'index' and 'values' parameters to Series constructor to have same length. index.length is " + index.length + ", values.length is " + values.length);
	}
	
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