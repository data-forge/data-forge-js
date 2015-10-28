'use strict';

//
// A time series index based on number.
//

var assert = require('chai').assert;
var E = require('linq');

var NumberIndex = function (values) {
	assert.isArray(values, "Expected 'values' parameter to NumberIndex constructor to be an array.");
	
	var self = this;
	this._values = values;	
};

NumberIndex.prototype.values = function () {
	var self = this;
	return self._values;	
};

//
// Skip a number of values in the index.
//
NumberIndex.prototype.skip = function (numValues) {
	var self = this;
	return new NumberIndex( //todo: this should be lazy.
		E.from(self._values).skip(numValues).toArray()
	); 	
};

module.exports = NumberIndex;