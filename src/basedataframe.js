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
// Maps a column name to an array index.
// Returns -1 if the requested column was not found.
//
BaseDataFrame.prototype._columnNameToIndex = function (columnName) {
	assert.isString(columnName, "Expected 'columnName' parameter to _columnNameToIndex to be a non-empty string.");
	
	var self = this;	
	var columnNames = self.getColumnNames();
	
	for (var i = 0; i < columnNames.length; ++i) {
		if (columnName == columnNames[i]) {
			return i;
		}
	}	
	
	return -1;
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
		columnIndex = self._columnNameToIndex(columnNameOrIndex);
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
					return self._columnNameToIndex(columnName);
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
			assert.isNumber(orderCmd.columnIndex);
			assert(orderCmd.columnIndex >= 0);
			validateSortMethod(orderCmd.sortMethod);
		});

		cachedSorted = E.from(batch)
			.aggregate(E.from(self.getValues()), function (unsorted, orderCmd) {
				return unsorted[orderCmd.sortMethod](function (row) {
					return row[orderCmd.columnIndex];
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
			return executeLazySort();	
		}		
	);
};

//
// Order by values in a partcular column, either ascending or descending
//
var orderBy = function (self, sortMethod, columnIndex) {
	assert.isObject(self);
	validateSortMethod(sortMethod);
	assert.isNumber(columnIndex);

	var batchOrder = [
		{ 
			columnIndex: columnIndex, 
			sortMethod: sortMethod 
		}
	];

	var sortedDataFrame = executeOrderBy(self, batchOrder);

	sortedDataFrame.thenBy = orderThenBy(self, batchOrder, 'thenBy');
	sortedDataFrame.thenByDescending = orderThenBy(self, batchOrder, 'thenByDescending');
	
	return sortedDataFrame;
};

//
// Generates a thenBy function that is attached to already ordered data frames.
//
var orderThenBy = function (self, batch, nextSortMethod) {
	assert.isObject(self);
	assert.isArray(batch);
	assert(batch.length > 0);
	validateSortMethod(nextSortMethod);
	
	return function (nextColumnName) {
		assert.isString(nextColumnName);

		var nextColumnIndex = self._columnNameToIndex(nextColumnName);
		if (nextColumnIndex < 0) {
			throw new Error("In call to 'thenBy' failed to find column with name '" + nextColumnName + "'.");
		}

		var extendedBatch = batch.concat([
			{
				columnIndex: nextColumnIndex,
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
 * Sorts a data frame based on a single column (ascending). 
 * 
 * @param {string|array} columnName - Column to sort by.
 */
BaseDataFrame.prototype.orderBy = function (columnName) {
	assert.isString(columnName);
	
	var self = this;

	var columnIndex = self._columnNameToIndex(columnName);
	if (columnIndex < 0) {
		throw new Error("In call to 'orderBy' failed to find column with name '" + columnName + "'.");
	}

	return orderBy(self, 'orderBy', columnIndex);
};

/**
 * Sorts a data frame based on a single column (descending). 
 * 
 * @param {string|array} columnName - Column to sort by.
 */
BaseDataFrame.prototype.orderByDescending = function (columnName) {
	assert.isString(columnName);
	
	var self = this;

	var columnIndex = self._columnNameToIndex(columnName);
	if (columnIndex < 0) {
		throw new Error("In call to 'orderByDescending' failed to find column with name '" + columnName + "'.");
	}

	return orderBy(self, 'orderByDescending', columnIndex);
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

	var LazyDataFrame = require('./lazydataframe');

	var columnIndices = E.from(columnOrColumns)
		.select(function (columnName)  {
			assert.isString(columnName);
			var columnIndex = self._columnNameToIndex(columnName);
			if (columnIndex < 0) {
				throw new Error("In call to 'dropColumn' failed to find column '" + columnName + "'.");
			}
			return columnIndex;
		})
		.toArray();

	var columns = E.from(self.getColumnNames())
		.where(function (columnName, columnIndex) {
			return columnIndices.indexOf(columnIndex) < 0;
		})
		.toArray();

	var rows = E.from(self.getValues())
		.select(function (row) {
			return E.from(row)
				.where(function (column, columnIndex) {
					return columnIndices.indexOf(columnIndex) < 0;
				})
				.toArray();
		})
		.toArray();

	return new LazyDataFrame(
		function () {
			return columns;			
		},
		function () {
			return rows;			
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
		assert.isObject(data, "Expected 'data' parameter to 'setColumn' to be either an array or a column.");
		assert.isFunction(data.getValues, "Expected 'data' parameter to 'setColumn' to have a 'getValues' function that returns the values of the column.");

		data = data.getValues();
	}

	var LazyDataFrame = require('./lazydataframe');

	var columnIndex = self._columnNameToIndex(columnName);
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
				function () {
					return E.range(0, self.getValues().length).toArray();
				}
			);
		}		
	);
};

module.exports = BaseDataFrame;