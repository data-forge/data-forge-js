'use strict';

//
// Implements a data frame data structure.
//

var BaseDataFrame = require('./basedataframe');
var LazyIndex = require('./lazyindex');

var ArrayEnumerator = require('./enumerators/array');
var assert = require('chai').assert;
var E = require('linq');
var fs = require('fs');
var inherit = require('./inherit');

/**
 * Constructor for DataFrame.
 *
 * @param {object} config - Specifies content and configuration for the data frame.
 */
var DataFrame = function (config) {

	var columnNames;
	var rows;

	if (config) {
		assert.isObject(config, "Expected 'config' parameter to DataFrame constructor to be an object with options for initialisation.");

		if (config.index) {
			assert.isObject(config.index, "Expected 'index' member of 'config' parameter to DataFrame constructor to be an object.");
		}

		if (config.columnNames) {
			assert.isArray(config.columnNames, "Expected 'columnNames' member of 'config' parameter to DataFrame constructor to be an array of strings.");
			assert.isArray(config.rows, "Expected 'rows' member of 'config' parameter to DataFrame constructor to be an array of rows.");

			config.columnNames.forEach(function (columnName) {
				assert.isString(columnName, "Expected 'columnNames' member of 'config' parameter to DataFrame constructor to be an array of strings.");
			});

			config.rows.forEach(function (row) {
				assert.isArray(row, "Expect 'rows' member of 'config' parameter to DataFrame constructor to be an array of arrays or an array of objects.");
			});				

			columnNames = config.columnNames;
			rows = config.rows;
		}
		else if (config.rows) {
			assert.isArray(config.rows, "Expected 'rows' member of 'config' parameter to DataFrame constructor to be an array of rows.");
			
			if (config.rows.length > 0) {
				if (Object.isObject(config.rows[0])) {
					config.rows.forEach(function (row) {
						assert.isObject(row, "Expect 'rows' member of 'config' parameter to DataFrame constructor to be array of objects or arrays, do not mix and match arrays and objects in 'rows'.");
					});	

					// Derive column names from object fields.
					columnNames = E.from(config.rows)
						.selectMany(function (row) {
							return Object.keys(row);
						})
						.distinct()
						.toArray();

					rows = E.from(config.rows)
						.select(function (row) {
							return E.from(columnNames)
								.select(function (columnName) {
									return row[columnName];
								})
								.toArray();
						})
						.toArray();
				}
				else {
					config.rows.forEach(function (row) {
						assert.isArray(row, "Expect 'rows' member of 'config' parameter to DataFrame constructor to be array of objects or arrays, do not mix and match arrays and objects in 'rows'.");
					});				

					// Default column names.
					columnNames = E.range(0, config.rows[0].length)
						.select(function (columnIndex) {
							return columnIndex.toString();
						})
						.toArray();

					rows = config.rows;
				}
			}
		}
	}

	var self = this;
	self._columnNames = columnNames || [];
	self._values = rows || [];
	self._index = (config && config.index) || 
		new LazyIndex(
			"__index___",
			function () {
				return new ArrayEnumerator(E.range(0, self._values.length).toArray());
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
 * Get an enumerator to enumerate the rows of the DataFrame.
 */
DataFrame.prototype.getEnumerator = function () {
	var self = this;
	return new ArrayEnumerator(self._values);
};

//todo: could override the get values fn... here just return the already baked values.

module.exports = DataFrame;