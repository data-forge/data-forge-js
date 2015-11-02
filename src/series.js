'use strict';

//
// Implements a time series data structure.
//

var BaseSeries = require('./baseseries');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

var Series = function (values) {
	assert.isArray(values, "Expected 'values' parameter to Series constructor be an array.");

	var self = this;
	self._values = values;	
};

var parent = inherit(Series, BaseSeries);

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

module.exports = Series;