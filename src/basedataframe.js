'use strict';

// 
// Base class for data frame classes.
//

var LazyColumn = require('./lazycolumn');

var assert = require('chai').assert; 
var E = require('linq');

var BaseDataFrame = function () {
	
	
};

//
// Maps a column name to an array index.
// Returns -1 if the requested column was not found.
//
BaseDataFrame.prototype._columnNameToIndex = function (columnName) {
	assert.isString(columnName, "Expected 'columnName' parameter to _columnNameToIndex to be a non-empty string.");
	
	var self = this;	
	var columnNames = self.columns();
	
	for (var i = 0; i < columnNames.length; ++i) {
		if (columnName == columnNames[i]) {
			return i;
		}
	}	
	
	return -1;
};

//
// Pull a column out of the DataFrame as a time series.
//
BaseDataFrame.prototype.series = function (columnName) {
	var self = this;
	var columnIndex = self._columnNameToIndex(columnName);
	if (columnIndex < 0) {
		throw new Error("In call to 'series' failed to find column with name '" + columnName + "'.");
	}
	
	return new LazyColumn(
		function () {
			return E.from(self.values())
				.select(function (entry) {
					return entry[columnIndex];
				})
				.toArray();
		}
	);
};

//
// Retreive a subset of the data frame's columns as a new data frame.
//
BaseDataFrame.prototype.subset = function (columnNames) {
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
			
			return E.from(self.values())
				.select(function (entry) {
					return E.from(columnIndices)
						.select(function (columnIndex) {
							return entry[columnIndex];					
						})
						.toArray();
				})
				.toArray();
		}
	);	 
};

//
// Save the data frame via plugable output.
//
BaseDataFrame.prototype.as = function (formatPlugin, formatOptions) {
	assert.isObject(formatPlugin, "Expected 'formatPlugin' parameter to 'DataFrame.as' to be an object.");
	assert.isFunction(formatPlugin.to, "Expected 'formatPlugin' parameter to 'DataFrame.as' to be an object with a 'to' function.");

	var self = this;	
	return {
		to: function (dataSourcePlugin, dataSourceOptions) {
			assert.isObject(dataSourcePlugin, "Expected 'dataSourcePlugin' parameter to 'DataFrame.as.to' to be an object.");
			assert.isFunction(dataSourcePlugin.write, "Expected 'dataSourcePlugin' parameter to 'DataFrame.as.to' to be an object with a 'write' function.");
			
			var textData = formatPlugin.to(self, formatOptions);
			return dataSourcePlugin.write(textData, dataSourceOptions);		
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
			.aggregate(E.from(self.values()), function (unsorted, orderCmd) {
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
			return self.columns();
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

//
// Interface functions.
//
// index - Get the index for the data frame.
// columns - Get the columns for the data frame.
// values - Get the values for the data frame.
// bake - Force lazy evaluation to complete.
//

module.exports = BaseDataFrame;