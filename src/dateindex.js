'use strict';

//
// A time series index based on dates.
//

var assert = require('chai').assert;
var E = require('linq');

var DateIndex = function (values) {
	assert.isArray(values, "Expected 'values' parameter to DateIndex constructor to be an array.");
	
	var self = this;
	this._values = values;	
};

DateIndex.prototype.values = function () {
	var self = this;
	return self._values;	
};

//
// Skip a number of values in the index.
//
DateIndex.prototype.skip = function (numValues) {
	var self = this;
	return new DateIndex( //todo: this should be lazy.
		E.from(self._values).skip(numValues).toArray()
	); 	
};

module.exports = DateIndex;