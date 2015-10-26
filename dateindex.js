'use strict';

//
// A time series index based on dates.
//

var assert = require('chai').assert;

var DateIndex = function (values) {
	assert.isArray(values, "Expected 'values' parameter to DateIndex constructor to be an array.");
	
	var self = this;
	this._values = values;	
};

DateIndex.prototype.values = function () {
	var self = this;
	return self._values;	
};

module.exports = DateIndex;