'use strict';

// 
// Base class for data frame classes.
//

var Series = require('./series');
var Index = require('./index');
var ArrayIterator = require('./iterators/array');
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
}

/**
 * Constructor for DataFrame.
 *
 * @param {object} config - Specifies content and configuration for the data frame.
 */
var DataFrame = function (config) {

	var self = this;

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
			if (!Object.isFunction(config.columnNames)) {
				assert.isArray(config.columnNames, "Expected 'columnNames' field of 'config' parameter to DataFrame constructor to be an array of column names or function that returns an array of column names.");
			};

			self._columnNames = config.columnNames;
		}
		else {
			self._columnNames = function () { //todo: could just make this the default behavior if no columns are specified ?!
				var iterator = iterable();
				if (!iterator.moveNext()) {
					return [];
				}

				return Object.keys(iterator.getCurrent()[1]);
			};
		}
		self.getIterator = iterable;
		return;
	}

	if (!config.rows) {
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
		if (!Object.isFunction(config.columnNames)) {
			assert.isArray(config.columnNames, "Expected 'columnNames' member of 'config' parameter to DataFrame constructor to be an array of strings or a function that produces an array of strings.");

			config.columnNames.forEach(function (columnName) {
				assert.isString(columnName, "Expected 'columnNames' member of 'config' parameter to DataFrame constructor to be an array of strings or a function that produces an array of strings.");
			});
		}

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
		if (!Object.isFunction(config.rows)) {
			assert.isArray(config.rows, "Expected 'rows' member of 'config' parameter to DataFrame constructor to be an array of JavaScript objects.");
			
			if (config.rows.length > 0) {
				assert.isObject(config.rows[0], "Expected 'rows' member of 'config' parameter to DataFrame constructor to be an array of JavaScript objects.")
			}
		}
	}

	var rows = config.rows;

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
						return new PairIterator(index.getIterator(), convertRowsToObjects(self._columnNames, rows()));
					};
				}
				else {
					this.getIterator = function () {
						return new PairIterator(index.getIterator(), convertRowsToObjects(self._columnNames, new ArrayIterator(rows)));
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
		if (Object.isFunction(rows)) {

			self._columnNames = function () {
				var iterator = config.rows();
				if (!iterator.moveNext()) {
					return [];
				}

				return Object.keys(iterator.getCurrent());
			};				
		}
		else {
			if (config.rows.length > 0) {

				// Derive column names from object fields.
				self._columnNames = Object.keys(config.rows[0]);
			}
			else {
				self._columnNames = [];
			}
		}

		if (config.index) {
			var index = config.index;
			if (Object.isArray(index)) {

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
				if (Object.isFunction(rows)) {
					this.getIterator = function () {
						return new PairIterator(index.getIterator(), rows());
					};
				}
				else {
					this.getIterator = function () {
						return new PairIterator(index.getIterator(), new ArrayIterator(rows));
					};				
				}
			}
		}
		else {
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
	}
};

/**
 * Get the index of the data frame.
 */
DataFrame.prototype.getIndex = function () {
	var self = this;
	return new Index(function () {		
		return new SelectIterator(
			self.getIterator(),
			function (pair) {
				return pair[0]; // Extract index.
			}
		);
	});
};

/**
 * Get the names of the columns in the data frame.
 */
DataFrame.prototype.getColumnNames = function () {
	var self = this;
	if (Object.isFunction(self._columnNames)) {
		self._columnNames = self._columnNames(); // Lazy evaluate column names.
	}
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
DataFrame.prototype.getColumnName = function (columnIndex) { //todo: test
	assert.isNumber(columnIndex, "Expected 'columnIndex' parameter to getColumnIndex to be a non-empty string.");

	var self = this;	
	var columnNames = self.getColumnNames();

	if (columnIndex < 0 || columnIndex >= columnNames.length) {
		return undefined;
	}

	return columnNames[columnIndex];
};

/**
 * Skip a number of rows in the data frame.
 *
 * @param {int} numRows - Number of rows to skip.
 */
DataFrame.prototype.skip = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'skip' function to be a number.");

	var self = this;
	return new DataFrame({
		columnNames: function () {
			return self.getColumnNames();
		},
		iterable: function () {
			return new SkipIterator(self.getIterator(), numRows);
		},
	}); 	
};

/**
 * Skips rows in the data-frame while a condition is met.
 *
 * @param {function} predicate - Return true to indicate the condition met.
 */
DataFrame.prototype.skipWhile = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'skipWhile' function to be a predicate function that returns true/false.");

	var self = this;
	return new DataFrame({
		columnNames: function () {
			return self.getColumnNames();
		},
		iterable: function () {
			return new SkipWhileIterator(self.getIterator(), function (pair) {
					return predicate(pair[1], pair[0]);
				});
		},
	}); 	
};

/**
 * Skips rows in the data-frame until a condition is met.
 *
 * @param {function} predicate - Return true to indicate the condition met.
 */
DataFrame.prototype.skipUntil = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'skipUntil' function to be a predicate function that returns true/false.");

	var self = this;
	return self.skipWhile(function (value, index) { 
		return !predicate(value, index); 
	});
};

/**
 * Take a number of rows in the data frame.
 *
 * @param {int} numRows - Number of rows to take.
 */
DataFrame.prototype.take = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'take' function to be a number.");

	var self = this;
	return new DataFrame({
		columnNames: function () {
			return self.getColumnNames();
		},
		iterable: function () {
			return new TakeIterator(self.getIterator(), numRows);
		},
	}); 	
};

/**
 * Take rows from the data-frame while a condition is met.
 *
 * @param {function} predicate - Return true to indicate the condition met.
 */
DataFrame.prototype.takeWhile = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'takeWhile' function to be a predicate function that returns true/false.");

	var self = this;
	return new DataFrame({
		columnNames: function () {
			return self.getColumnNames();
		},
		iterable: function () {
			return new TakeWhileIterator(self.getIterator(), function (pair) {
					return predicate(pair[1], pair[0]);
				});
		},
	}); 	
};

/**
 * Take rows from the data-frame until a condition is met.
 *
 * @param {function} predicate - Return true to indicate the condition met.
 */
DataFrame.prototype.takeUntil = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'takeUntil' function to be a predicate function that returns true/false.");

	var self = this;
	return self.takeWhile(function (value, index) { 
		return !predicate(value, index); 
	});
};

/**
 * Filter a data frame by a predicate selector.
 *
 * @param {function} filterSelectorPredicate - Predicte function to filter rows of the data frame.
 */
DataFrame.prototype.where = function (filterSelectorPredicate) {
	assert.isFunction(filterSelectorPredicate, "Expected 'filterSelectorPredicate' parameter to 'where' function to be a function.");

	var self = this;
	return new DataFrame({
		columnNames: function () {
			return self.getColumnNames();
		},
		iterable: function () {
			return new WhereIterator(self.getIterator(), function (pair) {
					return filterSelectorPredicate(pair[1], pair[0]);
				});
		},
	}); 	
};

/**
 * Generate a new data frame based on the results of the selector function.
 *
 * @param {function} selector - Selector function that transforms each row to a different data structure.
 */
DataFrame.prototype.select = function (selector) {
	assert.isFunction(selector, "Expected 'selector' parameter to 'select' function to be a function.");

	var self = this;
	return new DataFrame({
		iterable: function () {
			return new SelectIterator(self.getIterator(), function (pair) {
					var newValue = selector(pair[1], pair[0]);
					if (!Object.isObject(newValue)) {
						throw new Error("Expected return value from 'select' selector to be an object that represents a new row in the resulting data-frame.");
					};
					return [
						pair[0],
						newValue,
					];
				});
		},
	}); 	
};

/**
 * Generate a new data frame based on the results of the selector function.
 *
 * @param {function} selector - Selector function that transforms each row to a different data structure.
 */
DataFrame.prototype.selectMany = function (selector) {
	assert.isFunction(selector, "Expected 'selector' parameter to 'selectMany' function to be a function.");

	var self = this;
	return new DataFrame({
		iterable: function () {
			return new SelectManyIterator(self.getIterator(), function (pair) {
				var newRows = selector(pair[1], pair[0]);
				if (!Object.isArray(newRows)) {
					throw new Error("Expected return value from 'selectMany' selector to be a list of objects, each object represents a new row in the resulting data-frame.");
				}

				var newPairs = [];
				for (var newRowIndex = 0; newRowIndex < newRows.length; ++newRowIndex) {
					var newRow = newRows[newRowIndex];
					if (!Object.isObject(newRow)) {
						throw new Error("Expected list returned from 'selectMany' selector to contain only objects, each object represents a new row in the resulting data-frame.");
					};

					newPairs.push([
						pair[0], 
						newRow,
					]);
				}

				return newPairs;
			})
		},
	}); 	
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

//
// Throw an exception if the sort method doesn't make sense.
//
var validateSortMethod = function (sortMethod) {
	assert.isString(sortMethod);
	assert(
		sortMethod === 'orderBy' || 
	   sortMethod === 'orderByDescending' ||
	   sortMethod === 'thenBy' ||
	   sortMethod === 'thenByDescending', 
	   "Expected 'sortMethod' to be one of 'orderBy', 'orderByDescending', 'thenBy' or 'thenByDescending', instead it is '" + sortMethod + "'."
   );
};

//
// Execute a batched sorting command.
//
var executeOrderBy = function (self, batch) {

	assert.isObject(self);
	assert.isArray(batch);
	assert(batch.length > 0);

	//todo: reconsider how this works wih lazy iterators.

	//
	// Don't invoke the sort until we really know what we need.
	//
	var executeLazySort = function () {

		batch.forEach(function (orderCmd) {
			assert.isObject(orderCmd);
			assert.isFunction(orderCmd.sortSelector);
			validateSortMethod(orderCmd.sortMethod);
		});

		var pairs = self.getIterator().realize();

		return E.from(batch)
			.aggregate(E.from(pairs), function (unsorted, orderCmd) {
				return unsorted[orderCmd.sortMethod](function (pair) {
					assert.isArray(pair);
					assert(pair.length === 2);
					return orderCmd.sortSelector(pair[1]);
				}); 
			})
			.toArray();
	};

	return new DataFrame({
		columnNames: function () {
			return self.getColumnNames();
		},
		iterable: function () {
			return new ArrayIterator(executeLazySort());
		},
	});
};

//
// Order by values in a partcular column, either ascending or descending
//
var orderBy = function (self, sortMethod, sortSelector) {
	assert.isObject(self);
	validateSortMethod(sortMethod);
	assert.isFunction(sortSelector);

	var batchOrder = [
		{ 
			sortSelector: sortSelector, 
			sortMethod: sortMethod 
		}
	];

	var sortedDataFrame = executeOrderBy(self, batchOrder);
	sortedDataFrame.thenBy = orderThenBy(self, batchOrder, 'thenBy');
	sortedDataFrame.thenByDescending = orderThenBy(self, batchOrder, 'thenByDescending');	
	return sortedDataFrame;
};

//
// Process a column selector that might be a column name, column index or selector function.
// Returns a selector fucntion.
//
var processColumnSelector = function (self, columnNameOrIndexOrSelector, fnName) {
	assert.isObject(self);
	assert.isString(fnName);

	if (!Object.isFunction(columnNameOrIndexOrSelector)) {

		var columnName;

		if (Object.isNumber(columnNameOrIndexOrSelector)) {
			var columnNames = self.getColumnNames();
			assert(
				columnNameOrIndexOrSelector >= 0 && columnNameOrIndexOrSelector < columnNames.length, 
				"Bad column index specified for 'columnNameOrIndexOrSelector' parameter to 'orderBy', expected a column index >= 0 and < " + columnNames.length
			);
			
			columnName = columnNames[columnNameOrIndexOrSelector];
		}
		else {
			assert.isString(
				columnNameOrIndexOrSelector, 
				"Expected 'columnNameOrIndexOrSelector' parameter to '" + fnName + "' to be a column name, a column index or a selector function."
			);

			columnName = columnNameOrIndexOrSelector;
		}

		columnNameOrIndexOrSelector = function (row) {
				return row[columnName];
			};
	}

	return columnNameOrIndexOrSelector;
};


//
// Generates a thenBy function that is attached to already ordered data frames.
//
var orderThenBy = function (self, batch, nextSortMethod) {
	assert.isObject(self);
	assert.isArray(batch);
	assert(batch.length > 0);
	validateSortMethod(nextSortMethod);
	
	return function (columnNameOrIndexOrSelector) {

		var extendedBatch = batch.concat([
			{
				sortSelector: processColumnSelector(self, columnNameOrIndexOrSelector, 'thenBy'),
				sortMethod: nextSortMethod,
			},
		]);

		var sortedDataFrame = executeOrderBy(self, extendedBatch);
		sortedDataFrame.thenBy = orderThenBy(self, extendedBatch, 'thenBy');
		sortedDataFrame.thenByDescending = orderThenBy(self, extendedBatch, 'thenByDescending');		
		return sortedDataFrame;
	};	
};

/**
 * Sorts a data frame based on a single column (specified by name or index) or by selector (ascending). 
 * 
 * @param {string|index|function} columnNameOrIndexOrSelector - A column name, column index or selector function that indicates the value to sort by.
 */
DataFrame.prototype.orderBy = function (columnNameOrIndexOrSelector) {

	var self = this;
	return orderBy(self, 'orderBy', processColumnSelector(self, columnNameOrIndexOrSelector, 'orderBy'));
};

/**
 * Sorts a data frame based on a single column (specified by name or index) or by selector (descending). 
 * 
 * @param {string|index|function} columnNameOrIndexOrSelector - A column name, column index or selector function that indicates the value to sort by.
 */
DataFrame.prototype.orderByDescending = function (columnNameOrIndexOrSelector) {

	var self = this;
	return orderBy(self, 'orderByDescending', processColumnSelector(self, columnNameOrIndexOrSelector, 'orderByDescending'));
};

/**
 * Create a new data frame with the requested column or columns dropped.
 *
 * @param {string|array} columnOrColumns - Specifies the column name (a string) or columns (array of column names) to drop.
 */
DataFrame.prototype.dropSeries = function (columnOrColumns) {

	var self = this;

	if (!Object.isArray(columnOrColumns)) {
		assert.isString(columnOrColumns, "'dropSeries' expected either a string or an array or strings.");

		columnOrColumns = [columnOrColumns]; // Convert to array for coding convenience.
	}

	return new DataFrame({
		columnNames: function () {
			var columnNames = self.getColumnNames().slice(0); // Clone array.
			return E.from(columnNames)
				.where(function (columnName) {
					return !E.from(columnOrColumns).contains(columnName);
				})
				.toArray();
		},
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
					E.from(self.toValues())
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
					E.from(self.toValues())
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
 * Create a new data-frame from a slice of rows.
 *
 * @param {int|function} startIndexOrStartPredicate - Index where the slice starts or a predicate function that determines where the slice starts.
 * @param {int|function} endIndexOrEndPredicate - Marks the end of the slice, one row past the last row to include. Or a predicate function that determines when the slice has ended.
 * @param {function} [predicate] - Optional predicate to compare index against start/end index. Return true to start or stop the slice.
 */
DataFrame.prototype.slice = function (startIndexOrStartPredicate, endIndexOrEndPredicate, predicate) {

	var self = this;

	var startIndex;
	var endIndex;
	var startPredicate = null;
	var endPredicate = null;

	if (predicate) {
		assert.isFunction(predicate, "Expected 'predicate' parameter to slice function to be function.");
	}

	if (Object.isFunction(startIndexOrStartPredicate)) {
		startPredicate = startIndexOrStartPredicate;
	}
	else {
		startIndex = startIndexOrStartPredicate;
		startPredicate = function (value) {
				return predicate && predicate(value, startIndex) || value < startIndex;
			};
	}

	if (Object.isFunction(endIndexOrEndPredicate)) {
		endPredicate = endIndexOrEndPredicate;
	}
	else {
		endIndex = endIndexOrEndPredicate;
		endPredicate = function (value) {
				return predicate && predicate(value, endIndex) || value < endIndex;
			};
	}

	return new DataFrame({
		columnNames: function () {
			return self.getColumnNames();
		},
		iterable: function () {
			return new TakeWhileIterator(
				new SkipWhileIterator(
					self.getIterator(),
					function (pair) {
						return startPredicate(pair[0]); // Check index for start condition.
					}
				),
				function (pair) {
					return endPredicate(pair[0]); // Check index for end condition.
				}
			);
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
	return new DataFrame({
		columnNames: function () {
			return self.getColumnNames();
		},
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
		columnNames: function () {
			return self.getColumnNames();
		},
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
	var rows = E.from(self.toValues())
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
 * @param {string|int} columnNameOrIndex - Specifies the column to parse.
 */
DataFrame.prototype.parseInts = function (columnNameOrIndex) {

	var self = this;
	return self.setSeries(columnNameOrIndex, self.getSeries(columnNameOrIndex).parseInts());
};

/**
 * Parse a column with string values to a column with float values.
 *
 * @param {string|int} columnNameOrIndex - Specifies the column to parse.
 */
DataFrame.prototype.parseFloats = function (columnNameOrIndex) {

	var self = this;
	return self.setSeries(columnNameOrIndex, self.getSeries(columnNameOrIndex).parseFloats());
};

/**
 * Parse a column with string values to a column with date values.
 *
 * @param {string|int} columnNameOrIndex - Specifies the column to parse.
 * @param {string} [formatString] - Optional formatting string for dates.
 */
DataFrame.prototype.parseDates = function (columnNameOrIndex, formatString) {

	if (formatString) {
		assert.isString(formatString, "Expected optional 'formatString' parameter to parseDates to be a string (if specified).");
	}

	var self = this;
	return self.setSeries(columnNameOrIndex, self.getSeries(columnNameOrIndex).parseDates(formatString));
};

/**
 * Convert a column of values of different types to a column of string values.
 *
 * @param {string|int} columnNameOrIndex - Specifies the column to convert.
 * @param {string} [formatString] - Optional formatting string for dates.
 */
DataFrame.prototype.toStrings = function (columnNameOrIndex, formatString) {

	if (formatString) {
		assert.isString(formatString, "Expected optional 'formatString' parameter to parseDates to be a string (if specified).");
	}

	var self = this;
	return self.setSeries(columnNameOrIndex, self.getSeries(columnNameOrIndex).toStrings(formatString));
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
	var dataForge = require('../index');
	return dataForge.concat(dataFrames).resetIndex();
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
	var dataForge = require('../index');
	return dataForge.concat(dataFrames).resetIndex();
};
/**
 * Produces a new data frame with all string values truncated to the requested maximum length.
 *
 * @param {int} maxLength - The maximum length of the string values after truncation.
 */
DataFrame.prototype.truncateStrings = function (maxLength) {
	assert.isNumber(maxLength, "Expected 'maxLength' parameter to 'truncateStrings' to be an integer.");

	var self = this;
	var truncatedValues = E.from(self.toValues()) //todo: make this function lazy.
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
			columnNames: function () {
				return self.getColumnNames();
			},
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
				E.from(self.toValues())
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
 * Create a new data frame with different column names.
 *
 * @param {array} newColumnNames - Array of strings, with an element for each existing column that specifies the new name of that column.
 */
DataFrame.prototype.renameColumns = function (newColumnNames) {

	var self = this;

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
};

/*
 * Create a new data frame with a single column renamed.
 * 
 * @param {string} columnName - Specifies the column to rename.
 * @param {string} newColumnName - The new name for the specified column.
 */
DataFrame.prototype.renameColumn = function (columnName, newColumnName) {

	var self = this;
	var columnIndex = self.getColumnIndex(columnName);
	if (columnIndex === -1) {
		return self; // No column to be renamed.
	}

	assert.isString(newColumnName, "Expected 'newColumnName' parameter to 'renameColumn' to be a string.");

	var newColumnNames = self.getColumnNames().slice(0); // Clone array.
	newColumnNames[columnIndex] = newColumnName;

	return self.renameColumns(newColumnNames);
};

/**
 * Bake the data frame to an array of rows.
 */
DataFrame.prototype.toValues = function () {

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
 * Bake the data frame to an array of JavaScript objects.
 */
DataFrame.prototype.toObjects = function () {

	var self = this;

	var iterator = self.getIterator();
	validateIterator(iterator);

	var objects = [];

	while (iterator.moveNext()) {
		objects.push(iterator.getCurrent()[1]); // Extract values.
	}

	return objects;
};

/**
 * Serialize the data frame to JSON.
 */
DataFrame.prototype.toJSON = function () {
	var self = this;
	return JSON.stringify(self.toObjects(), null, 4);
};

/**
 * Serialize the data frame to CSV.
 */
DataFrame.prototype.toCSV = function () {

	var self = this;
	var data = [self.getColumnNames()].concat(self.toValues());
	return BabyParse.unparse(data);

	/*Old csv stringify.
	var header = self.getColumnNames().join(',');
	var rows = E.from(self.toValues())
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
 * Retreive the data as pairs of [index, objects].
 */
DataFrame.prototype.toPairs = function () {

	var self = this;

	var iterator = self.getIterator();
	validateIterator(iterator);

	var pairs = [];

	while (iterator.moveNext()) {
		pairs.push(iterator.getCurrent());
	}

	return pairs;
};

/**
 * Forces lazy evaluation to complete and 'bakes' the data frame into memory.
 */
DataFrame.prototype.bake = function () {

	var self = this;
	var pairs = self.toPairs();
	return new DataFrame({
		columnNames: self.getColumnNames(),
		iterable: function () {
			return new ArrayIterator(pairs);
		},
	});
};

/**
 * Count the number of rows in the data frame.
 */
DataFrame.prototype.count = function () {

	var self = this;

	var total = 0;

	var iterator = self.getIterator();

	while (iterator.moveNext()) {
		++total;
	}

	return total;
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
 * Move a window over the data-frame (batch by batch), invoke a selector for each window that builds a new series.
 *
 * @param {integer} period - The number of rows in the window.
 * @param {function} selector - The selector function invoked per row that builds the output series.
 *
 * The selector has the following parameters: 
 *
 *		window - Data-frame that represents the rolling window.
 *		windowIndex - The 0-based index of the window.
 */
DataFrame.prototype.window = function (period, selector) {

	assert.isNumber(period, "Expected 'period' parameter to 'window' to be a number.");
	assert.isFunction(selector, "Expected 'selector' parameter to 'window' to be a function.");

	var self = this;

	return new Series({
		iterable: function () {

			var curOutput = undefined;
			var done = false;
			var windowIndex = 0;

			return {
				moveNext: function () {
					var window = self.skip(windowIndex*period).take(period);
					if (window.count() === 0) {
						return false; //todo: should use .any() function.
					}

					curOutput = selector(window, windowIndex);
					++windowIndex;
					return true;
				},

				getCurrent: function () {
					return curOutput;
				},
			};

		}
	});	
};

/** 
 * Move a window over the data-frame (row by row), invoke a selector for each window that builds a new series.
 *
 * @param {integer} period - The number of rows in the window.
 * @param {function} selector - The selector function invoked per row that builds the output series.
 *
 * The selector has the following parameters: 
 *
 *		window - Data-frame that represents the rolling window.
 *		windowIndex - The 0-based index of the window.
 */
DataFrame.prototype.rollingWindow = function (period, selector) {

	assert.isNumber(period, "Expected 'period' parameter to 'rollingWindow' to be a number.");
	assert.isFunction(selector, "Expected 'selector' parameter to 'rollingWindow' to be a function.");

	var self = this;

	return new Series({
		iterable: function () {

			var curOutput = undefined;
			var done = false;
			var windowIndex = 0;

			return {
				moveNext: function () {
					var window = self.skip(windowIndex).take(period);
					if (window.count() < period) {
						return false;
					}

					curOutput = selector(window, windowIndex);
					++windowIndex;
					return true;
				},

				getCurrent: function () {
					return curOutput;
				},
			};

		}
	});
};

/**
 * Get the first row of the data frame.
 */
DataFrame.prototype.first = function () {

	var self = this;

	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		throw new Error("No rows in data-frame.");
	}

	return iterator.getCurrent()[1];
};

/**
 * Get the last row of the data frame.
 */
DataFrame.prototype.last = function () {

	var self = this;

	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		throw new Error("No rows in data-frame.");
	}

	var last = iterator.getCurrent();

	while (iterator.moveNext()) {
		last = iterator.getCurrent();
	}

	return last[1];
};

/** 
 * Reverse the data-frame.
 */
DataFrame.prototype.reverse = function () {

	var self = this;
	return new DataFrame({
		columnNames: function () {
			return self.getColumnNames();
		},
		iterable: function () {
			return new ArrayIterator(
				E.from(self.getIterator().realize())
					.reverse()
					.toArray()
			);
		},
	});
};

/** 
 * Generate new columns based on existing rows.
 *
 * @param {function} selector - Selector function that transforms each row to a new set of columns.
 */
DataFrame.prototype.generateColumns = function (selector) {

	assert.isFunction(selector, "Expected 'selector' parameter to 'generateColumns' function to be a function.");

	var self = this;

	//todo: make this lazy.
	//todo: this should merge on index.
	//todo: need to be able to override columns on 1 data frame with columns from another.

	var newColumns = self.select(selector);

	return E.from(newColumns.getColumnNames())
		.aggregate(self, function (prevDataFrame, newColumnName) {
			return prevDataFrame.setSeries(newColumnName, newColumns.getSeries(newColumnName));
		});
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
	var dataForge = require('../index');

	return self.zip(  //todo: this shoudn't purge the index.
		self.getSeries(columnNameOrIndex).inflate(selector),
		function (row1, row2) {
			return extend({}, row1, row2); //todo: this be should zip's default operation.
		}
	);
};

/** 
 * Get X rows from the head of the data frame.
 *
 * @param {int} numRows - Number of rows to take.
 */
DataFrame.prototype.head = function (numRows) {

	assert.isNumber(numRows, "Expected 'numRows' parameter to 'head' function to be a function.");

	var self = this;
	return self.take(numRows);
};

/** 
 * Get X rows from the tail of the data frame.
 *
 * @param {int} numRows - Number of rows to take.
 */
DataFrame.prototype.tail = function (numRows) {

	assert.isNumber(numRows, "Expected 'numRows' parameter to 'tail' function to be a function.");

	var self = this;
	return self.skip(self.count() - numRows);
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

	return E.from(self.toObjects()).toObject(keySelector, valueSelector);
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

	var dataForge = require('../index.js');
	return dataForge.zipDataFrames(dataFrames, function (rows) {
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
 * Invoke a callback function for each row in the DataFrame.
 *
 * @param {function} callback - The calback to invoke for each row.
 */
DataFrame.prototype.forEach = function (callback) {
	assert.isFunction(callback, "Expected 'callback' parameter to 'forEach' function to be a function.");

	var self = this;
	var iterator = self.getIterator();
	validateIterator(iterator);

	while (iterator.moveNext()) {
		var pair = iterator.getCurrent();
		callback(pair[1], pair[0]);
	}

	return self;
};

/**
 * Group the data-frame into multiple data-frames on the value defined by the selector.
 *
 * @param {function} selector - Function that selects the value to group by.
 */
DataFrame.prototype.groupBy = function (selector) {
	assert.isFunction(selector, "Expected 'selector' parameter to 'groupBy' function to be a function.");

	//todo: make this lazy.

	var self = this;
	return E.from(self.toPairs())
		.groupBy(function (pair) {
			return selector(pair[1], pair[0]);
		})
		.select(function (group) {
			return {
				key: group.key(),
				data: new DataFrame({
					iterable: function () {
						return new ArrayIterator(group.getSource());
					},
				}),
			};
		})
		.toArray();
};

module.exports = DataFrame;