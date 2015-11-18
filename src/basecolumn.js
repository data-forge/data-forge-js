'use strict';

// 
// Base class for columns classes.
//

var assert = require('chai').assert; 
var E = require('linq');


/**
 * Base class for columns.
 *
 * getName - Get the name of the column.
 * getValues - Get the values for each entry in the series.
 * getIndex - Get the index for the column.
 */
var BaseColumn = function () {	
	
};

/**
 * Skip a number of rows in the column.
 *
 * @param {int} numRows - Number of rows to skip.
 */
BaseColumn.prototype.skip = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'skip' function to be a number.");

	var LazyColumn = require('./lazycolumn'); // Require here to prevent circular ref.
	
	var self = this;
	return new LazyColumn(
		self.getName(),
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
			.zip(self.getValues(), function (index, value) {
				return [index, value];
			})
			.toArray();	

		cachedSorted = E.from(batch)
			.aggregate(E.from(valuesWithIndex), function (unsorted, orderCmd) {
				return unsorted[orderCmd.sortMethod](function (row) {
					var value = row[1];
					return orderCmd.sortSelector(value);
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
					return row[1]; // Extract the value (minus the index) from the sorted data.					
				})
				.toArray();
		},
		function () {
			var LazyIndex = require('./lazyindex');
			return new LazyIndex(
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
// Generates a thenBy function that is attached to already ordered data frames.
//
var orderThenBy = function (self, batch, nextSortMethod) {
	assert.isObject(self);
	assert.isArray(batch);
	assert(batch.length > 0);
	validateSortMethod(nextSortMethod);
	
	return function (sortSelector) {
		assert.isFunction(sortSelector, "Expected parameter 'sortSelector' to be a function")

		var extendedBatch = batch.concat([
			{
				sortSelector: sortSelector,
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
 * Sorts the column by value (ascending). 
 */
BaseColumn.prototype.order = function () {

	var self = this;
	return orderBy(self, 'orderBy', function (value) { 
		return value; 
	});
};

/**
 * Sorts the column by value (descending). 
 */
BaseColumn.prototype.orderDescending = function (optionalSortSelector) {

	var self = this;
	return orderBy(self, 'orderByDescending', function (value) {
		return value;
	});
};

/**
 * Sorts the column by sort selector (ascending). 
 * 
 * @param {function} sortSelector - An function to select a value to sort by.
 */
BaseColumn.prototype.orderBy = function (sortSelector) {

	assert.isFunction

	var self = this;
	return orderBy(self, 'orderBy', sortSelector);
};

/**
 * Sorts the column by sort selector (descending). 
 * 
 * @param {function} sortSelector - An function to select a value to sort by.
 */
BaseColumn.prototype.orderByDescending = function (sortSelector) {

	var self = this;
	return orderBy(self, 'orderByDescending', sortSelector);
};


/*fio:
//
// Orders a series based on values in asscending order.
//
var order = function (self, sortMethod) {

	assert.isObject(self);
	assert.isString(sortMethod);
	assert(sortMethod === 'orderBy' || sortMethod === 'orderByDescending');
	
	var cachedSorted = null;
	
	//
	// Lazily execute the sort when needed.
	//
	var executeLazySort = function () {
		if (!cachedSorted) {
			cachedSorted = E.from(self.getValues())
				[sortMethod](function (value) {
					return value;
				})
				.toArray();
		}
		
		return cachedSorted;
	}
	
	var LazyColumn = require('./lazycolumn'); // Require here to prevent circular ref.

	return new LazyColumn(
		self.getName(),
		function () {
			return executeLazySort();			
		}
	);
};


 * Orders a series based on values in asscending order.

BaseColumn.prototype.order = function () {
	var self = this;
	return order(self, 'orderBy');
};


 * Orders a series based on values in descending order.

BaseColumn.prototype.orderDescending = function () {
	var self = this;
	return order(self, 'orderByDescending');
};
*/

/**
 * Get a subset of rows from the column.
 *
 * @param {int} index - Index where the subset starts.
 * @param {int} count - Number of rows to include in the subset.
 */
BaseColumn.prototype.getRowsSubset = function (index, count) {
	assert.isNumber(index, "Expected 'index' parameter to getRowsSubset to be an integer.");
	assert.isNumber(index, "Expected 'count' parameter to getRowsSubset to be an integer.");

	var self = this;

	var LazyColumn = require('./lazycolumn'); // Require here to prevent circular ref.

	return new LazyColumn(
		self.getName(),
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
 * Execute code over a moving window to produce a new data frame.
 *
 * @param {integer} period - The number of entries to include in the window.
 * @param {function} fn - The function to invoke on each window.
 */
BaseColumn.prototype.rollingWindow = function (period, fn) {

	assert.isNumber(period, "Expected 'period' parameter to 'rollingWindow' to be a number.");
	assert.isFunction(fn, "Expected 'fn' parameter to 'rollingWindow' to be a function.");

	var self = this;

	//todo: make this properly lazy

	var index = self.getIndex().getValues();
	var values = self.getValues();

	if (values.length == 0) {
		var Column = require('./column');
		return new Column(self.getName(), []);
	}

	var newIndexAndValues = E.range(0, values.length-period+1)
		.select(function (rowIndex) {
			var _index = E.from(index).skip(rowIndex).take(period).toArray();
			var _values = E.from(values).skip(rowIndex).take(period).toArray();
			return fn(_index, _values, rowIndex);
		})
		.toArray();

	var LazyColumn = require('./lazycolumn');

	return new LazyColumn(
		self.getName(), 
		function () {
			return E.from(newIndexAndValues)
				.select(function (indexAndValue) {
					return indexAndValue[1];
				})
				.toArray();
		},
		function () {
			var LazyIndex = require('./lazyindex');

			return new LazyIndex(
				function () {
					return E.from(newIndexAndValues)
						.select(function (indexAndValue) {
							return indexAndValue[0];
						})
						.toArray();					
				}
			);
		}
	);
};

/**
 * Create a new column, reindexed from this column.
 *
 * @param {index} newIndex - The index used to generate the new column.
 */
BaseColumn.prototype.reindex = function (newIndex) {
	assert.isObject(newIndex, "Expected 'newIndex' parameter to 'reindex' function to be an index.");

	var self = this;

	var LazyColumn = require('./lazycolumn');

	return new LazyColumn(
		self.getName(),
		function () {
			//
			// Generate a map to relate an index value to a column value.
			//
			var indexMap = {};
			var indexExists = {};

			E.from(self.getIndex().getValues())
				.zip(self.getValues(), 
					function (indexValue, columnValue) {
						return [indexValue, columnValue];
					}
				)
				.toArray()
				.forEach(function (pair) {
					var index = pair[0];
					var value = pair[1];

					if (indexExists[index]) {
						throw new Error("Duplicate index detected, failed to 'reindex'");
					}

					indexMap[index] = value;
					indexExists[index] = true;
				});

			//
			// Return the columns values in the order specified by the new index.
			//
			var newValues = E.from(newIndex.getValues())
				.select(function (newIndexValue) {
					return indexMap[newIndexValue];
				})
				.toArray();

			return newValues;
		},
		function () {
			return newIndex;
		}
	);
};

module.exports = BaseColumn;