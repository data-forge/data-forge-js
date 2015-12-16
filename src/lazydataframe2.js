'use strict';

//
// Implements a lazily evaluated data frame.
//

var LazyColumn = require('./lazycolumn');
var BaseDataFrame = require('./basedataframe');
var LazyIndex = require('./lazyindex');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

var LazyDataFrame2 = function (columnNamesFn, valuesFn, indexFn) {
	assert.isFunction(columnNamesFn, "Expected 'columnNamesFn' parameter to LazyDataFrame constructor to be a function.");
	assert.isFunction(valuesFn, "Expected 'valuesFn' parameter to LazyDataFrame constructor to be a function.");

	if (indexFn) {
		assert.isFunction(valuesFn, "Expected 'indexFn' parameter to LazyDataFrame constructor to be a function.");
	}
	
	var self = this;
	self._columnNamesFn = columnNamesFn;
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

var parent = inherit(LazyDataFrame2, BaseDataFrame);

/**
 * Get the index of the data frame.
 */
LazyDataFrame2.prototype.getIndex = function () {
	var self = this;
	return self._indexFn();
};

/**
 * Get the names of the columns in the data frame.
 */
LazyDataFrame2.prototype.getColumnNames = function () {
	var self = this;
	return self._columnNamesFn();
};

/**
 * Get the values of all rows in the data frame.
 */
LazyDataFrame2.prototype.getValues = function () {
	var self = this;
	return self._valuesFn();
};

module.exports = LazyDataFrame2;