'use strict';

//
// Implements a column of a data frame.
//

var BaseColumn = require('./basecolumn');
var LazyIndex = require('./lazyindex');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Represents a lazy-evaluated column in a data frame.
 */
var LazyColumn = function (name, valuesFn, indexFn) {
	assert.isString(name, "Expected 'name' parameter to Column constructor be a string.");
	assert.isFunction(valuesFn, "Expected 'valuesFn' parameter to LazyColumn constructor be a function.");

	if (indexFn) {
		assert.isFunction(valuesFn, "Expected 'indexFn' parameter to LazyColumn constructor to be a function.");
	}

	var self = this;
	self._name = name;
	self._valuesFn = valuesFn;	
	self._indexFn = indexFn || 
		// Default to generated index range.
		function () {
			return new LazyIndex(
				"__index__",
				function () {
					return E.range(0, self.getValues().length).toArray();
				}
			);
		};
};

var parent = inherit(LazyColumn, BaseColumn);

/**
 * Retreive the name of the column.
 */
LazyColumn.prototype.getName = function () {
	var self = this;
	return self._name;
}

/**
 * Retreive the values of the column.
 */
LazyColumn.prototype.getValues = function () {
	var self = this;
	return self._valuesFn();
};

/*
 * Retreive the index for this column.
 */
LazyColumn.prototype.getIndex = function () {
	var self = this;
	return self._indexFn();
};

module.exports = LazyColumn;