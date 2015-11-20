'use strict';

// 
// Base class for data frame classes.
//

var LazyColumn = require('./lazycolumn');
var LazyIndex = require('./lazyindex');

var assert = require('chai').assert; 
var E = require('linq');

/**
 * Base class for data frames.
 *
 * Derived classes must implement:
 *
 * getIndex - Get the index for the data frame.
 * getColumnNames - Get the columns for the data frame.
 * getValues - Get the values for the data frame.
 */
var BaseDataFrame = function () {
};

//
// Map a row of data to a JS object with column names as fields.
//
var mapRowByColumns = function (self, row) {
	var copy = E.from(row).toArray();

	E.from(self.getColumnNames())
		.select(function (columnName, columnIndex) {
			return [columnName, columnIndex];
		})
		.toArray()
		.forEach(
			function (column) {
				var columnName = column[0];
				var columnIndex = column[1];
				copy[columnName] = copy[columnIndex];
			}
		);

	return copy;
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
			return E
				.from(self.getValues())
				.skip(numRows)
				.toArray();
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
			return E
				.from(self.getValues())
				.take(numRows)
				.toArray();
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
	// Lazy  execute the filtering.
	//
	var executeLazyWhere = function () {

		if (cachedFilteredIndexAndValues) {
			return cachedFilteredIndexAndValues;
		}

		cachedFilteredIndexAndValues = E
			.from(self.getIndex().getValues())
			.zip(self.getValues(), function (index, values) {
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
			return E.from(executeLazyWhere())
				.select(function (data) {
					return data[1]; // Row
				})
				.toArray();
		},
		function () {
			return new LazyIndex(
				self.getIndex().getName(),
				function () {
					return E.from(executeLazyWhere())
						.select(function (data) {
							return data[0]; // Index
						})
						.toArray();
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

	var newColumnNames = null;
	var newValues = null;

	newValues = E
		.from(self.getValues())
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

	newValues = E.from(newValues)
		.select(function (value) {
			return E.from(newColumnNames)
				.select(function (columnName) {
					return value[columnName];
				})
				.toArray();
		})
		.toArray();

	var LazyDataFrame = require('./lazydataframe');
	return new LazyDataFrame(
		function () {
			return newColumnNames;
		},
		function () {
			return newValues;
		},
		function () {
			return self.getIndex();
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
			return E.from(self.getValues())
				.select(function (entry) {
					return entry[columnIndex];
				})
				.toArray();
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
	
	assert.isArray(columnNames, "Expected 'columnName' parameter to 'subset' to be an array.");	
	
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
			
			return E.from(self.getValues())
				.select(function (entry) {
					return E.from(columnIndices)
						.select(function (columnIndex) {
							return entry[columnIndex];					
						})
						.toArray();
				})
				.toArray();
		},
		function () {
			return self.getIndex();
		}
	);	 
};

//
// Save the data frame via plugable output.
//
BaseDataFrame.prototype.as = function (formatPlugin) {
	assert.isObject(formatPlugin, "Expected 'formatPlugin' parameter to 'DataFrame.as' to be an object.");
	assert.isFunction(formatPlugin.to, "Expected 'formatPlugin' parameter to 'DataFrame.as' to be an object with a 'to' function.");

	var self = this;	
	return {
		to: function (dataSourcePlugin) {
			assert.isObject(dataSourcePlugin, "Expected 'dataSourcePlugin' parameter to 'DataFrame.as.to' to be an object.");
			assert.isFunction(dataSourcePlugin.write, "Expected 'dataSourcePlugin' parameter to 'DataFrame.as.to' to be an object with a 'write' function.");
			
			var textData = formatPlugin.to(self);
			return dataSourcePlugin.write(textData);
		},		
	};
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

		var valuesWithIndex = E.from(self.getIndex().getValues())
			.zip(self.getValues(), function (index, values) {
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
			return E.from(executeLazySort())
				.select(function (row) {
					return E.from(row).skip(1).toArray(); // Extract the values (minus the index) from the sorted data.					
				})
				.toArray();
		},
		function () {
			var LazyIndex = require('./lazyindex');
			return new LazyIndex(
				self.getIndex().getName(),
				function () {
					return E.from(executeLazySort())
						.select(function (row) {
							return row[0]; // Extract the index from the sorted data.
						})
						.toArray();
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
			return E.from(self.getValues())
				.select(function (row) {
					return E.from(row)
						.where(function (column, columnIndex) {
							return columnIndices.indexOf(columnIndex) < 0;
						})
						.toArray();
				})
				.toArray();
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

		data = data.reindex(self.getIndex()).getValues();
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
				return E.from(self.getValues())
					.select(function (row, rowIndex) {
						return row.concat([data[rowIndex]]);
					})
					.toArray();
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
				return E.from(self.getValues())
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
					.toArray();
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
 * @param {int} index - Index where the subset starts.
 * @param {int} count - Number of rows to include in the subset.
 */
BaseDataFrame.prototype.getRowsSubset = function (index, count) {
	assert.isNumber(index, "Expected 'index' parameter to getRowsSubset to be an integer.");
	assert.isNumber(index, "Expected 'count' parameter to getRowsSubset to be an integer.");

	var self = this;

	var LazyDataFrame = require('./lazydataframe'); // Require here to prevent circular ref.

	return new LazyDataFrame(
		function () {
			return self.columnNames();
		},
		function () {
			return E.from(self.getValues())
				.skip(index)
				.take(count)
				.toArray();
		},
		function () {
			return self.getIndex().getRowsSubset(index, count);
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
			return self.getValues();
		},
		function () {
			return new LazyIndex(
				self.getColumn(columnNameOrIndex).getName(),
				function () {
					return self.getColumn(columnNameOrIndex).getValues();
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
			return self.getValues();
		},
		function () {
			return new LazyIndex(
				"__index___",
				function () {
					return E.range(0, self.getValues().length).toArray();
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

	var index = self.getIndex().getValues();
	var header = [self.getIndex().getName()].concat(self.getColumnNames());
	var rows = E.from(self.getValues())
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

module.exports = BaseDataFrame;