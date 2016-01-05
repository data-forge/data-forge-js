'use strict';

//
// Implements a lazily evaluated data frame.
//

var LazyColumn = require('./lazycolumn');
var BaseDataFrame = require('./basedataframe');
var LazyIndex = require('./lazyindex');
var ArrayEnumerator = require('./iterators/array');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

var LazyDataFrame = function (columnNamesFn, enumeratorFn, indexFn) {
	assert.isFunction(columnNamesFn, "Expected 'columnNamesFn' parameter to LazyDataFrame constructor to be a function.");
	assert.isFunction(enumeratorFn, "Expected 'enumeratorFn' parameter to LazyDataFrame constructor to be a function.");

	if (indexFn) {
		assert.isFunction(indexFn, "Expected 'indexFn' parameter to LazyDataFrame constructor to be a function.");
	}


	var self = this;
	self._columnNamesFn = columnNamesFn;
	self._enumeratorFn = enumeratorFn;	
	self._indexFn = indexFn || 
		// Default to generated index range.
		function () {
			return new LazyIndex(
				"__index__",
				function () {
					return new ArrayEnumerator(E.range(0, self.toValues().length).toArray());
				}
			);
		};
};

var parent = inherit(LazyDataFrame, BaseDataFrame);

/**
 * Get the index of the data frame.
 */
LazyDataFrame.prototype.getIndex = function () {
	var self = this;
	return self._indexFn();
};

/**
 * Get the names of the columns in the data frame.
 */
LazyDataFrame.prototype.getColumnNames = function () {
	var self = this;
	return self._columnNamesFn();
};

/**
 * Get an enumerator to enumerate the rows of the DataFrame.
 */
LazyDataFrame.prototype.getEnumerator = function () {
	var self = this;
	return self._enumeratorFn();
};

module.exports = LazyDataFrame;