'use strict';

//
// A time series index based on number.
//

var assert = require('chai').assert;

var NumberIndex = function (values) {
	assert.isArray(values, "Expected 'values' parameter to NumberIndex constructor to be an array.");
	
	var self = this;
	this._values = values;	
};

NumberIndex.prototype.values = function () {
	var self = this;
	return self._values;	
};

module.exports = NumberIndex;