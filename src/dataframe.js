'use strict';

// 
// Base class for data frame classes.
//

var ArrayIterator = require('./iterators/array');
var MultiIterator = require('./iterators/multi');
var BabyParse = require('babyparse');
var SelectIterator = require('../src/iterators/select');
var utils = require('./utils');
var extend = require('extend');
var inherit = require('./inherit');

var assert = require('chai').assert; 
var E = require('linq');

var validateIterator = require('./iterators/validate');

//
// Creates an iterator that converts rows to JavaScript objects based on passed in column names.
//
var convertRowsToObjects = function (columnNames, rowsIterator) {

	if (Object.isFunction(columnNames)) {
		columnNames = columnNames();
	}

	assert.isArray(columnNames);

	validateIterator(rowsIterator);

	return new SelectIterator(
		rowsIterator,
		function (row) {
			return E.from(columnNames)
				.select(function (columnName, columnIndex) {
					return [columnName, columnIndex];
				})
				.toObject(
					function (column) {
						return column[0];
					},
					function (column) {
						return row[column[1]];
					}
				);							
		}
	);
};

//
// Determine column names from an array of rows. Column names are take from the fields in each JavaScript object.
//
var determineColumnNamesFromObjectRows = function (rows, considerAllRows)  {

	assert.isArray(rows);

	if (considerAllRows) {
		return E.from(rows)
			.selectMany(function (row) {
				return Object.keys(row);
			})
			.distinct()
			.toArray();
	}
	else {
		if (rows.length > 0) {
			// Just consider the first row.
			return Object.keys(rows[0]);
		}
		else {
			// Can't do this, there are no rows.
			return [];
		}
	}
};

//
// Evaluate an iterable of JavaScript objects, look at the fields and figure out column names from that.
//
var determineColumnNamesFromObjectsIterable = function (iterable, considerAllRows) {

	assert.isFunction(iterable);

	var iterator = iterable();

	if (considerAllRows) {
		// Consider all rows, this expensive, so it is optional.
		var rows = [];
		while (iterator.moveNext()) {
			rows.push(iterator.getCurrent());
		}
		
		return E.from(rows)
			.selectMany(function (row) {
				return Object.keys(row);
			})
			.distinct()
			.toArray();
	}
	else {
		// Just consider the first row.		
		if (!iterator.moveNext()) {
			return []; // Nothing in the iterable.
		}

		return Object.keys(iterator.getCurrent());
	}
};

//
// Evaluate an iterable of index/value pairs, look at the fields in the vlaues and figure out column names from that.
//
var determineColumnNamesFromPairsIterable = function (iterable, considerAllRows) {

	assert.isFunction(iterable);

	var iterator = iterable();

	if (considerAllRows) {
		// Consider all rows, this expensive, so it is optional.
		var rows = [];
		while (iterator.moveNext()) {
			rows.push(iterator.getCurrent()[1]);
		}
		
		return E.from(rows)
			.selectMany(function (row) {
				return Object.keys(row);
			})
			.distinct()
			.toArray();
	}
	else {
		// Just consider the first row.
		if (!iterator.moveNext()) {
			return []; // Nothing in the iterable.
		}

		return Object.keys(iterator.getCurrent()[1]);
	}
};

//
// Constuctor.
//
var DataFrame = function (config) {

	var self = this;
	self.Constructor = DataFrame;

	var _columnNames = null;

	if (config) {
		assert.isObject(config, "Expected 'config' parameter to DataFrame constructor to be an object with options for initialisation.");

		if (config.iterable) {
			assert.isObject(config.iterable, "Expect 'iterable' field of 'config' parameter to DataFrame constructor to be an object that implements getIterator and getColumnNames.");
			assert.isFunction(config.iterable.getIterator, "Expect 'iterable' field of 'config' parameter to DataFrame constructor to be an object that implements getIterator and getColumnNames.");
			assert.isFunction(config.iterable.getColumnNames, "Expect 'iterable' field of 'config' parameter to DataFrame constructor to be an object that implements getIterator and getColumnNames.");			
		}
		else {
			if (config.columnNames) {
				assert.isArray(config.columnNames, "Expected 'columnNames' member of 'config' parameter to DataFrame constructor to be an array of strings.");

				config.columnNames.forEach(function (columnName) {
					assert.isString(columnName, "Expected 'columnNames' member of 'config' parameter to DataFrame constructor to be an array of strings.");
				});
			}
			
			if (config.values) {
				assert(!config.columns, "Can't use both 'values' and 'columns' fields of 'config' parameter to DataFrame constructor.");
			}
			else if (config.columns) {
				assert.isObject(config.columns, "Expected 'columns' member of 'config' parameter to DataFrame constructor to be an object with fields that define columns.");
				assert(!config.columnNames, "Can't use both 'columns' and 'columnNames' of 'config' parameter to DataFrame constructor.");
			}

			var values = config.values;
			var columns = config.columns;

			if (config.columnNames)	{
				//
				// Rename duplicate columns.
				//
				var duplicateColumns = E.from(config.columnNames)
					.groupBy(function (columnName) {
						return columnName.toLowerCase();
					})
					.select(function (group) {
						return {
							name: group.key(),
							count: group.getSource().length,
						}
					})
					.where(function (column) {
						return column.count > 1;
					})
					.toArray();

				var duplicateColumnCounts = E.from(duplicateColumns)
					.toObject(
						function (column) {
							return column.name;
						},						
						function (column) {
							return 1;
						}						
					);

				_columnNames = E.from(config.columnNames)
					.select(function (columnName) {
						var key = columnName.toLowerCase();
						var columnCount = duplicateColumnCounts[key];
						if (columnCount) {
							duplicateColumnCounts[key] += 1; // Increment count. 
							return columnName + "." + columnCount; // Number duplicates in order.
						}
						else {
							return columnName; // No duplicate.
						}
					})
					.toArray();

				if (Object.isFunction(values)) {
					config.values = function () {
						return convertRowsToObjects(_columnNames, values());
					};
				}
				else {
					config.values = function () {
						return convertRowsToObjects(_columnNames, new ArrayIterator(values));
					};
				}
			}
			else {
				if (values) {
					if (Object.isFunction(values)) {
						_columnNames = determineColumnNamesFromObjectsIterable(values, config.considerAllRows);
					}
					else {
						// Derive column names from object fields.
						_columnNames = determineColumnNamesFromObjectRows(values, config.considerAllRows);
					}
				}
				else if (columns) {
					_columnNames = Object.keys(columns);

					config.values = function () {
						var columnIterators = E.from(_columnNames)
							.select(function (columnName) {
								var column = columns[columnName];
								if (column instanceof Series) {
									column = column.toValues();
								}
								return new ArrayIterator(column);
							})
							.toArray();
						return convertRowsToObjects(_columnNames, new MultiIterator(columnIterators));
					};
				}
				else {
					_columnNames = [];
				}
			}
		}
	}
	else {
		_columnNames = [];
	}

	Series.call(this, config);

	if (!config || !config.iterable)
	{
		self.iterable.getColumnNames = function () {
			return _columnNames;
		};
	}
};

module.exports = DataFrame;

var Series = require('./series');
var parent = inherit(DataFrame, Series);

var concatDataFrames = require('./concat-dataframes');
var zipDataFrames = require('./zip-dataframes');
var SelectValuesIterable = require('./iterables/select-values');
var ArrayIterable = require('./iterables/array');

/**
 * Get the names of the columns in the data frame.
 */
DataFrame.prototype.getColumnNames = function () {
	var self = this;
	return self.iterable.getColumnNames();
};

/**
 * Gets a column index from a column name.
 *
 * @param {string} columnName - The name of the column to retrieve the column index for.
 *
 * @returns {Number} Returns the index of the named column or -1 if the requested column was not found.
 */
DataFrame.prototype.getColumnIndex = function (columnName) {
	assert.isString(columnName, "Expected 'columnName' parameter to getColumnIndex to be a non-empty string.");
	
	var self = this;	
	var columnNames = self.getColumnNames();
	
	for (var i = 0; i < columnNames.length; ++i) {
		if (columnName === columnNames[i]) {
			return i;
		}
	}	
	
	return -1;
};

/**
 * Gets a column name from a column index.
 *
 * @param {int} columnIndex - The index of the column to retrieve the column name for.
 *
 * @returns {string} Returns the name of the column or undefined if the requested column was not found.
 */
DataFrame.prototype.getColumnName = function (columnIndex) {
	assert.isNumber(columnIndex, "Expected 'columnIndex' parameter to getColumnIndex to be a non-empty string.");

	var self = this;	
	var columnNames = self.getColumnNames();

	if (columnIndex < 0 || columnIndex >= columnNames.length) {
		return undefined;
	}

	return columnNames[columnIndex];
};

/**
 * Retreive a time-series from a column of the data-frame.
 *
 * @param {string} columnName - Specifies the column to retreive.
 */
DataFrame.prototype.getSeries = function (columnName) {
	var self = this;

	assert.isString(columnName, "Expected 'columnName' parameter to getSeries function to be a string that specifies the name of the column to retreive.");

	return new Series({
		iterable: new SelectValuesIterable(
			self,
			function (value) {
				return value[columnName];
			}
		),
	});
};

/**
 * Returns true if the column with the requested name exists in the data frame.
 *
 * @param {string} columnName - Name of the column to check.
 */
DataFrame.prototype.hasSeries = function (columnName) {

	assert.isString(columnName);

	var self = this;
	return self.getColumnIndex(columnName) >= 0;
};

/**
 * 
 * Verify the existance of a column and return it.
 * Throws an exception if the column doesn't exist.
 *
 * @param {string} columnName - Name or index of the column to retreive.
 */
DataFrame.prototype.expectSeries = function (columnName) {

	var self = this;
	if (self.getColumnNames().indexOf(columnName) < 0) {
		throw new Error("Expected data-frame to contain series with column name: '" + columnName + "'.");
	}
	return self;
};

/** 
 * Retreive a collection of all columns.
 */
DataFrame.prototype.getColumns = function () {

	var self = this;

	return E.from(self.getColumnNames())
		.select(function (columnName) {
			return {
				name: columnName,
				series: self.getSeries(columnName),
			};
		})
		.toArray();
};

/**
 * Create a new data-frame from a subset of columns.
 *
 * @param {array} columnNames - Array of column names to include in the new data-frame.
 */
DataFrame.prototype.subset = function (columnNames) {

	var self = this;
	
	assert.isArray(columnNames, "Expected 'columnNames' parameter to 'subset' to be an array.");	
	
	return new DataFrame({
		iterable: {
			getIterator: function () {
				return new SelectIterator(
					self.getIterator(),
					function (pair) {
						return [
							pair[0],
							E.from(columnNames)
								.toObject(
									function (columnName) {
										return columnName;
									},
									function (columnName) {
										return pair[1][columnName];
									}
								)
						];					
					}
				);
			},

			getColumnNames: function () {
				return columnNames;
			},
		}, 
	});	 
};

/**
 * Create a new data frame with the requested column or columns dropped.
 *
 * @param {string|array} columnOrColumns - Specifies the column name (a string) or columns (array of column names) to drop.
 */
DataFrame.prototype.dropSeries = function (columnOrColumns) {

	var self = this;

	if (!Object.isArray(columnOrColumns)) {
		assert.isString(columnOrColumns, "'DataFrame.dropSeries' expected either a string or an array or strings.");

		columnOrColumns = [columnOrColumns]; // Convert to array for coding convenience.
	}

	var columnNames = self.getColumnNames().slice(0); // Clone array.
	var newColumnNames = E.from(columnNames)
		.where(function (columnName) {
			return !E.from(columnOrColumns).contains(columnName);
		})
		.toArray();

	return new DataFrame({
		columnNames: newColumnNames,
		iterable: {
			getIterator: function () {
				return new SelectIterator(
					self.getIterator(),
					function (value) {
						var row = extend({}, value);
						columnOrColumns.forEach(function (columnName) {
							delete row[columnName];
						});
						return row;
					}
				);

			},

			getColumnNames: function () {
				return newColumnNames;
			}
		}, 
	});
};

/**
 * Create a new data frame with only the requested column or columns dropped, other columns are dropped.
 *
 * @param {string|array} columnOrColumns - Specifies the column name (a string) or columns (array of column names) to keep.
 */
DataFrame.prototype.keepSeries = function (columnOrColumns) {

	var self = this;

	if (!Object.isArray(columnOrColumns)) {
		assert.isString(columnOrColumns, "'DataFrame.keepSeries' expected either a string or an array or strings.");

		columnOrColumns = [columnOrColumns]; // Convert to array for coding convenience.
	}

	return new DataFrame({
		iterable: {
			getIterator: function () {
				return new SelectIterator(
					self.getIterator(),
					function (pair) {
						var row = extend({}, pair[1]);
						Object.keys(row).forEach(function (fieldName) {
							if (!E.from(columnOrColumns).contains(fieldName)) {
								delete row[fieldName];
							}
						});
						return [
							pair[0],
							row
						];					
					}
				);
			},

			getColumnNames: function() {
				return columnOrColumns;
			}
		},
	});
};

/**
 * Create a new data frame with an additional column specified by the passed-in series.
 *
 * @param {string} columnName - The name of the column to add or replace.
 * @param {Series} series - Series to add to the data-frame.
 */
DataFrame.prototype.withSeries = function (columnName, series) {

	assert.isString(columnName, "Expected 'columnName' parameter to 'DataFrame.withSeries' function to be a string that specifies the column to set or replace.");
	assert.isObject(series, "Expected 'series' parameter to 'DataFrame.withSeries' to be a Series object.");

	var self = this;

	return new DataFrame({
		iterable: {
			getIterator: function () {
				var seriesValueMap = E.from(series.toPairs())
					.toObject(
						function (pair) {
							return pair[0];
						},
						function (pair) {
							return pair[1];
						}
					);

				return new SelectIterator(
					self.getIterator(),
					function (pair) {
						var index = pair[0];
						var newValue = extend({}, pair[1]);
						newValue[columnName] = seriesValueMap[index];
						return [index, newValue];						
					}
				);
			},

			getColumnNames: function () {
				return E.from(self.getColumnNames())
					.concat([columnName])
					.distinct()
					.toArray();
			},
		},
	});
};

/**
 * Set a named column as the index of the data-frame.
 *
 * @param {string} columnName - Name or index of the column to set as the index.
 */
DataFrame.prototype.setIndex = function (columnName) {

	var self = this;
	return self.withIndex(self.getSeries(columnName));
};

/** 
 * Format the data frame for display as a string.
 */
DataFrame.prototype.toString = function () {

	var self = this;
	var Table = require('easy-table');

	var columnNames = self.getColumnNames();
	var pairs = E.from(self.toPairs())
		.select(function (pair) { // Convert to rows.
			return [pair[0]]
				.concat(
					E.from(columnNames) 
						.select(function (columnName) {
							return pair[1][columnName];
						})
						.toArray()					
				);
		})
		.toArray();
	var header = ["__index__"].concat(columnNames);
	var t = new Table();
	pairs.forEach(function (row, rowIndex) {
		row.forEach(function (cell, cellIndex) {
			t.cell(header[cellIndex], cell);
		});
		t.newRow();
	});

	return t.toString();
};

/**
 * Parse a column with string values to a column with int values.
 *
 * @param {string|array} columnNameOrNames - Specifies the column name or array of column names to parse.
 */
DataFrame.prototype.parseInts = function (columnNameOrNames) {

	var self = this;
	if (Object.isArray(columnNameOrNames)) {
		return E.from(columnNameOrNames)
			.aggregate(self, function (self, columnName) {
				return self.withSeries(columnName, self.getSeries(columnName).parseInts());
			});
	}
	else {
		return self.withSeries(columnNameOrNames, self.getSeries(columnNameOrNames).parseInts());
	}
};

/**
 * Parse a column with string values to a column with float values.
 *
 * @param {string|array} columnNameOrNames - Specifies the column name or array of column names to parse.
 */
DataFrame.prototype.parseFloats = function (columnNameOrNames) {

	var self = this;
	if (Object.isArray(columnNameOrNames)) {
		return E.from(columnNameOrNames)
			.aggregate(self, function (self, columnName) {
				return self.withSeries(columnName, self.getSeries(columnName).parseFloats());
			});
	}
	else {
		return self.withSeries(columnNameOrNames, self.getSeries(columnNameOrNames).parseFloats());
	}
};

/**
 * Parse a column with string values to a column with date values.
 *
 * @param {string|array} columnNameOrNames - Specifies the column name or array of column names to parse.
 * @param {string} [formatString] - Optional formatting string for dates.
 */
DataFrame.prototype.parseDates = function (columnNameOrNames, formatString) {

	if (formatString) {
		assert.isString(formatString, "Expected optional 'formatString' parameter to parseDates to be a string (if specified).");
	}

	var self = this;
	if (Object.isArray(columnNameOrNames)) {
		return E.from(columnNameOrNames)
			.aggregate(self, function (self, columnName) {
				return self.withSeries(columnName, self.getSeries(columnName).parseDates(formatString));
			});
	}
	else {
		return self.withSeries(columnNameOrNames, self.getSeries(columnNameOrNames).parseDates(formatString));
	}
};

/**
 * Convert a column of values of different types to a column of string values.
 *
 * @param {string|array} columnNameOrNames - Specifies the column name or array of column names to convert to strings.
 * @param {string} [formatString] - Optional formatting string for dates.
 */
DataFrame.prototype.toStrings = function (columnNameOrNames, formatString) {

	if (formatString) {
		assert.isString(formatString, "Expected optional 'formatString' parameter to parseDates to be a string (if specified).");
	}

	var self = this;
	if (Object.isArray(columnNameOrNames)) {
		return E.from(columnNameOrNames)
			.aggregate(self, function (self, columnName) {
				return self.withSeries(columnName, self.getSeries(columnName).toStrings(formatString));
			});
	}
	else {
		return self.withSeries(columnNameOrNames, self.getSeries(columnNameOrNames).toStrings(formatString));
	}
};

/**
 * Detect actual types and their frequencies contained within columns in the data frame.
 */
DataFrame.prototype.detectTypes = function () {

	var self = this;

	var dataFrames = E.from(self.getColumns())
		.select(function (column) {
			var series = column.series;
			var numValues = series.count();
			//todo: broad-cast column
			var newSeries = new Series({
				values: E.range(0, numValues)
					.select(function () { 
						return column.name; 
					})
					.toArray()
			});
			return column.series
				.detectTypes()
				.withSeries('Column', newSeries);
		})
		.toArray();
	return concatDataFrames(dataFrames).resetIndex();
};

/**
 * Detect values and their frequencies contained within columns in the data frame.
 */
DataFrame.prototype.detectValues = function () {

	var self = this;

	var dataFrames = E.from(self.getColumns())
		.select(function (column) {
			var numValues = column.series.toValues().length;
			//todo: broad-cast column
			var newSeries = new Series({
				values: E.range(0, numValues)
					.select(function () { 
						return column.name 
					})
					.toArray()
			});
			return column.series.detectValues().withSeries('Column', newSeries);
		})
		.toArray();
	return concatDataFrames(dataFrames).resetIndex();
};
/**
 * Produces a new data frame with all string values truncated to the requested maximum length.
 *
 * @param {int} maxLength - The maximum length of the string values after truncation.
 */
DataFrame.prototype.truncateStrings = function (maxLength) {
	assert.isNumber(maxLength, "Expected 'maxLength' parameter to 'truncateStrings' to be an integer.");

	var self = this;
	var truncatedValues = E.from(self.toRows()) //todo: make this function lazy.
		.select(function (row) {
			return E.from(row)
				.select(function (value) {
					if (Object.isString(value)) {
						if (value.length > maxLength) {
							return value.substring(0, maxLength);
						}
					}

					return value;
				})
				.toArray();
		})
		.toArray();

	return new DataFrame({
		columnNames: self.getColumnNames(),
		values: truncatedValues,
	});
};

/**
 * Create a new data frame with columns reordered.
 * New column names create new columns (with undefined values), omitting existing column names causes those columns to be dropped.
 * 
 * @param {array} columnNames - The new order for columns. 
 */
DataFrame.prototype.remapColumns = function (columnNames) {

	assert.isArray(columnNames, "Expected parameter 'columnNames' to remapColumns to be an array with column names.");

	columnNames.forEach(function (columnName) {
		assert.isString(columnName, "Expected parameter 'columnNames' to remapColumns to be an array with column names.");
	});

	var self = this;

	return new DataFrame({
		columnNames: columnNames,
		values: function () { //todo: make this properly lazy.
			return new ArrayIterator(
				E.from(self.toRows())
					.select(function (row) {
						return E.from(columnNames)
							.select(function (columnName) {
								var columnIndex = self.getColumnIndex(columnName);
								if (columnIndex >= 0) {
									return row[columnIndex];
								}
								else { 
									// Column doesn't exist.
									return undefined;
								}
							})
							.toArray();
					})
					.toArray()
			);
		},
	});
};

/**
 * Create a new data-frame with renamed series.
 *
 * @param {array|object} newColumnNames|columnsMap - Array of strings, with an element for each existing column that specifies the new name of that column. Or, a hash that maps old column name to new column name.
 */
DataFrame.prototype.renameSeries = function (newColumnNames) {

	var self = this;

	if (Object.isObject(newColumnNames)) {
		var self = this;
		var renamedColumns = self.getColumnNames().slice(0); // Clone array.

		Object.keys(newColumnNames).forEach(function (existingColumnName, columnIndex) {
			var columnIndex = self.getColumnIndex(existingColumnName);
			if (columnIndex === -1) {
				return; // No column to be renamed.
			}

			renamedColumns[columnIndex] = newColumnNames[existingColumnName];
		});

		return self.renameSeries(renamedColumns);
	}
	else {
		var existingColumns = self.getColumnNames();
		var numExistingColumns = existingColumns.length;

		assert.isArray(newColumnNames, "Expected parameter 'newColumnNames' to renameColumns to be an array with column names.");
		assert(newColumnNames.length === numExistingColumns, "Expected 'newColumnNames' array to have an element for each existing column. There are " + numExistingColumns + "existing columns.");

		return new DataFrame({
			iterable: {
				getIterator: function () {
					var columnMap = E.from(existingColumns)
						.zip(newColumnNames, function (oldName, newName) {
							return [oldName, newName];
						})
						.toArray();

					return new SelectIterator(
						self.getIterator(),
						function (pair) {
							return [
								pair[0],
								E.from(columnMap).toObject(
									function (remap) {
										return remap[1];
									},
									function (remap) {
										return pair[1][remap[0]];								
									}
								)
							];
						}
					);
				},

				getColumnNames: function () {
					return newColumnNames;
				},
			},
		});
	}
};

/**
 * Bake the data frame to an array of rows.
 */
DataFrame.prototype.toRows = function () {

	var self = this;

	var iterator = self.getIterator();
	validateIterator(iterator);

	var values = [];
	var columnNames = self.getColumnNames();

	while (iterator.moveNext()) {
		var curRow = iterator.getCurrent()[1];  // Extract value.

		var asArray = [];
		for (var columnIndex = 0; columnIndex < columnNames.length; ++columnIndex) {
			asArray.push(curRow[columnNames[columnIndex]]);
		}

		values.push(asArray);
	}

	return values;
};

/**
 * Serialize the data frame to JSON.
 */
DataFrame.prototype.toJSON = function () {
	var self = this;
	return JSON.stringify(self.toValues(), null, 4);
};

/**
 * Serialize the data frame to CSV.
 */
DataFrame.prototype.toCSV = function () {

	var self = this;
	var data = [self.getColumnNames()].concat(self.toRows());
	return BabyParse.unparse(data);

	/*Old csv stringify.
	var header = self.getColumnNames().join(',');
	var rows = E.from(self.toRows())
			.select(function (row) {
				return row.join(',');
			})
			.select(function (col) { // Strip newlines... these don't work in CSV files.
				if (Object.isString(col)) { //todo: not necessar if all columns are converted to strings.
					return col.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
				}
				else {
					return col;
				}
			})					
			.toArray();
	return [header].concat(rows).join('\r\n');	
	*/
};

/**
 * Transform one or more columns. This is equivalent to extracting a column, calling 'select' on it,
 * then plugging it back in as the same column.
 *
 * @param {object} columnSelectors - Object with field names for each column to be transformed. Each field you be a selector that transforms that column.
 * 
 */
DataFrame.prototype.transformSeries = function (columnSelectors) {

	assert.isObject(columnSelectors, "Expected 'columnSelectors' parameter of 'transformSeries' function to be an object. Field names should specify columns to transform. Field values should be selector functions that specify the transformation for each column.");

	var self = this;
	return E.from(Object.keys(columnSelectors))
		.aggregate(self, function (prevDataFrame, columnName) {
			if (prevDataFrame.hasSeries(columnName)) {
				return prevDataFrame.withSeries(
					columnName,
					prevDataFrame.getSeries(columnName)
						.select(columnSelectors[columnName])
				);			
			}
			else {
				return self;
			}	
		});
};

/** 
 * Generate new columns based on existing rows.
 *
 * @param {function|object} generator - Generator function that transforms each row to a new set of columns.
 */
DataFrame.prototype.generateSeries = function (generator) {

	var self = this;

	//todo: make this lazy.
	//todo: this should merge on index.
	//todo: need to be able to override columns on 1 data frame with columns from another.

	if (!Object.isObject(generator)) {
		assert.isFunction(generator, "Expected 'generator' parameter to 'DataFrame.generateSeries' function to be a function or an object.");

		var newColumns = self.select(generator)
			.bake()
			;

		return E.from(newColumns.getColumnNames())
			.aggregate(self, function (prevDataFrame, newColumnName) {
				return prevDataFrame.withSeries(newColumnName, newColumns.getSeries(newColumnName).bake()).bake();
			})
			;
	}
	else {
		var newColumnNames = Object.keys(generator);
		return E.from(newColumnNames)
			.aggregate(self, function (prevDataFrame, newColumnName) {
				return prevDataFrame.withSeries(newColumnName, prevDataFrame.deflate(generator[newColumnName]).bake()).bake();
			})
			;
	}
};

/** 
 * Deflate a data-frame to a series.
 *
 * @param {function} selector - Selector function that transforms each row to a new sequence of values.
 */
DataFrame.prototype.deflate = function (selector) {

	assert.isFunction(selector, "Expected 'selector' parameter to 'deflate' function to be a function.");

	var self = this;

	return new Series({ 
		iterable: {
			getIterator: function () {
				return new SelectIterator(
					self.getIterator(),
					function (pair) {
						var newValue = selector(pair[1]);
						return [
							pair[0],
							newValue
						];
					}
				);
			},
		},
	});
};

/** 
 * Inflate a named column in the data-frame to 1 or more new columns.
 *
 * @param {string|int} columnNameOrIndex - Name or index of the column to retreive.
 * @param {function} [selector] - Selector function that transforms each value in the column to new columns.
 */
DataFrame.prototype.inflateColumn = function (columnNameOrIndex, selector) {

	var self = this;
	return self.zip(
		self.getSeries(columnNameOrIndex).inflate(selector),
		function (row1, row2) {
			return extend({}, row1, row2); //todo: this be should zip's default operation.
		}
	);
};

/**
 * Aggregate the rows of the data-frame.
 *
 * @param {object} [seed] - The seed value for producing the aggregation.
 * @param {function} selector - Function that takes the seed and then each row in the data-frame and produces the aggregate value.
 */
DataFrame.prototype.aggregate = function (seedOrSelector, selector) {

	var self = this;

	if (Object.isFunction(seedOrSelector) && !selector) {
		return self.skip(1).aggregate(self.first(), seedOrSelector);
	}
	else if (selector) {
		assert.isFunction(selector, "Expected 'selector' parameter to aggregate to be a function.");

		var working = seedOrSelector;
		var it = self.getIterator();
		while (it.moveNext()) {
			var curValue = it.getCurrent()[1];
			working = selector(working, curValue); //todo: should pass index in here as well.
		}

		return working;		
	}
	else {
		assert.isObject(seedOrSelector, "Expected 'seed' parameter to aggregate to be an object.");

		return E.from(Object.keys(seedOrSelector))
			.select(function (columnName) {
				var columnSelector = seedOrSelector[columnName];
				assert.isFunction(columnSelector, "Expected column/selector pairs in 'seed' parameter to aggregate.");
				return [columnName, self.getSeries(columnName).aggregate(columnSelector)];
			})
			.toObject(
				function (pair) {
					return pair[0];
				},
				function (pair) {
					return pair[1];					
				}
			);
	}
};

/**
 * Zip together multiple data-frames to produce a new data-frame.
 *
 * @param {...object} dataFrames - Each data-frame that is to be zipped.
 * @param {function} selector - Selector function that produces a new data-frame based on the inputs.
 */
DataFrame.prototype.zip = function () {

	var dataFrames = E.from(arguments)
		.takeWhile(function (arg) {
			return arg && !Object.isFunction(arg);
		})
		.toArray();

	assert(dataFrames.length >= 0, "Expected 1 or more 'data-frame' parameters to the zip function.");

	dataFrames = [this].concat(dataFrames);

	var selector = E.from(arguments)
		.skipWhile(function (arg) {
			return arg && !Object.isFunction(arg);
		})
		.firstOrDefault();

	assert.isFunction(selector, "Expect 'selector' parameter to zip to be a function.");

	return zipDataFrames(dataFrames, function (rows) {
			return selector.apply(undefined, rows);
		});
};

/**
 * Bring the name column to the front, making it the first column in the data-frame.
 *
 * @param {string|array} columnOrColumns - Specifies the column or columns to bring to the front.
 */
DataFrame.prototype.bringToFront = function (columnOrColumns) {

	if (Object.isArray(columnOrColumns)) {
		columnOrColumns.forEach(function (columnName) {
			assert.isString(columnName, "Expect 'columnOrColumns' parameter to bringToFront function to specify a column or columns via a string or an array of strings.");	
		});
	}
	else {
		assert.isString(columnOrColumns, "Expect 'columnOrColumns' parameter to bringToFront function to specify a column or columns via a string or an array of strings.");

		columnOrColumns = [columnOrColumns]; // Convert to array for coding convenience.
	}

	var self = this;
	var existingColumnNames = self.getColumnNames();
	var columnsToMove = E.from(columnOrColumns) // Strip out non-existing columns.
		.where(function (columnName) {
			return E.from(existingColumnNames).contains(columnName);
		})
		.toArray();

	var remainingColumnNames = E.from(existingColumnNames)
		.where(function (columnName) {
			return !E.from(columnsToMove).contains(columnName);
		})
		.toArray();

	var reorderedColumnNames = columnsToMove.concat(remainingColumnNames);
	return self.remapColumns(reorderedColumnNames);
};

/**
 * Bring the name column to the back, making it the last column in the data-frame.
 *
 * @param {string|array} columnOrColumns - Specifies the column or columns to bring to the back.
 */
DataFrame.prototype.bringToBack = function (columnOrColumns) {

	if (Object.isArray(columnOrColumns)) {
		columnOrColumns.forEach(function (columnName) {
			assert.isString(columnName, "Expect 'columnOrColumns' parameter to bringToBack function to specify a column or columns via a string or an array of strings.");	
		});
	}
	else {
		assert.isString(columnOrColumns, "Expect 'columnOrColumns' parameter to bringToBack function to specify a column or columns via a string or an array of strings.");

		columnOrColumns = [columnOrColumns]; // Convert to array for coding convenience.
	}

	var self = this;
	var existingColumnNames = self.getColumnNames();
	var columnsToMove = E.from(columnOrColumns) // Strip out non-existing columns.
		.where(function (columnName) {
			return E.from(existingColumnNames).contains(columnName);
		})
		.toArray();

	var remainingColumnNames = E.from(existingColumnNames)
		.where(function (columnName) {
			return !E.from(columnsToMove).contains(columnName);
		})
		.toArray();

	var reorderedColumnNames = remainingColumnNames.concat(columnsToMove);
	return self.remapColumns(reorderedColumnNames);
};

/**
 * Reshape (or pivot) a table based on column values.
 *
 * @param {string} column - Column name whose values make the new DataFrame's columns.
 * @param {string} value - Column name whose values populate the new DataFrame's values.
 */
DataFrame.prototype.pivot = function (column, value) {
	var self = this;

	assert.isString(column, "Expected 'column' parameter to DataFrame.pivot to be a string that identifies the column whose values make the new DataFrame's columns.");
	assert.isString(value, "Expected 'value' parameter to DataFrame.pivot to be a string that identifies the column whose values make the new DataFrame's values.");

	if (!self.hasSeries(column)) {
		throw new Error("Expected to find a column with name '" + column + "'.");
	}

	if (!self.hasSeries(value)) {
		throw new Error("Expected to find a column with name '" + value + "'.");
	}

	var newColumnNames = self.getSeries(column).distinct().toValues();

	var newSeries = E.from(newColumnNames) // Create a series for each column
		.select(function (columnName) {
			return self
				.where(function (row) {
					return row[column] === columnName;
				})
				.deflate(function (row) {
					return row[value];
				});
		})
		.toArray();

	return new DataFrame({
		columns: E.from(newColumnNames)
			.zip(newSeries, function (columnName, series) {
				return [columnName, series];
			}) 
			.toObject(
				function (column) {
					return column[0];
				},
				function (column) {
					return column[1].toValues();
				}
			),
	});
};

/**
 * Merge this DataFrame with another.
 *
 * @param {DataFrame} otherDataFrame - The other DataFrame to merge in.
 * @param {string} [columnName] - Optional column name used to join the DataFrames. Omit to merge on index.
 */
DataFrame.prototype.merge = function (otherDataFrame, columnName) {
	assert.instanceOf(otherDataFrame, DataFrame, "Expected 'otherDataFrame' parameter of DataFrame.merge to be a DataFrame.");
	if (columnName) {
		assert.isString(columnName, "Expected optional 'columnName' parameter of DataFrame.merge to be a string that specifies the column to join the DataFrame on.");
	}

	var self = this;
	return mergeDataFrames(self, otherDataFrame, columnName);
};

/**
 * Returns true if the DataFrame contains the specified row.
 *
 * @param {function} row - The row to check for in the DataFrame.
 */
DataFrame.prototype.contains = function (row) {

	var self = this;
	var json = JSON.stringify(row); //todo: This feels somewhat dodgey.

	return self.any(function (searchRow) {
			return JSON.stringify(searchRow) === json;
		});
};

/**
 * Concatenate multiple other dataframes onto this dataframe.
 * 
 * @param {array|DataFrame*} dataFrames - Multiple arguments. Each can be either a dataframe or an array of dataframe. 
 */
DataFrame.prototype.concat = function () {

	var self = this;
	return concatDataFrames(
		[self].concat(
			E.from(arguments)
				.selectMany(function (argument) {
					if (Object.isArray(argument)) {
						return argument;
					}
					else {
						return [argument];
					}
				})
				.toArray()
		)			
	);
};

