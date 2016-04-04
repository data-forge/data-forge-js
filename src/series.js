'use strict';

// 
// Base class for series classes.
//

var assert = require('chai').assert; 
var E = require('linq');
var moment = require('moment');
var ArrayIterator = require('./iterators/array');
var validateIterator = require('./iterators/validate');
var Index = require('./index');
var SkipIterator = require('./iterators/skip');
var SkipWhileIterator = require('./iterators/skip-while');
var TakeIterator = require('../src/iterators/take');
var TakeWhileIterator = require('../src/iterators/take-while');
var SelectIterator = require('../src/iterators/select');
var SelectManyIterator = require('../src/iterators/select-many');
var PairIterator = require('../src/iterators/pair');
var WhereIterator = require('../src/iterators/where');
var CountIterator = require('../src/iterators/count');
var EmptyIterator = require('../src/iterators/empty');

/**
 * Represents a time series.
 */
var Series = function (config) {

	var self = this;

	if (!config) {
		self.getIterator = function () {
			return new EmptyIterator();
		};
		return;
	}

	if (config && config.iterable) {
		assert.isFunction(config.iterable);

		self.getIterator = config.iterable;
		return;
	}

	if (!config.values) {
		throw new Error("Expected 'values' field to be set on 'config' parameter to Series constructor.");
	}

	if (!Object.isFunction(config.values)) {
		assert.isArray(config.values, "Expected 'values' field of 'config' parameter to Series constructor be an array of values or a function that returns an iterator.");
	}

	if (config.index) {
		if (!Object.isArray(config.index)) {
			assert.isObject(config.index, "Expected 'index' field of 'config' parameter to Series constructor to be an array of values or an Index object.");
		}
	}

	var values = config.values;

	if (!config.index) {
		// Index not supplied.
		// Generate an index.
		if (Object.isFunction(values)) {
			self.getIterator = function () {
				return new PairIterator(new CountIterator(), values());
			};
		}
		else {
			self.getIterator = function () {
				return new PairIterator(new CountIterator(), new ArrayIterator(values));
			};
		}
		return;
	}

	var index = config.index;

	if (Object.isArray(index)) {
		if (Object.isFunction(values)) {
			return new PairIterator(new ArrayIterator(index), values());
		}
		else {
			self.getIterator = function () {
				return new PairIterator(new ArrayIterator(index), new ArrayIterator(values));
			};			
		}
	}
	else {
		if (Object.isFunction(values)) {
			return new PairIterator(index.getIterator(), values());
		}
		else {
			self.getIterator = function () {
				return new PairIterator(index.getIterator(), new ArrayIterator(values));
			};			
		}
	}
};

/**
 * Get an iterator for the iterating the values of the series.
 */
Series.prototype.getIterator = function () {
	return new EmptyIterator(); // This is redefined by the constructor.
};

/**
 * Retreive the index of the series.
 */
Series.prototype.getIndex = function () {
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
 * Skip a number of rows in the series.
 *
 * @param {int} numRows - Number of rows to skip.
 */
Series.prototype.skip = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'skip' function to be a number.");

	var self = this;
	return new Series({
		iterable: function () {
			return new SkipIterator(self.getIterator(), numRows);
		},		
	}); 	
};

/**
 * Skips values in the series while a condition is met.
 *
 * @param {function} predicate - Return true to indicate the condition met.
 */
Series.prototype.skipWhile = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'skipWhile' function to be a predicate function that returns true/false.");

	var self = this;
	return new Series({
		iterable: function () {
			return new SkipWhileIterator(self.getIterator(), 
				function (pair) {
					return predicate(pair[1]);
				}
			);
		},
	}); 	
};

/**
 * Skips values in the series until a condition is met.
 *
 * @param {function} predicate - Return true to indicate the condition met.
 */
Series.prototype.skipUntil = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'skipUntil' function to be a predicate function that returns true/false.");

	var self = this;
	return self.skipWhile(function (value) { 
		return !predicate(value); 
	});
};

/**
 * Take a number of rows in the series.
 *
 * @param {int} numRows - Number of rows to take.
 */
Series.prototype.take = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'take' function to be a number.");

	var self = this;
	return new Series({
		iterable: function () {
			return new TakeIterator(self.getIterator(), numRows);
		},
	});
};

/**
 * Take values from the series while a condition is met.
 *
 * @param {function} predicate - Return true to indicate the condition met.
 */
Series.prototype.takeWhile = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'takeWhile' function to be a predicate function that returns true/false.");

	var self = this;
	return new Series({
		iterable: function () {
			return new TakeWhileIterator(self.getIterator(), 
				function (pair) {
					return predicate(pair[1]);
				}
			);
		},
	}); 	
};

/**
 * Take values from the series until a condition is met.
 *
 * @param {function} predicate - Return true to indicate the condition met.
 */
Series.prototype.takeUntil = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'takeUntil' function to be a predicate function that returns true/false.");

	var self = this;
	return self.takeWhile(function (value) { 
		return !predicate(value); 
	});
};

/**
 * Filter a series by a predicate selector.
 *
 * @param {function} filterSelectorPredicate - Predicte function to filter rows of the series.
 */
Series.prototype.where = function (filterSelectorPredicate) {
	assert.isFunction(filterSelectorPredicate, "Expected 'filterSelectorPredicate' parameter to 'where' function to be a function.");

	var self = this;
	return new Series({
		iterable: function () {
			return new WhereIterator(self.getIterator(), 
				function (pair) {
					return filterSelectorPredicate(pair[1]);
				}
			);
		},
	}); 	
};

/**
 * Generate a new series based on the results of the selector function.
 *
 * @param {function} selector - Selector function that transforms each value to a different data structure.
 */
Series.prototype.select = function (selector) {
	assert.isFunction(selector, "Expected 'selector' parameter to 'select' function to be a function.");

	var self = this;
	return new Series({
		iterable: function () {
			return new SelectIterator(self.getIterator(), 
				function (pair) {
					return [pair[0], selector(pair[1])];
				}
			);
		},		
	}); 	
};

/**
 * Generate a new series based on the results of the selector function.
 *
 * @param {function} selector - Selector function that transforms each value to a different data structure.
 */
Series.prototype.selectMany = function (selector) {
	assert.isFunction(selector, "Expected 'selector' parameter to 'selectMany' function to be a function.");

	var self = this;

	return new Series({
		iterable: function () {
			return new SelectManyIterator(self.getIterator(), 
				function (pair) {
					return E.from(selector(pair[1]))
						.select(function (newValue) {
							return [pair[0], newValue];
						})
						.toArray();
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

	//
	// Don't invoke the sort until we really know what we need.
	//
	var executeLazySort = function () {

		batch.forEach(function (orderCmd) {
			assert.isObject(orderCmd);
			assert.isFunction(orderCmd.sortSelector);
			validateSortMethod(orderCmd.sortMethod);
		});

		var pairs = self.toPairs();

		return E.from(batch)
			.aggregate(E.from(pairs), function (unsorted, orderCmd) {
				return unsorted[orderCmd.sortMethod](function (pair) {
					return orderCmd.sortSelector(pair[1]);
				}); 
			})
			.toArray();
	};

	return new Series({
		iterable: function () {
			return new ArrayIterator(executeLazySort());
		},
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
Series.prototype.order = function () {

	var self = this;
	return orderBy(self, 'orderBy', function (value) { 
		return value; 
	});
};

/**
 * Sorts the series by value (descending). 
 */
Series.prototype.orderDescending = function (optionalSortSelector) {

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
Series.prototype.orderBy = function (sortSelector) {

	assert.isFunction

	var self = this;
	return orderBy(self, 'orderBy', sortSelector);
};

/**
 * Sorts the series by sort selector (descending). 
 * 
 * @param {function} sortSelector - An function to select a value to sort by.
 */
Series.prototype.orderByDescending = function (sortSelector) {

	var self = this;
	return orderBy(self, 'orderByDescending', sortSelector);
};

/**
 * Create a new series from a slice of rows.
 *
 * @param {int|function} startIndexOrStartPredicate - Index where the slice starts or a predicate function that determines where the slice starts.
 * @param {int|function} endIndexOrEndPredicate - Marks the end of the slice, one row past the last row to include. Or a predicate function that determines when the slice has ended.
 * @param {function} [predicate] - Optional predicate to compare index against start/end index. Return true to start or stop the slice.
 */
Series.prototype.slice = function (startIndexOrStartPredicate, endIndexOrEndPredicate, predicate) {

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

	return new Series({
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
 * Move a window over the series (batch by batch), invoke a selector for each window that builds a new series.
 *
 * @param {integer} period - The number of rows in the window.
 * @param {function} selector - The selector function invoked per row that builds the output series.
 *
 * The selector has the following parameters: 
 *
 *		window - Data-frame that represents the rolling window.
 *		windowIndex - The 0-based index of the window.
 */
Series.prototype.window = function (period, selector) {

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
 * Move a rolling window over the series (row by row), invoke a selector for each window that builds a new series.
 *
 * @param {integer} period - The number of rows in the window.
 * @param {function} selector - The selector function invoked per row that builds the output series.
 *
 * The selector has the following parameters: 
 *
 *		window - Series that represents the rolling window.
 *		windowIndex - The 0-based index of the window.
 */
Series.prototype.rollingWindow = function (period, selector) {

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
 * Create a new series, reindexed from this series.
 *
 * @param {index} newIndex - The index used to generate the new series.
 */
Series.prototype.reindex = function (newIndex) {
	assert.isObject(newIndex, "Expected 'newIndex' parameter to 'reindex' function to be an index.");

	var self = this;

	return new Series({
		iterable: function () {
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
					return [newIndexValue, indexMap[newIndexValue]];
				})
				.toArray()
			);
		},		
	});
};

/** 
 * Format the data frame for display as a string.
 */
Series.prototype.toString = function () {

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
Series.prototype.percentChange = function () {

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
Series.prototype.parseInts = function () {

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
Series.prototype.parseFloats = function () {

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
 *
 * @param {string} [formatString] - Optional formatting string for dates.
 */
Series.prototype.parseDates = function (formatString) {

	if (formatString) {
		assert.isString(formatString, "Expected optional 'formatString' parameter to parseDates to be a string (if specified).");
	}

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

			return moment(value, formatString).toDate();
		}
	});
};

/**
 * Convert a series of values of different types to a series of string values.
 *
 * @param {string} [formatString] - Optional formatting string for dates.
 */
Series.prototype.toStrings = function (formatString) {

	if (formatString) {
		assert.isString(formatString, "Expected optional 'formatString' parameter to parseDates to be a string (if specified).");
	}

	var self = this;
	return self.select(function (value) {
		if (value === undefined) {
			return undefined;
		}
		else if (value === null) {
			return null;
		}
		else if (formatString && Object.isDate(value)) {
			return moment(value).format(formatString);
		}
		else if (formatString && moment.isMoment(value)) {
			return value.format(formatString);
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
Series.prototype.detectTypes = function () {

	var self = this;

	var DataFrame = require('./dataframe');
	return new DataFrame({
		columnNames: ["Type", "Frequency"],
		rows: function () { //todo: make this properly lazy.
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
		},		
	});
};

/** 
  * Detect the frequency of values in the series.
  * Returns a new series containing the information.
  */
Series.prototype.detectValues = function () {

	var self = this;

	var DataFrame = require('./dataframe');
	return new DataFrame({
		columnNames: ["Value", "Frequency"],
		rows: function () {
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
	});
};

/**
 * Produces a new series with all string values truncated to the requested maximum length.
 *
 * @param {int} maxLength - The maximum length of the string values after truncation.
 */
Series.prototype.truncateStrings = function (maxLength) {
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
Series.prototype.toValues = function () {

	var self = this;
	var iterator = self.getIterator();
	validateIterator(iterator);

	var values = [];

	while (iterator.moveNext()) {
		values.push(iterator.getCurrent()[1]);
	}

	return values;
};

/**
 * Forces lazy evaluation to complete and 'bakes' the series into memory.
 */
Series.prototype.bake = function () {

	var self = this;
	var pairs = self.toPairs();
	return new Series({
		iterable: function () {
			return new ArrayIterator(pairs);
		},
	});
};

/**
 * Retreive the data as pairs of [index, value].
 */
Series.prototype.toPairs = function () {

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
 * Count the number of rows in the series.
 */
Series.prototype.count = function () {

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
Series.prototype.first = function () {

	var self = this;
	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		throw new Error("No rows in series.");
	}

	return iterator.getCurrent()[1];
};

/**
 * Get the last row of the series.
 */
Series.prototype.last = function () {

	var self = this;
	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		throw new Error("No rows in series.");
	}

	var last = iterator.getCurrent();

	while (iterator.moveNext()) {
		last = iterator.getCurrent();
	}

	return last[1];
};

/** 
 * Reverse the series.
 */
Series.prototype.reverse = function () {

	var self = this;

	return new Series({
			values: E.from(self.toValues()).reverse().toArray(),
			index: self.getIndex().reverse(),
		});
};

/** 
 * Inflate a series to a data-frame.
 *
 * @param {function} [selector] - Optional selector function that transforms each value in the series to a row in the new data-frame.
 */
Series.prototype.inflate = function (selector) {

	var self = this;

	if (selector) {
		assert.isFunction(selector, "Expected 'selector' parameter to 'inflate' function to be a function.");
	}
	else {
		selector = function (value) {
			return value;
		}
	}

	var DataFrame = require('./dataframe');
	return new DataFrame({
		iterable: function () {
			return self.select(selector).getIterator();
		},
	});
};

/** 
 * Get X values from the head of the series.
 *
 * @param {int} values - Number of values to take.
 */
Series.prototype.head = function (values) {

	assert.isNumber(values, "Expected 'values' parameter to 'head' function to be a function.");

	var self = this;
	return self.take(values);
};

/** 
 * Get X values from the tail of the series.
 *
 * @param {int} values - Number of values to take.
 */
Series.prototype.tail = function (values) {

	assert.isNumber(values, "Expected 'values' parameter to 'tail' function to be a function.");

	var self = this;
	return self.skip(self.count() - values);
};

/**
 * Sum the values in a series.
 */
Series.prototype.sum = function () {

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
Series.prototype.average = function () {

	var self = this;
	return self.sum() / self.count();
};

/**
 * Get the min value in the series.
 */
Series.prototype.min = function () {

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
Series.prototype.max = function () {

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
Series.prototype.aggregate = function (seedOrSelector, selector) {

	var self = this;

	if (Object.isFunction(seedOrSelector) && !selector) {
		return self.skip(1).aggregate(self.first(), seedOrSelector);
	}
	else {
		assert.isFunction(selector, "Expected 'selector' parameter to aggregate to be a function.");

		var working = seedOrSelector;
		var it = self.getIterator();
		while (it.moveNext()) {
			var curValue = it.getCurrent()[1];
			working = selector(working, curValue); //todo: should pass index in here as well.
		}

		return working;
	}
};

/**
 * Convert the series to a JavaScript object.
 *
 * @param {function} keySelector - Function that selects keys for the resulting object.
 * @param {valueSelector} keySelector - Function that selects values for the resulting object.
 */
Series.prototype.toObject = function (keySelector, valueSelector) {

	var self = this;

	assert.isFunction(keySelector, "Expected 'keySelector' parameter to toObject to be a function.");
	assert.isFunction(valueSelector, "Expected 'valueSelector' parameter to toObject to be a function.");

	return E.from(self.toValues()).toObject(keySelector, valueSelector);
};

/**
 * Zip together multiple series to produce a new series.
 *
 * @param {...series} series - Each series that is to be zipped.
 * @param {function} selector - Selector function that produces a new series based on the inputs.
 */
Series.prototype.zip = function () {

	var inputSeries = E.from(arguments)
		.takeWhile(function (arg) {
			return arg && !Object.isFunction(arg);
		})
		.toArray();

	assert(inputSeries.length >= 0, "Expected 1 or more 'series' parameters to the zip function.");

	inputSeries = [this].concat(inputSeries);

	var selector = E.from(arguments)
		.skipWhile(function (arg) {
			return arg && !Object.isFunction(arg);
		})
		.firstOrDefault();

	assert.isFunction(selector, "Expect 'selector' parameter to zip to be a function.");

	var dataForge = require('../index.js');
	return dataForge.zipSeries(inputSeries, function (values) {
			return selector.apply(undefined, values);
		});
};

/**
 * Invoke a callback function for each value in the series.
 *
 * @param {function} callback - The calback to invoke for each value.
 */
Series.prototype.forEach = function (callback) {
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

module.exports = Series;