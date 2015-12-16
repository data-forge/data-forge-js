'use strict';

//
// Implements a data frame data structure.
//

var BaseDataFrame = require('./basedataframe');
var LazyIndex = require('./lazyindex');

var assert = require('chai').assert;
var E = require('linq');
var fs = require('fs');
var inherit = require('./inherit');

var DataFrame = function (config) {
	assert.isObject(config, "Expected 'config' parameter to DataFrame constructor to be an object with options for initialisation.");
	assert.isArray(config.rows, "Expected 'rows' member of 'config' parameter to DataFrame constructor to be an array of rows.");

	if (config.index) {
		assert.isObject(config.index, "Expected 'index' member of 'config' parameter to DataFrame constructor to be an object.");
	}

	var columnNames;

	if (config.columnNames) {
		assert.isArray(config.columnNames, "Expected 'columnNames' member of 'config' parameter to DataFrame constructor to be an array of strings.");

		config.columnNames.forEach(function (columnName) {
			assert.isString(columnName, "Expected 'columnNames' member of 'config' parameter to DataFrame constructor to be an array of strings.");
		});

		if (config.rows.length > 0) {
			assert.isArray(config.rows[0], "Expect 'rows' member of 'config' parameter to DataFrame constructor to be an array of arrays.");
		}

		columnNames = config.columnNames;
	}
	else {
		throw new Error("Expected 'columnNames' member of 'config' parameter to DataFrame constructor.");
	}

	var self = this;
	self._columnNames = columnNames;
	self._values = config.rows;
	self._index = config.index || 
		new LazyIndex(
			"__index___",
			function () {
				return E.range(0, self._values.length).toArray();
			}
		);
};

var parent = inherit(DataFrame, BaseDataFrame);

/**
 * Get the index of the data frame.
 */
DataFrame.prototype.getIndex = function () {
	var self = this;
	return self._index;
};

/**
 * Get the names of the columns in the data frame.
 */
DataFrame.prototype.getColumnNames = function () {
	var self = this;
	return self._columnNames;
};

/**
 * Get the values of all rows in the data frame.
 */
DataFrame.prototype.getValues = function () {
	var self = this;
	return self._values;
};

module.exports = DataFrame;