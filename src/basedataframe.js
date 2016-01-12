'use strict';

// 
// Base class for data frame classes.
//

var LazyColumn = require('./lazycolumn');
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
				self.getIndex().getName(),
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
				self.getIndex().getName(),
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

/*
 * Retreive a named column from the DataFrame.
 *
 * @param {string|int} columnNameOrIndex - Name or index of the column to retreive.
 */
BaseDataFrame.prototype.getColumn = function (columnNameOrIndex) {
	var self = this;

	var columnIndex;
	if (Object.isString(columnNameOrIndex)) {
		columnIndex = self.getColumnIndex(columnNameOrIndex);
		if (columnIndex < 0) {
			throw new Error("In call to 'getColumn' failed to find column '" + columnNameOrIndex + "'.");
		}
	}
	else {	
		assert.isNumber(columnNameOrIndex, "Expected 'columnNameOrIndex' parameter to 'getColumn' to be either a string or index that specifies the column to retreive.");

		columnIndex = columnNameOrIndex;
	}
	
	return new LazyColumn(
		self.getColumnNames()[columnIndex],
		function () {
			return new ArrayIterator(E.from(self.toValues())
				.select(function (entry) {
					return entry[columnIndex];
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
 * Retreive a collection of all columns.
 */
BaseDataFrame.prototype.getColumns = function () {

	var self = this;

	return E.from(self.getColumnNames())
		.select(function (columnName) {
			return self.getColumn(columnName);
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
				self.getIndex().getName(),
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

	var cachedColumnIndices = null;

	var lazyGenerateColumnIndices = function () {

		if (cachedColumnIndices) {
			return cachedColumnIndices;
		}

		cachedColumnIndices = E.from(columnOrColumns)
			.select(function (columnName)  {
				assert.isString(columnName);
				var columnIndex = self.getColumnIndex(columnName);
				if (columnIndex < 0) {
					throw new Error("In call to 'dropColumn' failed to find column '" + columnName + "'.");
				}
				return columnIndex;
			})
			.toArray();
		return cachedColumnIndices;
	};


	var LazyDataFrame = require('./lazydataframe');

	return new LazyDataFrame(
		function () {
			var columnIndices = lazyGenerateColumnIndices();
			return E.from(self.getColumnNames())
				.where(function (columnName, columnIndex) {
					return columnIndices.indexOf(columnIndex) < 0;
				})
				.toArray();
		},
		function () {
			var columnIndices = lazyGenerateColumnIndices();
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
 * Create a new data frame with and additional or replaced column.
 *
 * @param {string} columnName - The name of the column to add or replace.
 * @param {array|column} data - Array of data or column that contains data.
 */
BaseDataFrame.prototype.setColumn = function (columnName, data) {
	assert.isString(columnName, "Expected 'columnName' parameter to 'setColumn' to be a string.");

	var self = this;

	if (!Object.isArray(data)) {
		assert.isObject(data, "Expected 'data' parameter to 'setColumn' to be either an array or a column object.");
		assert.isFunction(data.reindex, "Expected 'data' parameter to 'setColumn' to have a 'reindex' function that allows the column to be reindexed.");

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
				self.getColumn(columnNameOrIndex).getName(),
				function () {
					return new ArrayIterator(self.getColumn(columnNameOrIndex).toValues());
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
				"__index___",
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
	var header = [self.getIndex().getName()].concat(self.getColumnNames());
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
 */
BaseDataFrame.prototype.parseInts = function (columnNameOrIndex) {

	var self = this;
	return self.setColumn(columnNameOrIndex, self.getColumn(columnNameOrIndex).parseInts());
};

/**
 * Parse a column with string values to a column with float values.
 */
BaseDataFrame.prototype.parseFloats = function (columnNameOrIndex) {

	var self = this;
	return self.setColumn(columnNameOrIndex, self.getColumn(columnNameOrIndex).parseFloats());
};

/**
 * Parse a column with string values to a column with date values.
 */
BaseDataFrame.prototype.parseDates = function (columnNameOrIndex) {

	var self = this;
	return self.setColumn(columnNameOrIndex, self.getColumn(columnNameOrIndex).parseDates());
};

/**
 * Convert a column of values of different types to a column of string values.
 */
BaseDataFrame.prototype.toStrings = function (columnNameOrIndex) {

	var self = this;
	return self.setColumn(columnNameOrIndex, self.getColumn(columnNameOrIndex).toString());
};

/**
 * Detect actual types and their frequencies contained within columns in the data frame.
 */
BaseDataFrame.prototype.detectTypes = function () {

	var self = this;

	var DataFrame = require('./dataframe');

	var dataFrames = E.from(self.getColumns())
		.select(function (column) {
			var numValues = column.toValues().length;
			var Column = require('./column');
			//todo: broad-cast column
			var columnNameColumn = new Column('Column', E.range(0, numValues).select(function () { return column.getName(); }).toArray());
			return column.detectTypes().setColumn('Column', columnNameColumn);
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
			var numValues = column.toValues().length;
			var Column = require('./column');
			//todo: broad-cast column
			var columnNameColumn = new Column('Column', E.range(0, numValues).select(function () { return column.getName(); }).toArray());
			return column.detectValues().setColumn('Column', columnNameColumn);
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

module.exports = BaseDataFrame;