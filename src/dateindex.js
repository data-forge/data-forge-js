'use strict';

//
// A time series index based on dates.
//

var assert = require('chai').assert;
var E = require('linq');
var BaseIndex = require('./baseindex');
var inherit = require('./inherit');

var DateIndex = function (values) {
	assert.isArray(values, "Expected 'values' parameter to DateIndex constructor to be an array.");
	
	var self = this;
	self._values = values;	
};

var parent = inherit(DateIndex, BaseIndex);

DateIndex.prototype.values = function () {
	var self = this;
	return self._values;	
};

module.exports = DateIndex;