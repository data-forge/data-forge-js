'use strict';

// 
// Base class for data frame classes.
//

var Column = require('./column');
var LazySeries = require('./lazyseries');
var LazyIndex = require('./lazyindex');
var ArrayIterator = require('./iterators/array');
var BabyParse = require('babyparse');

var assert = require('chai').assert; 
var E = require('linq');

//
// Helper function to validate an iterator.
//
var validateEnumerator = function (iterator) {
	assert.isObject(iterator, "Expected an 'iterator' object.");
	assert.isFunction(iterator.moveNext, "Expected iterator to have function 'moveNext'.");
	assert.isFunction(iterator.getCurrent, "Expected iterator to have function 'getCurrent'.");
};

//
// Help function to grab a column index from a 'column name or index' parameter.
//
var parseColumnNameOrIndex = function (dataFrame, columnNameOrIndex, failForNonExistantColumn) {

	if (Object.isString(columnNameOrIndex)) {
		var columnIndex = dataFrame.getColumnIndex(columnNameOrIndex);
		if (failForNonExistantColumn && columnIndex < 0) {
			throw new Error("Failed to find column with name '" + columnNameOrIndex + "'.");
		}
		return columnIndex;
	}
	else {	
		assert.isNumber(columnNameOrIndex, "Expected 'columnNameOrIndex' parameter e either a string or index that specifies an existing column.");

		return columnNameOrIndex;
	}
};

/**
 * Base class for data frames.
 *
 * Derived classes must implement:
 *
 * getIndex - Get the index for the data frame.
 * getColumnNames - Get the columns for the data frame.
 * getIterator - Get a row iterator for the data frame.
 */
var BaseDataFrame = function () {
};

//
// Map a row of data to a JS object with column names as fields.
//
var mapRowByColumns = function (self, row) {

	return E.from(self.getColumnNames())
		.zip(row, function (columnName, columnValue) {
			return [columnName, columnValue];
		})
		.toObject(
			function (column) {
				return column[0];
			},
			function (column) {
				return column[1];
			}
		);
};

/**
 * Gets a column index from a column name.
 *
 * @param {string} columnName - The name of the column to retrieve the column index for.
 *
 * @returns {Number} Returns the index of the named column or -1 if the requested column was not found.
 */
BaseDataFrame.prototype.getColumnIndex = function (columnName) {
	assert.isString(columnName, "Expected 'columnName' parameter to getColumnIndex to be a non-empty string.");
	
	var self = this;	
	var columnNames = self.getColumnNames();
	
	for (var i = 0; i < columnNames.length; ++i) {
		if (columnName == columnNames[i]) {
			return i;
		}
	}	
	
	return -1;
};

/**
 * Skip a number of rows in the data frame.
 *
 * @param {int} numRows - Number of rows to skip.
 */
BaseDataFrame.prototype.skip = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'skip' function to be a number.");

	var LazyDataFrame = require('./lazydataframe'); // Require here to prevent circular ref.
	
	var self = this;
	return new LazyDataFrame(
		function () {
			return self.getColumnNames();
		},
		function () {
			var iterator = self.getIterator();

			return {
				moveNext: function () {
					while (--numRows >= 0 && iterator.moveNext()) {
						// Skip first rows.
					}
					return iterator.moveNext();
				},

				getCurrent: function () {
					return iterator.getCurrent();
				},
			};
		},
		function () {
			return self.getIndex().skip(numRows);
		}
	); 	
};

/**
 * Take a number of rows in the data frame.
 *
 * @param {int} numRows - Number of rows to take.
 */
BaseDataFrame.prototype.take = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'take' function to be a number.");

	var LazyDataFrame = require('./lazydataframe'); // Require here to prevent circular ref.
	
	var self = this;
	return new LazyDataFrame(
		function () {
			return self.getColumnNames();
		},
		function () {
			var iterator = self.getIterator();

			return {
				moveNext: function () {
					if (--numRows >= 0) {
						return iterator.moveNext();
					}
					return false;
				},

				getCurrent: function () {
					return iterator.getCurrent();
				},
			};
		},
		function () {
			return self.getIndex().take(numRows);
		}
	); 	
};

/**
 * Filter a data frame by a predicate selector.
 *
 * @param {function} filterSelectorPredicate - Predicte function to filter rows of the data frame.
 */
BaseDataFrame.prototype.where = function (filterSelectorPredicate) {
	assert.isFunction(filterSelectorPredicate, "Expected 'filterSelectorPredicate' parameter to 'where' function to be a function.");

	var self = this;

	var cachedFilteredIndexAndValues = null;

	//
	// Lazy execute the filtering.
	//
	var executeLazyWhere = function () {

		if (cachedFilteredIndexAndValues) {
			return cachedFilteredIndexAndValues;
		}

		cachedFilteredIndexAndValues = E
			.from(self.getIndex().toValues())
			.zip(self.toValues(), function (index, values) {
				return [index, values];
			})
			.where(function (data) {
				var row = data[1];
				return filterSelectorPredicate(mapRowByColumns(self, row));
			})
			.toArray();
		return cachedFilteredIndexAndValues;
	}

	var LazyDataFrame = require('./lazydataframe');
	return new LazyDataFrame(
		function () {
			return self.getColumnNames();
		},
		function () {
			return new ArrayIterator(
				E.from(executeLazyWhere())
					.select(function (data) {
						return data[1]; // Row
					})
					.toArray()
			);
		},
		function () {
			return new LazyIndex(
				function () {
					return new ArrayIterator(E.from(executeLazyWhere())
						.select(function (data) {
							return data[0]; // Index
						})
						.toArray()
					);
				}
			);
		}
	); 	
};

/**
 * Generate a new data frame based on the results of the selector function.
 *
 * @param {function} selector - Selector function that transforms each row to a different data structure.
 */
BaseDataFrame.prototype.select = function (selector) {
	assert.isFunction(selector, "Expected 'selector' parameter to 'select' function to be a function.");

	var self = this;

	var newValues = null;
	var newColumnNames = null;

	var lazyEvaluate = function () {
		if (newValues) {
			return;
		}

		newValues = E
			.from(self.toValues())
			.select(function (row) {
				return selector(mapRowByColumns(self, row));
			})
			.toArray();

		newColumnNames = E.from(newValues)
			.selectMany(function (value) {
				return Object.keys(value);
			})
			.distinct()
			.toArray();
	};

	var LazyDataFrame = require('./lazydataframe');
	return new LazyDataFrame(
		function () {
			lazyEvaluate();
			return newColumnNames;
		},
		function () {
			lazyEvaluate();
			return new ArrayIterator(
				E.from(newValues)
					.select(function (value) {
						return E.from(newColumnNames)
							.select(function (columnName) {
								return value[columnName];
							})
							.toArray();
					})
					.toArray()
			);
		},
		function () {
			return self.getIndex();
		}
	); 	
};

/**
 * Generate a new data frame based on the results of the selector function.
 *
 * @param {function} selector - Selector function that transforms each row to a different data structure.
 */
BaseDataFrame.prototype.selectMany = function (selector) {
	assert.isFunction(selector, "Expected 'selector' parameter to 'selectMany' function to be a function.");

	var self = this;

	var newColumnNames = null;
	var newValues = null;
	var newRows = null;

	var lazyEvaluate = function () {

		if (newValues) {
			return;
		}

		newValues = E.from(self.getIndex().toValues())
			.zip(self.toValues(), function (index, row) {
				return [index, selector(mapRowByColumns(self, row))];
			})
			.toArray();

		newColumnNames = E.from(newValues)
			.selectMany(function (data) {
				var values = data[1];
				return E.from(values)
					.selectMany(function (value) {
						return Object.keys(value);
					})
					.toArray();
			})
			.distinct()
			.toArray();

		newRows = E.from(newValues)
			.selectMany(function (data) {
				var values = data[1];
				return E.from(values)
					.select(function (value) {
						return E.from(newColumnNames)
							.select(function (columnName) {
								return value[columnName];
							})
							.toArray();
					})
					.toArray();
			})
			.toArray();
	};

	var LazyDataFrame = require('./lazydataframe');
	return new LazyDataFrame(
		function () {
			lazyEvaluate();
			return newColumnNames;
		},
		function () {
			lazyEvaluate();
			return new ArrayIterator(newRows);
		},
		function () {
			return new LazyIndex(
				function () {
					lazyEvaluate();
					var indexValues = E.from(newValues)
						.selectMany(function (data) {
							var index = data[0];
							var values = data[1];
							return E.range(0, values.length)
								.select(function (_) {
									return index;
								})
								.toArray();
						})
						.toArray();
					return new ArrayIterator(indexValues);
				}
			);
		}
	); 	
};

/**
 * Retreive a time-series from a column of the data-frame.
 *
 * @param {string|int} columnNameOrIndex - Name or index of the column to retreive.
 */
BaseDataFrame.prototype.getSeries = function (columnNameOrIndex) {
	var self = this;

	var columnIndex = parseColumnNameOrIndex(self, columnNameOrIndex, true);

	return new LazySeries(
		function () {
			return new ArrayIterator(E.from(self.toValues())
				.select(function (entry) {
					return entry[columnIndex];
				})
				.toArray()
			);					
		},
		self.getIndex()
	);
};

/**
 * Returns true if the column with the requested name exists in the data frame.
 *
 * @param {string} columnName - Name of the column to check.
 */
BaseDataFrame.prototype.hasSeries = function (columnName) {

	assert.isString(columnName);

	var self = this;
	return self.getColumnIndex(columnName) >= 0;
};

/**
 * 
 * Verify the existance of a column and return it.
 * Throws an exception if the column doesn't exist.
 *
 * @param {string|int} columnNameOrIndex - Name or index of the column to retreive.
 */
BaseDataFrame.prototype.expectSeries = function (columnNameOrIndex) {

	var self = this;
	parseColumnNameOrIndex(self, columnNameOrIndex, true);
	return self;
};

/** 
 * Retreive a collection of all columns.
 */
BaseDataFrame.prototype.getColumns = function () {

	var self = this;

	return E.from(self.getColumnNames())
		.select(function (columnName) {
			return new Column(columnName, self.getSeries(columnName));
		})
		.toArray();
};

//
// Retreive a subset of the data frame's columns as a new data frame.
//
BaseDataFrame.prototype.getColumnsSubset = function (columnNames) {
	var LazyDataFrame = require('./lazydataframe'); // Local require to prevent circular ref.

	var self = this;
	
	assert.isArray(columnNames, "Expected 'columnName' parameter to 'getColumnsSubset' to be an array.");	
	
	return new LazyDataFrame(
		function () {
			return columnNames; 
		},
		function () {
			var columnIndices = E.from(columnNames)
				.select(function (columnName) {
					return self.getColumnIndex(columnName);
				})
				.toArray();
			
			return new ArrayIterator(
				E.from(self.toValues())
					.select(function (entry) {
						return E.from(columnIndices)
							.select(function (columnIndex) {
								return entry[columnIndex];					
							})
							.toArray();
					})
					.toArray()
			);
		},
		function () {
			return self.getIndex();
		}
	);	 
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

	var cachedSorted = null;

	//
	// Don't invoke the sort until we really know what we need.
	//
	var executeLazySort = function () {
		if (cachedSorted) {
			return cachedSorted;
		}

		batch.forEach(function (orderCmd) {
			assert.isObject(orderCmd);
			assert.isFunction(orderCmd.sortSelector);
			validateSortMethod(orderCmd.sortMethod);
		});

		var valuesWithIndex = E.from(self.getIndex().toValues())
			.zip(self.toValues(), function (index, values) {
				return [index].concat(values);
			})
			.toArray();	

		cachedSorted = E.from(batch)
			.aggregate(E.from(valuesWithIndex), function (unsorted, orderCmd) {
				return unsorted[orderCmd.sortMethod](function (row) {
					var columnMappedRow = mapRowByColumns(self, E.from(row).skip(1).toArray()); // Skip the generated index column.
					return orderCmd.sortSelector(columnMappedRow);
				}); 
			})
			.toArray();

		return cachedSorted;
	};

	var LazyDataFrame = require('./lazydataframe');

	return new LazyDataFrame(
		function () {
			return self.getColumnNames();
		},
		function () {
			return new ArrayIterator(
				E.from(executeLazySort())
					.select(function (row) {
						return E.from(row).skip(1).toArray(); // Extract the values (minus the index) from the sorted data.					
					})
					.toArray()
			);
		},
		function () {
			var LazyIndex = require('./lazyindex');
			return new LazyIndex(
				function () {
					return new ArrayIterator(E.from(executeLazySort())
						.select(function (row) {
							return row[0]; // Extract the index from the sorted data.
						})
						.toArray()
					);
				}
			);
		}
	);
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
BaseDataFrame.prototype.orderBy = function (columnNameOrIndexOrSelector) {

	var self = this;
	return orderBy(self, 'orderBy', processColumnSelector(self, columnNameOrIndexOrSelector, 'orderBy'));
};

/**
 * Sorts a data frame based on a single column (specified by name or index) or by selector (descending). 
 * 
 * @param {string|index|function} columnNameOrIndexOrSelector - A column name, column index or selector function that indicates the value to sort by.
 */
BaseDataFrame.prototype.orderByDescending = function (columnNameOrIndexOrSelector) {

	var self = this;
	return orderBy(self, 'orderByDescending', processColumnSelector(self, columnNameOrIndexOrSelector, 'orderByDescending'));
};

/**
 * Create a new data frame with the requested column or columns dropped.
 *
 * @param {string|array} columnOrColumns - Specifies the column name (a string) or columns (array of column names) to drop.
 */
BaseDataFrame.prototype.dropColumn = function (columnOrColumns) {
	if (!Object.isArray(columnOrColumns)) {
		assert.isString(columnOrColumns, "'dropColumn' expected either a string or an array or strings.");

		columnOrColumns = [columnOrColumns]; // Convert to array for coding convenience.
	}

	var self = this;
	var columnIndices = E.from(columnOrColumns)
		.select(function (columnName, index)  {
			assert.isString(columnName, "Expected column names specifed in parameter 'columnOrColumns' to be string values. Index " + index + " is a " + typeof(columnName));
			return self.getColumnIndex(columnName);
		})
		.where(function (columnIndex) {
			return columnIndex >= 0;
		})
		.toArray();

	var LazyDataFrame = require('./lazydataframe');

	return new LazyDataFrame(
		function () {
			return E.from(self.getColumnNames())
				.where(function (columnName, columnIndex) {
					return columnIndices.indexOf(columnIndex) < 0;
				})
				.toArray();
		},
		function () {
			return new ArrayIterator(
				E.from(self.toValues())
					.select(function (row) {
						return E.from(row)
							.where(function (column, columnIndex) {
								return columnIndices.indexOf(columnIndex) < 0;
							})
							.toArray();
					})
					.toArray()
			);
		},
		function () {
			return self.getIndex();
		}
	);
};

/**
 * Create a new data frame with an additional column specified by the passed-in series.
 *
 * @param {string} columnName - The name of the column to add or replace.
 * @param {array|column} data - Array of data or column that contains data.
 */
BaseDataFrame.prototype.setSeries = function (columnName, data) { //todo: should allow column name or index.
	assert.isString(columnName, "Expected 'columnName' parameter to 'setSeries' to be a string.");

	var self = this;

	if (Object.isFunction(data)) {
		data = E.from(self.toObjects())
			.select(data)
			.toArray();
	}
	else if (!Object.isArray(data)) {
		assert.isObject(data, "Expected 'data' parameter to 'setSeries' to be either an array or a series object.");
		assert.isFunction(data.reindex, "Expected 'data' parameter to 'setSeries' to have a 'reindex' function that allows the column to be reindexed.");

		data = data.reindex(self.getIndex()).toValues();
	}

	var LazyDataFrame = require('./lazydataframe');

	var columnIndex = self.getColumnIndex(columnName);
	if (columnIndex < 0) {
		
		// Add new column.
		return new LazyDataFrame(
			function () {
				return self.getColumnNames().concat([columnName]);
			},
			function () {
				return new ArrayIterator(
					E.from(self.toValues())
						.select(function (row, rowIndex) {
							return row.concat([data[rowIndex]]);
						})
						.toArray()
				);
			},
			function () {
				return self.getIndex();
			}
		);
	}
	else {

		// Replace existing column.
		return new LazyDataFrame(
			function () {
				return E.from(self.getColumnNames())
					.select(function (thisColumnName, thisColumnIndex) {
						if (thisColumnIndex === columnIndex) {
							return columnName;
						}
						else { 
							return thisColumnName;
						}
					})
					.toArray();
			},
			function () {
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
			function () {
				return self.getIndex();
			}
		);
	}
};

/**
 * Get a subset of rows from the data frame.
 *
 * @param {int} startIndex - Index where the subset starts.
 * @param {int} endIndex - Marks the end of the subset, one row past the last row to include.
 */
BaseDataFrame.prototype.getRowsSubset = function (startIndex, endIndex) {
	assert.isNumber(startIndex, "Expected 'startIndex' parameter to getRowsSubset to be an integer.");
	assert.isNumber(endIndex, "Expected 'endIndex' parameter to getRowsSubset to be an integer.");
	assert(endIndex >= startIndex, "Expected 'endIndex' parameter to getRowsSubset to be greater than or equal to 'startIndex' parameter.");

	var self = this;

	var LazyDataFrame = require('./lazydataframe'); // Require here to prevent circular ref.

	return new LazyDataFrame(
		function () {
			return self.columnNames();
		},
		function () {
			return new ArrayIterator(
				E.from(self.toValues())
					.skip(startIndex)
					.take(endIndex - startIndex)
					.toArray()
			);
		},
		function () {
			return self.getIndex().getRowsSubset(startIndex, endIndex);
		}
	);
};

/**
 * Set a column as the index of the data frame.
 *
 * @param {string|int} columnNameOrIndex - Name or index of the column to set as the index.
 */
BaseDataFrame.prototype.setIndex = function (columnNameOrIndex) {

	var self = this;

	var LazyDataFrame = require('./lazydataframe'); // Require here to prevent circular ref.

	return new LazyDataFrame(
		function () {
			return self.getColumnNames();
		},
		function () {
			return new ArrayIterator(self.toValues());
		},
		function () {
			return new LazyIndex(
				function () {
					return new ArrayIterator(self.getSeries(columnNameOrIndex).toValues());
				}
			);
		}		
	);
}

/**
 * Reset the index of the data frame back to the default sequential integer index.
 */
BaseDataFrame.prototype.resetIndex = function () {

	var self = this;
	var LazyDataFrame = require('./lazydataframe'); // Require here to prevent circular ref.

	return new LazyDataFrame(
		function () {
			return self.getColumnNames();
		},
		function () {
			return self.getIterator();
		},
		function () {
			return new LazyIndex( //todo: broad-cast index
				function () {
					return new ArrayIterator(E.range(0, self.toValues().length).toArray());
				}
			);
		}		
	);
};

/** 
 * Format the data frame for display as a string.
 */
BaseDataFrame.prototype.toString = function () {

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
BaseDataFrame.prototype.parseInts = function (columnNameOrIndex) {

	var self = this;
	return self.setSeries(columnNameOrIndex, self.getSeries(columnNameOrIndex).parseInts());
};

/**
 * Parse a column with string values to a column with float values.
 *
 * @param {string|int} columnNameOrIndex - Specifies the column to parse.
 */
BaseDataFrame.prototype.parseFloats = function (columnNameOrIndex) {

	var self = this;
	return self.setSeries(columnNameOrIndex, self.getSeries(columnNameOrIndex).parseFloats());
};

/**
 * Parse a column with string values to a column with date values.
 *
 * @param {string|int} columnNameOrIndex - Specifies the column to parse.
 */
BaseDataFrame.prototype.parseDates = function (columnNameOrIndex) {

	var self = this;
	return self.setSeries(columnNameOrIndex, self.getSeries(columnNameOrIndex).parseDates());
};

/**
 * Convert a column of values of different types to a column of string values.
 *
 * * @param {string|int} columnNameOrIndex - Specifies the column to convert.
 */
BaseDataFrame.prototype.toStrings = function (columnNameOrIndex) {

	var self = this;
	return self.setSeries(columnNameOrIndex, self.getSeries(columnNameOrIndex).toString());
};

/**
 * Detect actual types and their frequencies contained within columns in the data frame.
 */
BaseDataFrame.prototype.detectTypes = function () {

	var self = this;

	var DataFrame = require('./dataframe');

	var dataFrames = E.from(self.getColumns())
		.select(function (column) {
			var series = column.getSeries();
			var numValues = series.toValues().length;
			var Series = require('./series');
			//todo: broad-cast column
			var newSeries = new Series(
				E.range(0, numValues)
					.select(function () { 
						return column.getName(); 
					})
					.toArray()
			);
			return column.getSeries()
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
BaseDataFrame.prototype.detectValues = function () {

	var self = this;

	var DataFrame = require('./dataframe');

	var dataFrames = E.from(self.getColumns())
		.select(function (column) {
			var numValues = column.getSeries().toValues().length;
			var Series = require('./series');
			//todo: broad-cast column
			var newSeries = new Series(
				E.range(0, numValues)
					.select(function () { 
						return column.getName(); 
					})
					.toArray()
			);
			return column.getSeries().detectValues().setSeries('Column', newSeries);
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
BaseDataFrame.prototype.truncateStrings = function (maxLength) {
	assert.isNumber(maxLength, "Expected 'maxLength' parameter to 'truncateStrings' to be an integer.");

	var self = this;
	var truncatedValues = E.from(self.toValues())
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

	var DataFrame = require('./dataframe');
	return new DataFrame({
			columnNames: self.getColumnNames(),
			rows: truncatedValues,
			index: self.getIndex(),
		});
};

/**
 * Create a new data frame with columns reordered.
 * New column names create new columns (with undefined values), omitting existing column names causes those columns to be dropped.
 * 
 * @param {array} columnNames - The new order for columns. 
 */
BaseDataFrame.prototype.remapColumns = function (columnNames) {

	assert.isArray(columnNames, "Expected parameter 'columnNames' to remapColumns to be an array with column names.");

	columnNames.forEach(function (columnName) {
		assert.isString(columnName, "Expected parameter 'columnNames' to remapColumns to be an array with column names.");
	});

	var self = this;

 	var LazyDataFrame = require('./lazydataframe');
	return new LazyDataFrame(
		function () {
			return columnNames;
		},
		function () {
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
		function () {
			return self.getIndex();
		}		
	);
};

/**
 * Create a new data frame with different column names.
 *
 * @param {string array} newColumnNames - Array of strings, with an element for each existing column that specifies the new name of that column.
 */
BaseDataFrame.prototype.renameColumns = function (newColumnNames) {

	var self = this;

	var numExistingColumns = self.getColumnNames().length;

	assert.isArray(newColumnNames, "Expected parameter 'newColumnNames' to renameColumns to be an array with column names.");
	assert(newColumnNames.length === numExistingColumns, "Expected 'newColumnNames' array to have an element for each existing column. There are " + numExistingColumns + "existing columns.");

	newColumnNames.forEach(function (newColumnName) {
		assert.isString(newColumnName, "Expected new column name to be a string, intead got " + typeof(newColumnName));
	});

 	var LazyDataFrame = require('./lazydataframe');
	return new LazyDataFrame(
		function () {
			return newColumnNames;
		},
		function () {
			return self.getIterator();
		},
		function () {
			return self.getIndex();
		}
	);
};

/*
 * Create a new data frame with a single column renamed.
 * 
 * @param {string|int} columnNameOrIndex - Specifies the column to rename.
 * @param {string} newColumnName - The new name for the specified column.
 */
BaseDataFrame.prototype.renameColumn = function (columnNameOrIndex, newColumnName) {

	var self = this;
	var columnIndex = parseColumnNameOrIndex(self, columnNameOrIndex, false);

	assert.isString(newColumnName, "Expected 'newColumnName' parameter to 'renameColumn' to be a string.");

	var LazyDataFrame = require('./lazydataframe');
	return new LazyDataFrame(
		function () {
			var newColumnNames = self.getColumnNames().slice(0); // Clone array.
			newColumnNames[columnIndex] = newColumnName;
			return newColumnNames;
		},
		function () {
			return self.getIterator();
		},
		function () {
			return self.getIndex();
		}
	);
};

/**
 * Bake the data frame to an array of rows.
 */
BaseDataFrame.prototype.toValues = function () {

	var self = this;

	var iterator = self.getIterator();
	validateEnumerator(iterator);

	var values = [];

	while (iterator.moveNext()) {
		values.push(iterator.getCurrent());
	}

	return values;
};

/**
 * Bake the data frame to an array of JavaScript objects.
 */
BaseDataFrame.prototype.toObjects = function () {

	var self = this;
	var columnNames = self.getColumnNames();
	return E.from(self.toValues()) //todo: should this rely on get iterator?
		.select(function (row) {
			return E.from(columnNames)
				.zip(row, function (columnName, columnValue) {
					return [columnName, columnValue];
				})
				.toObject(
					function (column) {
						return column[0]; // Field name.
					},
					function (column) {
						return column[1]; // Field value.
					}
				);
		})
		.toArray();
};

/**
 * Serialize the data frame to JSON.
 */
BaseDataFrame.prototype.toJSON = function () {
	var self = this;
	return JSON.stringify(self.toObjects(), null, 4);
};

/**
 * Serialize the data frame to CSV.
 */
BaseDataFrame.prototype.toCSV = function () {

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
BaseDataFrame.prototype.toPairs = function () {

	var self = this;
	return E.from(self.getIndex().toValues())
		.zip(self.toObjects(), function (index, row) {
			return [index, row];
		})
		.toArray();
};

/**
 * Forces lazy evaluation to complete and 'bakes' the data frame into memory.
 */
BaseDataFrame.prototype.bake = function () {

	var self = this;

	var DataFrame = require('./dataframe');
	return new DataFrame({
			columnNames: self.getColumnNames(),
			rows: self.toValues(),
			index: self.getIndex().bake(),
		});
};

/**
 * Count the number of rows in the data frame.
 */
BaseDataFrame.prototype.count = function () {

	var self = this;

	var total = 0;

	var iterator = self.getIterator();

	while (iterator.moveNext()) {
		++total;
	}

	return total;
};

/**
 * Transform a column. This is equivalent to extracting a column, calling 'select' on it,
 * then plugging it back in as the same column.
 *
 * @param {string} columnName - Name of the column to transform.
 * @param {function} selector - Selector function that transforms each row to a different data structure.
 * 
 */
BaseDataFrame.prototype.transformColumn = function (columnNameOrColumnNames, selector) { //todo: this should support 'column name or index'.

	var self = this;

	if (Object.isObject(columnNameOrColumnNames)) {
		var columnNames = Object.keys(columnNameOrColumnNames)
		return E.from(columnNames)
			.aggregate(self, function (prevDataFrame, columnName) {
				var columnSelector = columnNameOrColumnNames[columnName];
				return prevDataFrame.transformColumn(columnName, columnSelector);
			});
	}
	else {
		assert.isString(columnNameOrColumnNames, "Expected 'columnNameOrColumnNames' parameter to 'transformColumn' to be a string or object.");
		assert.isFunction(selector, "Expected 'selector' parameter to 'transformColumn' to be a function.");

		var columnName = columnNameOrColumnNames;
		if (!self.hasSeries(columnName)) {
			return self;
		}

		var transformedSeries = self.getSeries(columnName).select(selector);
		return self.setSeries(columnName, transformedSeries);
	}
};

/** 
 * Move a rolling window over the data frame, invoke a selector function to build a new data frame.
 *
 * @param {integer} period - The number of entries to include in the window.
 * @param {function} selector - The selector function that builds the output series.
 *
 * The selector has the following parameters: 
 *
 *		window - Data-frame that represents the rolling window.
 *		windowIndex - The 0-based index of the window.
 */
BaseDataFrame.prototype.rollingWindow = function (period, fn) {

	assert.isNumber(period, "Expected 'period' parameter to 'rollingWindow' to be a number.");
	assert.isFunction(fn, "Expected 'fn' parameter to 'rollingWindow' to be a function.");

	var self = this;

	//todo: make this properly lazy

	var index = self.getIndex().toValues();
	var values = self.toObjects();

	var DataFrame = require('./dataframe');
	if (values.length == 0) {
		return new DataFrame();
	}

	var Index = require('./index');
	var newIndexAndValues = E.range(0, values.length-period+1)
		.select(function (rowIndex) {
			var _index = E.from(index).skip(rowIndex).take(period).toArray();
			var _values = E.from(values).skip(rowIndex).take(period).toArray();
			var Series = require('./series');
			var _window = new DataFrame({
					rows: _values, 
					index: new Index(_index)
				});
			return fn(_window, rowIndex);
		})
		.toArray();

	var newIndex = E.from(newIndexAndValues)
		.select(function (indexAndValue) {
			return indexAndValue[0];
		})
		.toArray();
	var newValues = E.from(newIndexAndValues)
		.select(function (indexAndValue) {
			return indexAndValue[1];
		})
		.toArray();

	return new DataFrame({
			rows: newValues,
			index: new Index(newIndex)
		});
};

/**
 * Get the first row of the data frame.
 */
BaseDataFrame.prototype.first = function () {

	var self = this;

	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		throw new Error("No rows in data-frame.");
	}

	return mapRowByColumns(self, iterator.getCurrent());
};

/**
 * Get the last row of the data frame.
 */
BaseDataFrame.prototype.last = function () {

	var self = this;

	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		throw new Error("No rows in data-frame.");
	}

	var last = iterator.getCurrent();

	while (iterator.moveNext()) {
		last = iterator.getCurrent();
	}

	return mapRowByColumns(self, last);
};

/** 
 * Reverse the data-frame.
 */
BaseDataFrame.prototype.reverse = function () {

	var self = this;

	//todo: make this lazy.

	var DataFrame = require('./dataframe');
	return new DataFrame({
			rows: E.from(self.toObjects()).reverse().toArray(),
			index: self.getIndex().reverse()
		});
};

/** 
 * Generate new columns based on existing rows.
 *
 * @param {function} selector - Selector function that transforms each row to a new set of columns.
 */
BaseDataFrame.prototype.generateColumns = function (selector) {

	assert.isFunction(selector, "Expected 'selector' parameter to 'generateColumns' function to be a function.");

	var self = this;

	//todo: make this lazy.
	//todo: this should merge on index.

	var newColumns = self.select(selector);
	return E.from(newColumns.getColumnNames())
		.aggregate(self, function (prevDataFrame, newColumnName) {
			return prevDataFrame.setSeries(newColumnName, newColumns.getSeries(newColumnName));
		});
};

module.exports = BaseDataFrame;