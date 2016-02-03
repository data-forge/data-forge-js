'use strict';

// 
// Base class for series classes.
//

var assert = require('chai').assert; 
var E = require('linq');
var moment = require('moment');
var ArrayIterator = require('./iterators/array');
var Index = require('./index');

var validateIterator = require('./iterators/validate');

/**
 * Base class for series.
 *
 * getIterator - Get the iterator for the series.
 * getIndex - Get the index for the series.
 */
var BaseSeries = function () {	
	
};

/**
 * Skip a number of rows in the series.
 *
 * @param {int} numRows - Number of rows to skip.
 */
BaseSeries.prototype.skip = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'skip' function to be a number.");

	var Series = require('./series'); // Require here to prevent circular ref.
	
	var self = this;
	return new Series({
		values: {
			getIterator: function () {
				return new ArrayIterator(E
					.from(self.toValues())
					.skip(numRows)
					.toArray()
				);
			},
		},		
		index: self.getIndex().skip(numRows),
	}); 	
};

/**
 * Skips values in the series while a condition is met.
 *
 * @param {function} predicate - Return true to indicate the condition met.
 */
BaseSeries.prototype.skipWhile = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'skipWhile' function to be a predicate function that returns true/false.");

	var Series = require('./series'); // Require here to prevent circular ref.	
	var self = this;
	return new Series({
		values: {
			getIterator: function () {
				var valueIterator = self.getIterator();
				var skipped = false;
				return {
					moveNext: function () {
						for (;;) {
							if (!valueIterator.moveNext()) {
								return false;
							}

							if (skipped) {
								// Already skipped.
								return true;
							}

							// Skipping until predict returns false.
							if (!predicate(valueIterator.getCurrent())) {
								skipped = true;
								return true;
							}
						}
					},

					getCurrent: function () {
						return valueIterator.getCurrent();
					},
				};
			},
		},
		index: new Index({
			getIterator: function () { //too: can use an iterator here that moves multiple iterators in tandem.
				var indexIterator = self.getIndex().getIterator();
				var valueIterator = self.getIterator();
				var skipped = false;
				return {
					moveNext: function () {
						for (;;) {
							if (!valueIterator.moveNext() || !indexIterator.moveNext()) {
								return false;
							}

							if (skipped) {
								// Already skipped.
								return true;
							}

							// Skipping until predict returns false.
							if (!predicate(valueIterator.getCurrent())) {
								skipped = true;
								return true;
							}
						}
					},

					getCurrent: function () {
						return indexIterator.getCurrent();
					},
				};				
			},
		}),
	}); 	
};

/**
 * Skips values in the series until a condition is met.
 *
 * @param {function} predicate - Return true to indicate the condition met.
 */
BaseSeries.prototype.skipUntil = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'skipUntil' function to be a predicate function that returns true/false.");

	var self = this;
	return self.skipWhile(function (value) { return !predicate(value); });
};

/**
 * Take a number of rows in the series.
 *
 * @param {int} numRows - Number of rows to take.
 */
BaseSeries.prototype.take = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'take' function to be a number.");

	var Series = require('./series'); // Require here to prevent circular ref.
	
	var self = this;
	return new Series({
		values: {
			getIterator: function () {
				return new ArrayIterator(E
					.from(self.toValues())
					.take(numRows)
					.toArray()
				);
			},
		},
		index: self.getIndex().take(numRows),
	});
};

/**
 * Take values from the series while a condition is met.
 *
 * @param {function} predicate - Return true to indicate the condition met.
 */
BaseSeries.prototype.takeWhile = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'takeWhile' function to be a predicate function that returns true/false.");

	var Series = require('./series'); // Require here to prevent circular ref.	
	var self = this;
	return new Series({
		values: {
			getIterator: function () {
				var valueIterator = self.getIterator();
				var taking = true;
				return {
					moveNext: function () {
						if (!taking) {
							return false;
						}

						if (!valueIterator.moveNext()) {
							return false;
						}

						if (!predicate(valueIterator.getCurrent())) {
							taking = false;
							return false;
						}

						return true;
					},

					getCurrent: function () {
						return valueIterator.getCurrent();
					},
				};
			},
		},
		index: new Index({
			getIterator: function () { //too: can use an iterator here that moves multiple iterators in tandem.
				var indexIterator = self.getIndex().getIterator();
				var valueIterator = self.getIterator();
				var taking = true;
				return {
					moveNext: function () {
						if (!valueIterator.moveNext() || !indexIterator.moveNext()) {
							return false;
						}

						if (!predicate(valueIterator.getCurrent())) {
							taking = false;
							return false;
						}

						return true;
					},

					getCurrent: function () {
						return indexIterator.getCurrent();
					},
				};				
			},
		}),
	}); 	
};

/**
 * Take values from the series until a condition is met.
 *
 * @param {function} predicate - Return true to indicate the condition met.
 */
BaseSeries.prototype.takeUntil = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'takeUntil' function to be a predicate function that returns true/false.");

	var self = this;
	return self.takeWhile(function (value) { return !predicate(value); });
};

/**
 * Filter a series by a predicate selector.
 *
 * @param {function} filterSelectorPredicate - Predicte function to filter rows of the series.
 */
BaseSeries.prototype.where = function (filterSelectorPredicate) {
	assert.isFunction(filterSelectorPredicate, "Expected 'filterSelectorPredicate' parameter to 'where' function to be a function.");

	var self = this;

	var cachedFilteredIndexAndValues = null;

	//
	// Lazy  execute the filtering.
	//
	var executeLazyWhere = function () { //todo: make this properly lazy.

		if (cachedFilteredIndexAndValues) {
			return cachedFilteredIndexAndValues;
		}

		cachedFilteredIndexAndValues = E
			.from(self.getIndex().toValues())
			.zip(self.toValues(), function (index, value) {
				return [index, value];
			})
			.where(function (data) {
				var value = data[1];
				return filterSelectorPredicate(value);
			})
			.toArray();
		return cachedFilteredIndexAndValues;
	};

	var Series = require('./series');

	return new Series({
		values: {
			getIterator: function () {
				return new ArrayIterator(E.from(executeLazyWhere())
					.select(function (data) {
						return data[1]; // Value
					})
					.toArray()
				);
			},
		},
		index: new Index({
			getIterator: function () {
				return new ArrayIterator(E.from(executeLazyWhere())
					.select(function (data) {
						return data[0]; // Index
					})
					.toArray()
				);
			}
		}),
	}); 	
};

/**
 * Generate a new series based on the results of the selector function.
 *
 * @param {function} selector - Selector function that transforms each value to a different data structure.
 */
BaseSeries.prototype.select = function (selector) {
	assert.isFunction(selector, "Expected 'selector' parameter to 'select' function to be a function.");

	var self = this;

	var Series = require('./series');
	return new Series({
		values: {
			getIterator: function () {
				return new ArrayIterator(
					E.from(self.toValues())
						.select(function (value) {
							return selector(value);
						})
						.toArray()
				);
			},
		},		
		index: self.getIndex(),
	}); 	
};

/**
 * Generate a new series based on the results of the selector function.
 *
 * @param {function} selector - Selector function that transforms each value to a different data structure.
 */
BaseSeries.prototype.selectMany = function (selector) {
	assert.isFunction(selector, "Expected 'selector' parameter to 'selectMany' function to be a function.");

	var self = this;

	var newIndexAndNewValues = null;
	var newValues = null;

	var lazyEvaluate = function () {

		if (newIndexAndNewValues) {
			return;
		}

		newIndexAndNewValues = E.from(self.getIndex().toValues())
			.zip(self.toValues(), function (index, value) {
				return [index, selector(value)];
			})
			.toArray();

		newValues = E.from(newIndexAndNewValues)
			.selectMany(function (data) {
				return data[1]; // Extract expanded values.
			})
			.toArray();
	};

	var Series = require('./series');

	return new Series({
		values: {
			getIterator: function () {
				lazyEvaluate();
				return new ArrayIterator(newValues);
			}
		},
		index: new Index({
			getIterator: function () {
				lazyEvaluate();
				var indexValues = E.from(newIndexAndNewValues)
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
			},
		}),
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
			.zip(self.toValues(), function (index, value) {
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

	var Series = require('./series');

	return new Series({
		values: {
			getIterator: function () {
				return new ArrayIterator(
					E.from(executeLazySort())
						.select(function (row) {
							return row[1]; // Extract the value (minus the index) from the sorted data.					
						})
						.toArray()
					);
			},
		},
		index: new Index({
			getIterator: function () {
				return new ArrayIterator(E.from(executeLazySort())
					.select(function (row) {
						return row[0]; // Extract the index from the sorted data.
					})
					.toArray()
				);
			},
		}),
	});
};

//
// Order by values in a partcular series, either ascending or descending
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
		assert.isFunction(sortSelector, "Expected parameter 'sortSelector' to be a function");

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
 * Sorts the series by value (ascending). 
 */
BaseSeries.prototype.order = function () {

	var self = this;
	return orderBy(self, 'orderBy', function (value) { 
		return value; 
	});
};

/**
 * Sorts the series by value (descending). 
 */
BaseSeries.prototype.orderDescending = function (optionalSortSelector) {

	var self = this;
	return orderBy(self, 'orderByDescending', function (value) {
		return value;
	});
};

/**
 * Sorts the series by sort selector (ascending). 
 * 
 * @param {function} sortSelector - An function to select a value to sort by.
 */
BaseSeries.prototype.orderBy = function (sortSelector) {

	assert.isFunction

	var self = this;
	return orderBy(self, 'orderBy', sortSelector);
};

/**
 * Sorts the series by sort selector (descending). 
 * 
 * @param {function} sortSelector - An function to select a value to sort by.
 */
BaseSeries.prototype.orderByDescending = function (sortSelector) {

	var self = this;
	return orderBy(self, 'orderByDescending', sortSelector);
};

/**
 * Create a new series from a slice of rows.
 *
 * @param {int} startIndex - Index where the slice starts.
 * @param {int} endIndex - Marks the end of the slice, one row past the last row to include.
 */
BaseSeries.prototype.slice = function (startIndex, endIndex) {
	assert.isNumber(startIndex, "Expected 'startIndex' parameter to slice to be an integer.");
	assert.isNumber(endIndex, "Expected 'endIndex' parameter to slice to be an integer.");
	assert(endIndex >= startIndex, "Expected 'endIndex' parameter to slice to be greater than or equal to 'startIndex' parameter.");

	var self = this;

	var Series = require('./series'); // Require here to prevent circular ref.
	return new Series({
		values: {
			getIterator: function () {
				return new ArrayIterator( //todo: make this lazy.
					E.from(self.toValues())
						.skip(startIndex)
						.take(endIndex - startIndex)
						.toArray()
				);
			},
		},		
		index: self.getIndex().slice(startIndex, endIndex),
	});
};

/** 
 * Move a rolling window over the series, invoke a selector function to build a new series.
 *
 * @param {integer} period - The number of entries to include in the window.
 * @param {function} selector - The selector function that builds the output series.
 *
 * The selector has the following parameters: 
 *
 *		window - Series that represents the rolling window.
 *		windowIndex - The 0-based index of the window.
 */
BaseSeries.prototype.rollingWindow = function (period, fn) {

	assert.isNumber(period, "Expected 'period' parameter to 'rollingWindow' to be a number.");
	assert.isFunction(fn, "Expected 'fn' parameter to 'rollingWindow' to be a function.");

	var self = this;

	//todo: make this properly lazy

	var index = self.getIndex().toValues();
	var values = self.toValues();

	if (values.length == 0) {
		var Series = require('./series');
		return new Series();
	}

	var newIndexAndValues = E.range(0, values.length-period+1)
		.select(function (rowIndex) {
			var _index = E.from(index).skip(rowIndex).take(period).toArray();
			var _values = E.from(values).skip(rowIndex).take(period).toArray();
			var Series = require('./series'); //todo: use a lazy series for this.
			var _window = new Series({ values: _values, index: new Index(_index) });
			return fn(_window, rowIndex);
		})
		.toArray();

	var Series = require('./series');
	return new Series({
		values: {
			getIterator: function () {
				return new ArrayIterator(E.from(newIndexAndValues)
					.select(function (indexAndValue) {
						return indexAndValue[1];
					})
					.toArray()
				);
			},
		},
		index: new Index({
			getIterator: function () {
				return new ArrayIterator(E.from(newIndexAndValues)
					.select(function (indexAndValue) {
						return indexAndValue[0];
					})
					.toArray()
				);
			},
		}),
	});
};

/**
 * Create a new series, reindexed from this series.
 *
 * @param {index} newIndex - The index used to generate the new series.
 */
BaseSeries.prototype.reindex = function (newIndex) {
	assert.isObject(newIndex, "Expected 'newIndex' parameter to 'reindex' function to be an index.");

	var self = this;

	var Series = require('./series');
	return new Series({
		values: {
			getIterator: function () {
				//
				// Generate a map to relate an index value to a series value.
				//
				var indexMap = {};
				var indexExists = {};

				E.from(self.getIndex().toValues())
					.zip(self.toValues(), 
						function (indexValue, seriesValue) {
							return [indexValue, seriesValue];
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
				// Return the series values in the order specified by the new index.
				//
				return new ArrayIterator(E.from(newIndex.toValues())
					.select(function (newIndexValue) {
						return indexMap[newIndexValue];
					})
					.toArray()
				);
			},
		},		
		index: newIndex,
	});
};

/** 
 * Format the data frame for display as a string.
 */
BaseSeries.prototype.toString = function () {

	var self = this;
	var Table = require('easy-table');

	var index = self.getIndex().toValues();
	var header = ["__index__", "__value__"];
	var rows = E.from(self.toValues())
			.select(function (value, rowIndex) { 
				return [index[rowIndex], value];
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
 * Compute the percent change for each row after the first.
 * Percentages are expressed as 0-1 values.
 */
BaseSeries.prototype.percentChange = function () {

	var self = this;
	return self.rollingWindow(2, function (window) {
		var index = window.getIndex().skip(1).first();
		var values = window.toValues();
		var amountChange = values[1] - values[0]; // Compute amount of change.
		var pctChange = amountChange / values[0]; // Compute % change.
		return [index, pctChange]; // Return new index and value.
	});
};

/**
 * Parse a series with string values to a series with int values.
 */
BaseSeries.prototype.parseInts = function () {

	var self = this;
	return self.select(function (value, valueIndex) {
		if (value === undefined) {
			return undefined;
		}
		else {
			assert.isString(value, "Called parseInt on series, expected all values in the series to be strings, instead found a '" + typeof(value) + "' at index " + valueIndex);

			if (value.length === 0) {
				return undefined;
			}

			return parseInt(value);
		}
	});
};

/**
 * Parse a series with string values to a series with float values.
 */
BaseSeries.prototype.parseFloats = function () {

	var self = this;
	return self.select(function (value, valueIndex) {
		if (value === undefined) {
			return undefined;
		}
		else {
			assert.isString(value, "Called parseInt on series, expected all values in the series to be strings, instead found a '" + typeof(value) + "' at index " + valueIndex);

			if (value.length === 0) {
				return undefined;
			}

			return parseFloat(value);
		}
	});
};

/**
 * Parse a series with string values to a series with date values.
 */
BaseSeries.prototype.parseDates = function () {

	var self = this;
	return self.select(function (value, valueIndex) {
		if (value === undefined) {
			return undefined;
		}
		else {
			assert.isString(value, "Called parseInt on series, expected all values in the series to be strings, instead found a '" + typeof(value) + "' at index " + valueIndex);

			if (value.length === 0) {
				return undefined;
			}

			return moment(value).toDate();
		}
	});
};

/**
 * Convert a series of values of different types to a series of string values.
 */
BaseSeries.prototype.toStrings = function () {

	var self = this;
	return self.select(function (value) {
		if (value === undefined) {
			return undefined;
		}
		else if (value === null) {
			return null;
		}
		else {
			return value.toString();	
		}		
	});
};

/** 
  * Detect the actual types of the values that comprised the series and their frequency.
  * Returns a new series containing the type information.
  */
BaseSeries.prototype.detectTypes = function () {

	var self = this;

	var DataFrame = require('./dataframe');
	return new DataFrame({
		columnNames: ["Type", "Frequency"],
		rows: {
			getIterator: function () { //todo: make this properly lazy.
				var values = self.toValues();
				var totalValues = values.length;

				var typeFrequencies = E.from(values)
					.select(function (value) {
						var valueType = typeof(value);
						if (valueType === 'object') {
							if (Object.isDate(value)) {
								valueType = 'date';
							}
						}
						return valueType;
					})
					.aggregate({}, function (accumulated, valueType) {
						var typeInfo = accumulated[valueType];
						if (!typeInfo) {
							typeInfo = {
								count: 0
							};
							accumulated[valueType] = typeInfo;
						}
						++typeInfo.count;
						return accumulated;
					});

				return new ArrayIterator(
					E.from(Object.keys(typeFrequencies))
						.select(function (valueType) {
							return [
								valueType,
								(typeFrequencies[valueType].count / totalValues) * 100
							];
						})
						.toArray()
				);
			}
		},		
	});
};

/** 
  * Detect the frequency of values in the series.
  * Returns a new series containing the information.
  */
BaseSeries.prototype.detectValues = function () {

	var self = this;

	var DataFrame = require('./dataframe');
	return new DataFrame({
		columnNames: ["Value", "Frequency"],
		rows: {
			getIterator: function () {
				var values = self.toValues();
				var totalValues = values.length;

				var valueFrequencies = E.from(values)
					.aggregate({}, function (accumulated, value) {
						var valueKey = value.toString() + "-" + typeof(value);
						var valueInfo = accumulated[valueKey];
						if (!valueInfo) {
							valueInfo = {
								count: 0,
								value: value,
							};
							accumulated[valueKey] = valueInfo;
						}
						++valueInfo.count;
						return accumulated;
					});

				return new ArrayIterator(
					E.from(Object.keys(valueFrequencies))
						.select(function (valueKey) {
							var valueInfo = valueFrequencies[valueKey];
							return [
								valueInfo.value,
								(valueInfo.count / totalValues) * 100
							];
						})
						.toArray()
				);
			},
		},		
	});
};

/**
 * Produces a new series with all string values truncated to the requested maximum length.
 *
 * @param {int} maxLength - The maximum length of the string values after truncation.
 */
BaseSeries.prototype.truncateStrings = function (maxLength) {
	assert.isNumber(maxLength, "Expected 'maxLength' parameter to 'truncateStrings' to be an integer.");

	var self = this;
	return self
		.select(function (value) {
			if (Object.isString(value)) {
				if (value.length > maxLength) {
					return value.substring(0, maxLength);
				}
			}

			return value;
		});
};

/*
 * Extract values from the series. This forces lazy evaluation to complete.
 */
BaseSeries.prototype.toValues = function () {

	var self = this;
	var iterator = self.getIterator();
	validateIterator(iterator);

	var values = [];

	while (iterator.moveNext()) {
		values.push(iterator.getCurrent());
	}

	return values;
};

/**
 * Forces lazy evaluation to complete and 'bakes' the series into memory.
 */
BaseSeries.prototype.bake = function () {

	var self = this;

	var Series = require('./series');
	return new Series({ values: self.toValues(), index: self.getIndex().bake() });
};

/**
 * Retreive the data as pairs of [index, value].
 */
BaseSeries.prototype.toPairs = function () {

	var self = this;
	return E.from(self.getIndex().toValues())
		.zip(self.toValues(), function (index, value) {
			return [index, value];
		})
		.toArray();
};

/**
 * Count the number of rows in the series.
 */
BaseSeries.prototype.count = function () {

	var self = this;
	var total = 0;
	var iterator = self.getIterator();

	while (iterator.moveNext()) {
		++total;
	}

	return total;
};

/**
 * Get the first row of the series.
 */
BaseSeries.prototype.first = function () {

	var self = this;
	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		throw new Error("No rows in series.");
	}

	return iterator.getCurrent();	
};

/**
 * Get the last row of the series.
 */
BaseSeries.prototype.last = function () {

	var self = this;
	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		throw new Error("No rows in series.");
	}

	var last = iterator.getCurrent();

	while (iterator.moveNext()) {
		last = iterator.getCurrent();
	}

	return last;
};

/** 
 * Reverse the series.
 */
BaseSeries.prototype.reverse = function () {

	var self = this;

	var Series = require('./series');
	return new Series({
			values: E.from(self.toValues()).reverse().toArray(),
			index: self.getIndex().reverse(),
		});
};

/** 
 * Inflate a series to a data-frame.
 *
 * @param {function} selector - Selector function that transforms each value in the series to a row in the new data-frame.
 */
BaseSeries.prototype.inflate = function (selector) {

	assert.isFunction(selector, "Expected 'selector' parameter to 'inflate' function to be a function.");

	var self = this;

	//todo: make this lazy.
	//todo: need a better implementation.

	var DataFrame = require('./dataframe');
	return new DataFrame({
			columnNames: ["__gen__"],
			rows: E.from(self.toValues())
				.select(function (value) {
					return [value];
				})
				.toArray(),
			index: self.getIndex(),
		})
		.select(function (row) {
			return selector(row.__gen__);
		});
};

/** 
 * Get X values from the head of the series.
 *
 * @param {int} values - Number of values to take.
 */
BaseSeries.prototype.head = function (values) {

	assert.isNumber(values, "Expected 'values' parameter to 'head' function to be a function.");

	var self = this;
	return self.take(values);
};

/** 
 * Get X values from the tail of the series.
 *
 * @param {int} values - Number of values to take.
 */
BaseSeries.prototype.tail = function (values) {

	assert.isNumber(values, "Expected 'values' parameter to 'tail' function to be a function.");

	var self = this;
	return self.skip(self.count() - values);
};

/**
 * Sum the values in a series.
 */
BaseSeries.prototype.sum = function () {

	var self = this;
	var self = this;
	return self.aggregate(
		function (prev, value) {
			return prev + value;
		}
	);
};

/**
 * Average the values in a series.
 */
BaseSeries.prototype.average = function () {

	var self = this;
	return self.sum() / self.count();
};

/**
 * Get the min value in the series.
 */
BaseSeries.prototype.min = function () {

	var self = this;
	return self.aggregate(
		function (prev, value) {
			return Math.min(prev, value);
		}
	);
};

/**
 * Get the max value in the series.
 */
BaseSeries.prototype.max = function () {

	var self = this;
	return self.aggregate(
		function (prev, value) {
			return Math.max(prev, value);
		}
	);
};

/**
 * Aggregate the values in the series.
 *
 * @param {object} [seed] - The seed value for producing the aggregation.
 * @param {function} selector - Function that takes the seed and then each value in the series and produces the aggregate value.
 */
BaseSeries.prototype.aggregate = function (seedOrSelector, selector) {

	var self = this;

	if (Object.isFunction(seedOrSelector) && !selector) {

		return E.from(self.skip(1).toValues()).aggregate(self.first(), seedOrSelector);
	}
	else {
		assert.isFunction(selector, "Expected 'selector' parameter to aggregate to be a function.");

		return E.from(self.toValues()).aggregate(seedOrSelector, selector);
	}
};


module.exports = BaseSeries;