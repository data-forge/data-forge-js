'use strict';

var BaseIndex = require('./baseindex');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Implements an index for a data frame or series.
 */
var LazyIndex = function (valuesFn) {
	assert.isFunction(valuesFn, "Expected 'valuesFn' parameter to Index constructor to be a function.");

	var self = this;
	self._valuesFn = valuesFn;
};

var parent = inherit(LazyIndex, BaseIndex);

/*
 * Get the array of values from the index.
 */
LazyIndex.prototype.getValues = function () {
	var self = this;
	return self._valuesFn();
};

module.exports = LazyIndex;