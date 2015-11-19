'use strict';

var BaseIndex = require('./baseindex');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Implements an lazy-evaluated index for a data frame or column.
 */
var LazyIndex = function (name, valuesFn) {
	assert.isString(name, "Expected 'name' parameter to Index constructor to be a string.");
	assert.isFunction(valuesFn, "Expected 'valuesFn' parameter to Index constructor to be a function.");

	var self = this;
	self._name = name;
	self._valuesFn = valuesFn;
};

var parent = inherit(LazyIndex, BaseIndex);

/**
 * Get the name of the index.
 */
LazyIndex.prototype.getName = function () {
	var self = this;
	return self._name;
};

/**
 * Get the array of values from the index.
 */
LazyIndex.prototype.getValues = function () {
	var self = this;
	return self._valuesFn();
};

module.exports = LazyIndex;