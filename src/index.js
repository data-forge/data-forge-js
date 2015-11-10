'use strict';

var assert = require('chai').assert;

/**
 * Implements an index for a data frame or series.
 */
var Index = function (values) {
	assert.isArray(values, "Expected 'values' parameter to Index constructor to be an array.");

	var self = this;
	self._values = values;
};

/*
 * Get the values from the index.
 */
Index.prototype.getValues = function () {
	var self = this;
	return self._values;
};

module.exports = Index;