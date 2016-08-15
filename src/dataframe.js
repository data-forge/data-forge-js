'use strict';

// 
// Base class for data frame classes.
//

var ArrayIterator = require('./iterators/array');
var MultiIterator = require('./iterators/multi');
var PairIterator = require('./iterators/pair');
var SkipIterator = require('./iterators/skip');
var SkipWhileIterator = require('./iterators/skip-while');
var BabyParse = require('babyparse');
var SelectIterator = require('../src/iterators/select');
var SelectManyIterator = require('../src/iterators/select-many');
var TakeIterator = require('../src/iterators/take');
var TakeWhileIterator = require('../src/iterators/take-while');
var WhereIterator = require('../src/iterators/where');
var CountIterator = require('../src/iterators/count');
var EmptyIterator = require('../src/iterators/empty');
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

	if (!config) {
		self._columnNames = [];
		self.getIterator = function () {
			return new EmptyIterator();
		};
		return;
	}

	if (config.iterable) {

		assert.isFunction(config.iterable, "Expected 'iterable' field of 'config' parameter to DataFrame constructor to be a function that returns an index/value pairs iterator.");

		var iterable = config.iterable;

		if (config.columnNames) {
			assert.isArray(config.columnNames, "Expected 'columnNames' field of 'config' parameter to DataFrame constructor to be an array of column names or function that returns an array of column names.");

			self._columnNames = config.columnNames;
		}
		else {
			self._columnNames = determineColumnNamesFromPairsIterable(iterable, config.considerAllRows);
		}
		self.getIterator = iterable;
		return;
	}

	if (!config.rows &&  !config.columns) {
		self._columnNames = config.columnNames || [];
		self.getIterator = function () {
			return new EmptyIterator();
		};
		return;
	}

	assert.isObject(config, "Expected 'config' parameter to DataFrame constructor to be an object with options for initialisation.");

	if (config.index) {
		if (!Object.isArray(config.index)) {
			assert.isObject(config.index, "Expected 'index' member of 'config' parameter to DataFrame constructor to be an object.");			
		}
	}

	if (config.columnNames) {
		assert.isArray(config.columnNames, "Expected 'columnNames' member of 'config' parameter to DataFrame constructor to be an array of strings or a function that produces an array of strings.");

		config.columnNames.forEach(function (columnName) {
			assert.isString(columnName, "Expected 'columnNames' member of 'config' parameter to DataFrame constructor to be an array of strings or a function that produces an array of strings.");
		});

		if (!config.rows) {
			throw new Error("Expected to find a 'rows' member of 'config' parameter to DataFrame constructor.");
		}

	 	if (!Object.isFunction(config.rows)) {
			assert.isArray(config.rows, "Expected 'rows' member of 'config' parameter to DataFrame constructor to be an array of rows.");

			if (config.debug) {
				config.rows.forEach(function (row) {
					assert.isArray(row, "Expected 'rows' member of 'config' parameter to DataFrame constructor to be an array of arrays, an array of objects or an iterator.");
				});
			}
		}
	}
	else if (config.rows) {
		assert(!config.columns, "Can't use both 'rows' and 'columns' fields of 'config' parameter to DataFrame constructor.");

		if (!Object.isFunction(config.rows)) {
			assert.isArray(config.rows, "Expected 'rows' member of 'config' parameter to DataFrame constructor to be an array of JavaScript objects.");
			
			if (config.rows.length > 0) {
				assert.isObject(config.rows[0], "Expected 'rows' member of 'config' parameter to DataFrame constructor to be an array of JavaScript objects.")
			}
		}
	}
	else if (config.columns) {
		assert.isObject(config.columns, "Expected 'columns' member of 'config' parameter to DataFrame constructor to be an object with fields that define columns.");
	}

	var rows = config.rows;
	var columns = config.columns;

	if (config.columnNames)	{
		self._columnNames = config.columnNames;

		if (config.index) {
			var index = config.index;
			if (Object.isArray(index)) {

				if (Object.isFunction(rows)) {
					this.getIterator = function () {
						return new PairIterator(new ArrayIterator(index), convertRowsToObjects(self._columnNames, rows()));
					};
				}
				else {
					this.getIterator = function () {
						return new PairIterator(new ArrayIterator(index), convertRowsToObjects(self._columnNames, new ArrayIterator(rows)));
					};
				}
			}
			else {
				if (Object.isFunction(rows)) {
					this.getIterator = function () {
						return new PairIterator(
							new SelectIterator(
								index.getIterator(),
								function (pair) {
									return pair[1];
								} 
							),	
							convertRowsToObjects(self._columnNames, rows())
						);
					};
				}
				else {
					this.getIterator = function () {
						return new PairIterator(
							new SelectIterator(
								index.getIterator(),
								function (pair) {
									return pair[1];
								}
							),
							convertRowsToObjects(self._columnNames, new ArrayIterator(rows))
						);
					};				
				}
			}
		}
		else {
			if (Object.isFunction(rows)) {
				this.getIterator = function () {
					return new PairIterator(new CountIterator(), convertRowsToObjects(self._columnNames, rows()));
				};
			}
			else {
				this.getIterator = function () {
					return new PairIterator(new CountIterator(), convertRowsToObjects(self._columnNames, new ArrayIterator(rows)));
				};
			}
		}	
	}
	else {
		if (rows) {
			if (Object.isFunction(rows)) {
				self._columnNames = determineColumnNamesFromObjectsIterable(rows, config.considerAllRows);
			}
			else {
				// Derive column names from object fields.
				self._columnNames = determineColumnNamesFromObjectRows(rows, config.considerAllRows);
			}
		}
		else {
			self._columnNames = Object.keys(columns);
		}

		if (config.index) {
			var index = config.index;
			if (Object.isArray(index)) {

				if (rows) {
					if (Object.isFunction(rows)) {
						this.getIterator = function () {
							return new PairIterator(new ArrayIterator(index), rows());
						};
					}
					else {
						this.getIterator = function () {
							return new PairIterator(new ArrayIterator(index), new ArrayIterator(rows));
						};
					}
				}
				else {
					this.getIterator = function () {
						var columnIterators = E.from(self._columnNames)
							.select(function (columnName) {
								return new ArrayIterator(columns[columnName]);
							})
							.toArray();
						return new PairIterator(new ArrayIterator(index), convertRowsToObjects(self._columnNames, new MultiIterator(columnIterators)));
					};
				}
			}
			else {
				if (rows) {
					if (Object.isFunction(rows)) {
						this.getIterator = function () {
							return new PairIterator(
								new SelectIterator(
									index.getIterator(),
									function (pair) {
										return pair[1];
									}	
								), 
								rows()
							);
						};
					}
					else {
						this.getIterator = function () {
							return new PairIterator(
								new SelectIterator(
									index.getIterator(),
									function (pair) {
										return pair[1];
									}
								), 
								new ArrayIterator(rows)
							);
						};				
					}
				}
				else {
					this.getIterator = function () {
						var columnIterators = E.from(self._columnNames)
							.select(function (columnName) {
								return new ArrayIterator(columns[columnName]);
							})
							.toArray();
						return new PairIterator(
							new SelectIterator(
								index.getIterator(),
								function (pair) {
									return pair[1];
								}
							), 
							convertRowsToObjects(self._columnNames, new MultiIterator(columnIterators)))
						;
					};
				}
			}
		}
		else {
			if (rows) {
				if (Object.isFunction(rows)) {
					this.getIterator = function () {
						return new PairIterator(new CountIterator(), rows());
					};
				}
				else {
					this.getIterator = function () {
						return new PairIterator(new CountIterator(), new ArrayIterator(rows));
					};
				}
			}
			else {
				this.getIterator = function () {
						var columnIterators = E.from(self._columnNames)
							.select(function (columnName) {
								return new ArrayIterator(columns[columnName]);
							})
							.toArray();
						return new PairIterator(new CountIterator(), convertRowsToObjects(self._columnNames, new MultiIterator(columnIterators)));
				};
			}
		}
	}
};

module.exports = DataFrame;

var Series = require('./series');
var parent = inherit(DataFrame, Series);

var concatDataFrames = require('./concat-dataframes');
var zipDataFrames = require('./zip-dataframes');
var mergeSeries = require('./merge-series');
var mergeDataFrames = require('./merge-dataframes');

/**
 * Get the index of the data frame.
 */
DataFrame.prototype.getIndex = function () {
	var self = this;
	return new Series({
		iterable: function () {		
			return new SelectIterator(
				self.getIterator(),
				function (pair, index) {
					return [index, pair[0]]; // Extract index.
				}
			);
		},
	});
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
	return new EmptyIterator(); // This function is defined by the constructor.
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
		iterable: function () {
			return new WhereIterator(
				new SelectIterator(self.getIterator(), function (pair) {
					return [
						pair[0],
						pair[1][columnName],
					];
				}),
				function (pair) {
					return pair[1] !== undefined;
				}
			);
		},
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
		columnNames: columnNames,
		iterable: function () {
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
		iterable: function () {
			return new SelectIterator(
				self.getIterator(),
				function (pair) {
					var row = extend({}, pair[1]);
					columnOrColumns.forEach(function (columnName) {
						delete row[columnName];
					});
					return [
						pair[0],
						row
					];					
				}
			);
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
		columnNames: columnOrColumns,
		iterable: function () {
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
	});
};
/**
 * Create a new data frame with an additional column specified by the passed-in series.
 *
 * @param {string} columnName - The name of the column to add or replace.
 * @param {array|column} data - Array of data or column that contains data.
 */
DataFrame.prototype.setSeries = function (columnName, data) {

	assert.isString(columnName, "Expected 'columnName' parameter to 'setSeries' function to be a string that specifies the column to set or replace.");

	var self = this;

	if (Object.isFunction(data)) {
		data = E.from(self.toPairs()) //todo: make this lazy
			.select(function (pair) {
				return data(pair[1], pair[0]);
			})
			.toArray();
	}
	else if (!Object.isArray(data)) {
		assert.isObject(data, "Expected 'data' parameter to 'setSeries' to be either an array or a series object.");
		assert.isFunction(data.reindex, "Expected 'data' parameter to 'setSeries' to have a 'reindex' function that allows the column to be reindexed.");

		data = data.reindex(self.getIndex()).toValues();
	}

	//todo: overview and improve the way this works.

	var columnIndex = self.getColumnIndex(columnName);
	if (columnIndex < 0) {		
		// Add new column.
		return new DataFrame({
			columnNames: self.getColumnNames().concat([columnName]),
			rows: function () {
				return new ArrayIterator(
					E.from(self.toRows())
						.select(function (row, rowIndex) {
							return row.concat([data[rowIndex]]);
						})
						.toArray()
				);
			},
			index: self.getIndex(),
		});
	}
	else {
		// Replace existing column.
		return new DataFrame({
			columnNames: E.from(self.getColumnNames())
				.select(function (thisColumnName, thisColumnIndex) {
					if (thisColumnIndex === columnIndex) {
						return columnName;
					}
					else { 
						return thisColumnName;
					}
				})
				.toArray(),
			rows: function () {
				return new ArrayIterator(
					E.from(self.toRows())
						.select(function (row, rowIndex) {
							return E.from(row)
								.select(function (column, thisColumnIndex) {
									if (thisColumnIndex === columnIndex) {
										return data[rowIndex];
									}
									else {
										return column;
									}
								})
								.toArray();
						})
						.toArray()
				);
			},
			index: self.getIndex(),
		});
	}
};

/**
 * Set a named column as the index of the data-frame.
 *
 * @param {string} columnName - Name or index of the column to set as the index.
 */
DataFrame.prototype.setIndex = function (columnName) {

	var self = this;
	return new DataFrame({
		columnNames: self.getColumnNames(),
		iterable: function () {
			return new PairIterator(
				new SelectIterator(
					self.getSeries(columnName).getIterator(),
					function (pair) {
						return pair[1];
					}
				),				
				new SelectIterator(
					self.getIterator(),
					function (pair) {
						return pair[1];
					}
				)
			);
		},
	});
};

/**
 * Reset the index of the data frame back to the default sequential integer index.
 */
DataFrame.prototype.resetIndex = function () {

	var self = this;
	return new DataFrame({
		columnNames: self.getColumnNames(),
		iterable: function () {
			return new SelectIterator(
				self.getIterator(),
				function (pair, i) {
					return [i, pair[1]];
				}
			);
		},
	});
};

/** 
 * Format the data frame for display as a string.
 */
DataFrame.prototype.toString = function () {

	var self = this;
	var Table = require('easy-table');

	var index = self.getIndex().toValues();
	var header = ["__index__"].concat(self.getColumnNames());
	var rows = E.from(self.toRows())
		.select(function (row, rowIndex) { 
			return [index[rowIndex]].concat(row);
		})
		.toArray()

	var t = new Table();
	rows.forEach(function (row, rowIndex) {
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
				return self.setSeries(columnName, self.getSeries(columnName).parseInts());
			});
	}
	else {
		return self.setSeries(columnNameOrNames, self.getSeries(columnNameOrNames).parseInts());
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
				return self.setSeries(columnName, self.getSeries(columnName).parseFloats());
			});
	}
	else {
		return self.setSeries(columnNameOrNames, self.getSeries(columnNameOrNames).parseFloats());
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
				return self.setSeries(columnName, self.getSeries(columnName).parseDates(formatString));
			});
	}
	else {
		return self.setSeries(columnNameOrNames, self.getSeries(columnNameOrNames).parseDates(formatString));
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
				return self.setSeries(columnName, self.getSeries(columnName).toStrings(formatString));
			});
	}
	else {
		return self.setSeries(columnNameOrNames, self.getSeries(columnNameOrNames).toStrings(formatString));
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
			var numValues = series.toValues().length;
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
				.setSeries('Column', newSeries);
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
			return column.series.detectValues().setSeries('Column', newSeries);
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
			rows: truncatedValues,
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
		rows: function () { //todo: make this properly lazy.
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
			columnNames: newColumnNames,
			iterable: function () {
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
		var curRow = iterator.getCurrent()[1];

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
 * Forces lazy evaluation to complete and 'bakes' the data frame into memory.
 */
DataFrame.prototype.bake = function () {

	var self = this;
	if (self._baked) {
		// Already baked, just return self.
		return self;
	}

	var pairs = self.toPairs();
	var baked = new DataFrame({
		columnNames: self.getColumnNames(),
		iterable: function () {
			return new ArrayIterator(pairs);
		},
	});
	baked._baked = true;
	return baked;
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
				return prevDataFrame.setSeries(
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
				return prevDataFrame.setSeries(newColumnName, newColumns.getSeries(newColumnName).bake()).bake();
			})
			;
	}
	else {
		var newColumnNames = Object.keys(generator);
		return E.from(newColumnNames)
			.aggregate(self, function (prevDataFrame, newColumnName) {
				return prevDataFrame.setSeries(newColumnName, prevDataFrame.deflate(generator[newColumnName]).bake()).bake();
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
			iterable: function () {
				return new SelectIterator(
					self.getIterator(),
					function (pair) {
						var newValue = selector(pair[1], pair[0]);
						return [
							pair[0],
							newValue
						];
					}
				);
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
 * Convert the data-frame to a JavaScript object.
 *
 * @param {function} keySelector - Function that selects keys for the resulting object.
 * @param {valueSelector} keySelector - Function that selects values for the resulting object.
 */
DataFrame.prototype.toObject = function (keySelector, valueSelector) {

	var self = this;

	assert.isFunction(keySelector, "Expected 'keySelector' parameter to toObject to be a function.");
	assert.isFunction(valueSelector, "Expected 'valueSelector' parameter to toObject to be a function.");

	return E.from(self.toValues()).toObject(keySelector, valueSelector);
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
 * Collapse distinct rows in the dataframe based on the output of 'valueSelector'.
 *
 * @param {function} valueSelector - Selects the value used to compare for duplicates.
 */
DataFrame.prototype.distinct = function (valueSelector, obsoleteSelector) {
	
	assert.isFunction(valueSelector, "Expected 'valueSelector' parameter to 'DataFrame.distinct' to be a function.")
	assert(!obsoleteSelector, "Selector parameter is obsolete and no longer required.");

	var self = this;

	//todo: make this lazy.

	/* todo: Want to zip here, when zip can specify the index. 

	series.zip(series.skip(1), function (prev, next) { 
		});

	*/

	var input = E.from(self.toPairs())
		.select(function (pair) {
			return {
				pair: pair,
				considered: false,
			};
		})
		.toArray();

	var output = [];

	for (var i = 0; i < input.length; ++i) {
		var underConsideration = input[i];
		if (underConsideration.considered) {
			// Skip this item, it has already been dealt with.
			continue;
		}

		var curPair = underConsideration.pair;
		underConsideration.considered = true; // Don't really need to do this, because we never backtrack, but it feels like it makes the code 'complete'.

		var firstValue = valueSelector(underConsideration.pair[1], underConsideration.pair[0]);

		for (var j = i+1; j < input.length; ++j) {
			var underComparison = input[j];
			if (underComparison.considered) {
				continue;
			}

			if (valueSelector(underComparison.pair[1], underComparison.pair[0]) === firstValue) {
				underComparison.considered = true;
			}
		}

		output.push(curPair);
	}

	return new DataFrame({
		iterable: function () {
			return new ArrayIterator(output);
		},
	});
};

/**
 * Groups sequential values into variable length 'windows'. The windows can then be transformed/transformed using selectPairs or selectManyPairs.
 *
 * @param {function} comparer - Predicate that compares two rows and returns true if they should be in the same window.
 */
DataFrame.prototype.variableWindow = function (comparer, obsoleteSelector) {

	assert.isFunction(comparer, "Expected 'comparer' parameter to 'variableWindow' to be a function.")
	assert(!obsoleteSelector, "Selector parameter is obsolete and no longer required.");

	var self = this;

	//todo: make this lazy.

	/* todo: Want to zip here, when zip can specify the index. 

	series.zip(series.skip(1), function (prev, next) { 
		});

	*/

	var input = self.toPairs();

	var output = [];

	if (input.length > 0) {

		var startIndex = 0;
		var takeAmount = 1;
		var windowIndex = 0;

		var prevPair = input[0]; // 1st pair.

		for (var i = 1; i < input.length; ++i) {

			var curPair = input[i];
			
			if (!comparer(prevPair[1], curPair[1])) {

				// Flush.
				output.push([windowIndex, self.skip(startIndex).take(takeAmount)]);
				++windowIndex;

				startIndex = i;
				takeAmount = 1;
			}
			else {
				++takeAmount;
			}

			prevPair = curPair;
		}

		if (takeAmount > 0) {
			output.push([windowIndex, self.skip(startIndex).take(takeAmount)]);
		}
	}

	return new DataFrame({
			rows: E.from(output)
				.select(function (pair) {
					return pair[1];
				})
				.toArray(),
			index: new Series({
				values: E.from(output)
					.select(function (pair) {
						return pair[0];
					})
					.toArray()
			})
	});
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

	return mergeSeries(newColumnNames, newSeries);
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
 * Inesrt a pair to the start of a DataFrame.
 *
 * @param {pair} pair - The pair to insert.
 */
DataFrame.prototype.insertPair = function (pair) {
	assert.isArray(pair, "Expected 'pair' parameter to 'DataFrame.insertPair' to be an array.");
	assert(pair.length === 2, "Expected 'pair' parameter to 'DataFrame.insertPair' to be an array with two elements. The first element is the index, the second is the row.");

	//todo: make this lazy.

	var self = this;
	var pairs = [pair].concat(self.toPairs());
	return new DataFrame({
		iterable: function () {
			return new ArrayIterator(pairs);
		},
	});
};

/**
 * Append a pair to the end of a DataFrame.
 *
 * @param {pair} pair - The pair to append.
 */
DataFrame.prototype.appendPair = function (pair) {
	assert.isArray(pair, "Expected 'pair' parameter to 'DataFrame.appendPair' to be an array.");
	assert(pair.length === 2, "Expected 'pair' parameter to 'DataFrame.appendPair' to be an array with two elements. The first element is the index, the second is the row.");

	//todo: make this lazy.

	var self = this;
	var pairs = self.toPairs();
	pairs.push(pair);
	return new DataFrame({
		iterable: function () {
			return new ArrayIterator(pairs);
		},
	});
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
 * Concatenate a data-frame on the end of this one and return the concatenated data-frame.
 *
 * @param {DataFrame} otherDataFrame - The data-frame to concatenate to the end of this one.
 */
DataFrame.prototype.concat = function (otherDataFrame) {

	assert.instanceOf(otherDataFrame, DataFrame, "Expected 'otherDataFrame' parameter to 'DataFrame.concat' to be an instance of DataFrame.");

	//todo: make this lazy.

	var self = this;

	return new DataFrame({
		iterable: function () {
			return new ArrayIterator(self.toPairs().concat(otherDataFrame.toPairs()))
		},
	})
};
