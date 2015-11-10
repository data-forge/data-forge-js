'use strict';

var BaseIndex = require('./baseindex');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Implements an index for a data frame or series.
 */
var Index = function (values) {
	assert.isArray(values, "Expected 'values' parameter to Index constructor to be an array.");

	var self = this;
	self._values = values;
};

var parent = inherit(Index, BaseIndex);

/*
 * Get the array of values from the index.
 */
Index.prototype.getValues = function () {
	var self = this;
	return self._values;
};

module.exports = Index;