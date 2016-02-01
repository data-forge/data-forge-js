'use strict';

//
// Implements a data frame data structure.
//

var BaseDataFrame = require('./basedataframe');
var LazyIndex = require('./lazyindex');

var ArrayIterator = require('./iterators/array');
var checkIterable = require('./iterables/check');
var validateIterable = require('./iterables/validate');
var ArrayIterable = require('./iterables/array')
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

			config.columnNames.forEach(function (columnName) {
				assert.isString(columnName, "Expected 'columnNames' member of 'config' parameter to DataFrame constructor to be an array of strings.");
			});

			if (!config.rows) {
				throw new Error("Expected to find a 'rows' member of 'config' parameter to DataFrame constructor.");
			}

			columnNames = config.columnNames;

		 	if (checkIterable(config.rows)) {
				rows = config.rows;
			}
			else {
				assert.isArray(config.rows, "Expected 'rows' member of 'config' parameter to DataFrame constructor to be an array of rows.");

				config.rows.forEach(function (row) {
					assert.isArray(row, "Expected 'rows' member of 'config' parameter to DataFrame constructor to be an array of arrays, an array of objects or an iterator.");
				});

		 		rows = new ArrayIterable(config.rows);
			}
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

					rows = new ArrayIterable(
						E.from(config.rows) //todo: should have an iterable that converts these one at a time.
							.select(function (row) {
								return E.from(columnNames)
									.select(function (columnName) {
										return row[columnName];
									})
									.toArray();
							})
							.toArray()
					);
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

					rows = new ArrayIterable(config.rows);
				}
			}
			else {
				columnNames = [];
				rows = new ArrayIterable([]);
			}
		}
		else {
			columnNames = [];
			rows = new ArrayIterable([]);			
		}
	}
	else {
		columnNames = [];
		rows = new ArrayIterable([]);
	}

	validateIterable(rows);

	var self = this;
	self._columnNames = columnNames || [];
	self._iterable = rows;
	self._index = (config && config.index) || 
		new LazyIndex(
			function () {
				var length = 0;
				var iterator = rows.getIterator()
				while (iterator.moveNext()) {
					++length;
				}
				return new ArrayIterator(E.range(0, length).toArray()); //todo: this should be a broad cast index.
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
 * Get an iterator for the data-frame.
 */
DataFrame.prototype.getIterator = function () {
	var self = this;
	return self._iterable.getIterator();
};

module.exports = DataFrame;