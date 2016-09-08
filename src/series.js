'use strict';

// 
// Base class for series classes.
//

var assert = require('chai').assert; 
var E = require('linq');
var moment = require('moment');
var ArrayIterator = require('./iterators/array');
var validateIterator = require('./iterators/validate');
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
var extend = require('extend');

//
// Represents a time series.
//
var Series = function (config) {

	var self = this;

	if (!self.Constructor) {
		self.Constructor = Series;
	}

	if (!config) {
		self.__iterable = {
			getIndexIterator: function () {
				return new EmptyIterator();
			},
			getValuesIterator: function () {
				return new EmptyIterator();
			},
		};
		return;
	}

	assert.isObject(config, "Expected 'config' parameter to Series constructor to be an object with options for initialisation.");

	if (config.__iterable) {
		// Setting the inner iterable directly.
		// Power to you!
		self.__iterable = config.__iterable;
		return;
	}

	if (config.iterable) { //todo: this is expensive. Want to eliminate it.

		assert.isFunction(config.iterable, "Expected 'iterable' field of 'config' parameter to Series constructor to be a function that returns an index/value pairs iterator.");

		var iterable = config.iterable;

		self.__iterable = {
			getIndexIterator: function () {
				return new SelectIterator(
					iterable(),
					function (pair) {
						return pair[0];
					}
				);
			},
			getValuesIterator: function () {
				return new SelectIterator(
					iterable(),
					function (pair) {
						return pair[1];
					}
				);
			},
		};
		return;
	}

	if (config.values) {
		if (!Object.isFunction(config.values)) {
			assert.isArray(config.values, "Expected 'values' field of 'config' parameter to Series constructor be an array of values or a function that returns an iterator.");
		}
	}

	if (config.index) {
		if (!Object.isFunction(config.index) && !Object.isArray(config.index)) {
			assert.isObject(config.index, "Expected 'index' field of 'config' parameter to Series constructor to be an array, function or Series object.");
		}
	}

	self.__iterable = {};

	var index = config.index;
	if (!index) {
		self.__iterable.getIndexIterator = function () {
			return new CountIterator();			
		};
	}
	else if (Object.isFunction(index)) {
		self.__iterable.getIndexIterator = index;
	}
	else if (Object.isArray(index)) {
		self.__iterable.getIndexIterator = function () {
			return new ArrayIterator(index);
		};
	}
	else {		
		self.__iterable.getIndexIterator = function () { //todo: should actually check that index is a series and not a dataframe.
			return index.getValuesIterator();
		};
	}

	var values = config.values;
	if (!values) {
		self.__iterable.getValuesIterator = function () {
			return new EmptyIterator();
		};
	}
	else if (Object.isFunction(values)) {
		self.__iterable.getValuesIterator = values;
	}
	else {
		self.__iterable.getValuesIterator = function () {
			return new ArrayIterator(values);
		};
	}
};

module.exports = Series;

var concatSeries = require('./concat-series');
var DataFrame = require('./dataframe');
var zipSeries = require('./zip-series');

/**
 * Get an iterator for index & values of the series.
 */
Series.prototype.getIterator = function () { //todo: Would like to move this to '__iterable'.
	var self = this;
	return new PairIterator(
		self.getIndexIterator(),
		self.getValuesIterator()
	);
};

/*
 * Get an iterator for the index.
 */
Series.prototype.getIndexIterator = function () {
	var self = this;
	return self.__iterable.getIndexIterator();
};

/*
 * Get an iterator for the values.
 */
Series.prototype.getValuesIterator = function () {
	var self = this;
	return self.__iterable.getValuesIterator();
};

/**
 * Retreive the index of the series.
 */
Series.prototype.getIndex = function () { //todo: Do I need to move this to '__iterable'?
	var self = this;
	return new Series({
		values: function () {
			return self.getIndexIterator();
		},
	});
};

/**
 * Apply a new index to the Series.
 * 
 * @param {array|Series} newIndex - The new index to apply to the Series.
 */
Series.prototype.withIndex = function (newIndex) {

	if (!Object.isArray(newIndex)) {
		assert.isObject(newIndex, "'Expected 'newIndex' parameter to 'Series.withIndex' to be an array or Series object.");
	}	

	var self = this;
	return new Series({
		index: newIndex,
		values: function () { 
			return self.getValuesIterator();
		}, 
	});
};

/**
 * Reset the index of the data frame back to the default sequential integer index.
 */
Series.prototype.resetIndex = function () {

	var self = this;
	return new Series({
		values: function () {
			return self.getValuesIterator();
		},
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
	return new self.Constructor({
		__iterable: {
			getIndexIterator: function () {
				return new SkipIterator(self.getIndexIterator(), numRows);
			},

			getValuesIterator: function () {
			return new SkipIterator(self.getValuesIterator(), numRows);
			},

			getColumnNames: function () {
				return self.getColumnNames();
			},
		}
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
	return new self.Constructor({
		__iterable: {
			getIndexIterator: function () {
				return new SelectIterator(
					new SkipWhileIterator(self.getIterator(), 
						function (pair) {
							return predicate(pair[1]);
						}
					),
					function (pair) {
						return pair[0]; // Extract index.
					}
				);
			},

			getValuesIterator: function () {
				return new SkipWhileIterator(self.getValuesIterator(), predicate); 
			},

			getColumnNames: function () {
				return self.getColumnNames();
			},
		}
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
	return new self.Constructor({
		__iterable: {
			getIndexIterator: function () {
				return new TakeIterator(self.getIndexIterator(), numRows);
			},

			getValuesIterator: function () {
				return new TakeIterator(self.getValuesIterator(), numRows);
			},

			getColumnNames: function () {
				return self.getColumnNames();
			},
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
	return new self.Constructor({
		__iterable: {
			getIndexIterator: function () {
				return new SelectIterator( 
					new TakeWhileIterator(self.getIterator(), 
						function (pair) {
							return predicate(pair[1]);
						}
					),
					function (pair) {
						return pair[0]; // Extract index.
					}
				);
			},

			getValuesIterator: function () {
				return new TakeWhileIterator(self.getValuesIterator(), predicate); 
			},

			getColumnNames: function () {
				return self.getColumnNames();
			},

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
	return new self.Constructor({
		__iterable: {
			getIndexIterator: function () {
				return new SelectIterator(
					new WhereIterator(self.getIterator(), 
						function (pair) {
							return filterSelectorPredicate(pair[1]);
						}
					),
					function (pair) {
						return pair[0];
					}
				);
			},

			getValuesIterator: function () {
				return new WhereIterator(self.getValuesIterator(), filterSelectorPredicate);
			},

			getColumnNames: function () {
				return self.getColumnNames(); // Doesn't change column names, or order.
			}
		},
	}); 	
};

//todo: Test me! And move out.
var SelectIterable = function (iterable, selector) {

	var self = this;

	self.getIndexIterator = function () {
		return iterable.getIndexIterator();
	};

	self.getValuesIterator = function () {
		return new SelectIterator(iterable.getValuesIterator(), selector);
	};

	self.getColumnNames = function () {
		// Have to get the first element to get field names.
		var iterator = self.getValuesIterator();
		if (!iterator.moveNext()) {
			return [];
		}

		return Object.keys(iterator.getCurrent());
	};
};

/**
 * Generate a new series based on the results of the selector function.
 *
 * @param {function} selector - Selector function that transforms each value to create a new series.
 */
Series.prototype.select = function (selector) {
	assert.isFunction(selector, "Expected 'selector' parameter to 'select' function to be a function.");

	var self = this;
	return new self.Constructor({
		__iterable: new SelectIterable(self, selector),
	}); 	
};

/**
 * Generate a new series based on the results of the selector function.
 *
 * @param {function} selector - Selector function that transforms each index/value to a create a new series.
 */
Series.prototype.selectPairs = function (selector) {
	assert.isFunction(selector, "Expected 'selector' parameter to 'selectPairs' function to be a function.");

	var self = this;
	return new self.Constructor({
		iterable: function () {
			return new SelectIterator(self.getIterator(), 
				function (pair) {
					var newPair = selector(pair[1], pair[0]);
					if (!Object.isArray(newPair) || newPair.length !== 2) {
						throw new Error("Expected return value from 'Series.selectPairs' selector to be a pair, that is an array with two items: [index, value].");
					}
					return newPair;
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
	assert.isFunction(selector, "Expected 'selector' parameter to 'Series.selectMany' function to be a function.");

	var self = this;

	return new self.Constructor({
		iterable: function () {
			return new SelectManyIterator(self.getIterator(), 
				function (pair) {
					var newValues = selector(pair[1]);
					if (!Object.isArray(newValues) &&
						!(newValues instanceof Series) &&
						!(newValues instanceof DataFrame)) {
						throw new Error("Expected return value from 'Series.selectMany' selector to be an array, a Series or a DataFrame, each item in the data sequence represents a new value in the resulting series.");
					}

					if (newValues instanceof DataFrame) {
						newValues = newValues.toValues();
					}
					else if (newValues instanceof Series)
					{
						newValues = newValues.toValues();
					}

					var newPairs = [];
					for (var newValueIndex = 0; newValueIndex < newValues.length; ++newValueIndex) {
						newPairs.push([pair[0], newValues[newValueIndex]]);
					}

					return newPairs;
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
Series.prototype.selectManyPairs = function (selector) {
	assert.isFunction(selector, "Expected 'selector' parameter to 'Series.selectManyPairs' function to be a function.");

	var self = this;

	return new self.Constructor({
		iterable: function () {
			return new SelectManyIterator(self.getIterator(), 
				function (pair) {
					var newPairs = selector(pair[1], pair[0]);
					if (!Object.isArray(newPairs)) {
						throw new Error("Expected return value from 'Series.selectManyPairs' selector to be an array of pairs, each item in the array represents a new pair in the resulting series.");
					}

					for (var pairIndex = 0; pairIndex < newPairs.length; ++pairIndex) {
						var newPair = newPairs[pairIndex];
						if (!Object.isArray(newPair) || newPair.length !== 2) {
							throw new Error("Expected return value from 'Series.selectManyPairs' selector to be am array of pairs, but item at index " + pairIndex + " is not an array with two items: [index, value].");
						}
					}

					return newPairs;
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

	return new self.Constructor({
		iterable: function () {
			return new ArrayIterator(executeLazySort());
		},

		considerAllRows: true, //todo: This is currently needed to have df columns survive sorting. 
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

	return new self.Constructor({
		__iterable: {
			getIndexIterator: function () {
				return new TakeWhileIterator(
					new SkipWhileIterator(
						self.getIndexIterator(),
						function (index) {
							return startPredicate(index); // Check index for start condition.
						}
					),
					function (index) {
						return endPredicate(index); // Check index for end condition.
					}
				);
			},

			getValuesIterator: function () {
				return new SelectIterator(
					new TakeWhileIterator(
						new SkipWhileIterator(
							self.getIterator(),
							function (pair) {
								return startPredicate(pair[0]); // Check index for start condition.
							}
						),
						function (pair) {
							return endPredicate(pair[0]); // Check index for end condition.
						}
					),
					function (pair) {
						return pair[1];
					}
				);
			},

			getColumnNames: function () {
				return self.getColumnNames();
			},
		},
	});
};

/**
 * Segment a Series into 'windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original Series.
 * Use select or selectPairs to aggregate.
 *
 * @param {integer} period - The number of values in the window.
 */
Series.prototype.window = function (period, obsoleteSelector) {

	assert.isNumber(period, "Expected 'period' parameter to 'window' to be a number.");
	assert(!obsoleteSelector, "Selector parameter is obsolete and no longer required.");

	var self = this;

	return new Series({
		iterable: function () {

			var curOutput = undefined;
			var windowIndex = 0;

			return {
				moveNext: function () {
					var window = self.skip(windowIndex*period).take(period);
					if (window.none(function () { return true; })) { //todo: Shouldn't have to pass a predicate.
						return false; // Nothing left.
					}

					curOutput = [
						windowIndex, 
						window,						
					];
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
 * Segment a Series into 'rolling windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original Series.
 * Use select or selectPairs to aggregate.
 *
 * @param {integer} period - The number of values in the window.
 */
Series.prototype.rollingWindow = function (period, obsoleteSelector) {

	assert.isNumber(period, "Expected 'period' parameter to 'rollingWindow' to be a number.");
	assert(!obsoleteSelector, "Selector parameter is obsolete and no longer required.");

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

					curOutput = [
						windowIndex, 
						window,						
					];
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
	return self
		.rollingWindow(2)
		.selectPairs(function (window) {
			var values = window.toValues();
			var amountChange = values[1] - values[0]; // Compute amount of change.
			var pctChange = amountChange / values[0]; // Compute % change.
			return [window.getIndex().last(), pctChange]; // Return new index and value.
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
			assert.isString(value, "Called parseInts on series, expected all values in the series to be strings, instead found a '" + typeof(value) + "' at index " + valueIndex);

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
			assert.isString(value, "Called parseFloats on series, expected all values in the series to be strings, instead found a '" + typeof(value) + "' at index " + valueIndex);

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
			assert.isString(value, "Called parseDates on series, expected all values in the series to be strings, instead found a '" + typeof(value) + "' at index " + valueIndex);

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

	return new DataFrame({
		columnNames: ["Type", "Frequency"],
		values: function () { //todo: make this properly lazy.
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

	return new DataFrame({
		columnNames: ["Value", "Frequency"],
		values: function () {
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
	var iterator = self.getValuesIterator();
	validateIterator(iterator);

	var values = [];

	while (iterator.moveNext()) {
		var value = iterator.getCurrent();
		if (value !== undefined) {
			values.push(iterator.getCurrent());
		}
	}

	return values;
};

/**
 * Forces lazy evaluation to complete and 'bakes' the series into memory.
 */
Series.prototype.bake = function () {

	var self = this;
	if (self._baked) {
		// Already baked, just return self.
		return self;
	}

	var pairs = self.toPairs();
	var baked = new Series({
		iterable: function () {
			return new ArrayIterator(pairs);
		},
	});
	baked._baked = true;
	return baked;
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
		var pair = iterator.getCurrent();
		if (pair[1] !== undefined) {
			pairs.push(pair);
		}		
	}

	return pairs;
};

/**
 * Count the number of rows in the series.
 */
Series.prototype.count = function () {

	var self = this;
	var total = 0;
	var iterator = self.getValuesIterator();

	while (iterator.moveNext()) {
		++total;
	}

	return total;
};

/**
 * Get the first value of the Series.
 */
Series.prototype.first = function () {

	var self = this;
	var iterator = self.getValuesIterator();

	if (!iterator.moveNext()) {
		throw new Error("No values in Series.");
	}

	return iterator.getCurrent();
};

/**
 * Get the last value of the Series.
 */
Series.prototype.last = function () {

	var self = this;
	var iterator = self.getValuesIterator();

	if (!iterator.moveNext()) {
		throw new Error("No values in Series.");
	}

	while (iterator.moveNext()) {
		; // Don't evaluate each item, it's too expensive.
	}

	return iterator.getCurrent(); // Just evaluate the last item of the iterator.
};

/**
 * Get the first index/value pair of the Series.
 */
Series.prototype.firstPair = function () {

	var self = this;
	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		throw new Error("No values in Series.");
	}

	return iterator.getCurrent();
};

/**
 * Get the last index/value pair of the Series.
 */
Series.prototype.lastPair = function () {

	var self = this;
	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		throw new Error("No values in Series.");
	}

	while (iterator.moveNext()) {
		; // Don't evaluate each item, it's too expensive.
	}

	return iterator.getCurrent();
};

/**
 * Get the first index of the Series.
 */
Series.prototype.firstIndex = function () {

	var self = this;
	var iterator = self.getIndexIterator();

	if (!iterator.moveNext()) {
		throw new Error("No values in Series.");
	}

	return iterator.getCurrent();
};

/**
 * Get the last index of the Series.
 */
Series.prototype.lastIndex = function () {

	var self = this;
	var iterator = self.getIndexIterator();

	if (!iterator.moveNext()) {
		throw new Error("No values in Series.");
	}

	while (iterator.moveNext()) {
		; // Don't evaluate each item, it's too expensive.
	}

	return iterator.getCurrent();
};

/** 
 * Reverse the series.
 */
Series.prototype.reverse = function () {

	var self = this;
	return new self.Constructor({
		iterable: function () {
			var pairs = [];
			var iterator = self.getIterator();

			while (iterator.moveNext()) {
				pairs.push(iterator.getCurrent());
			}

			return new ArrayIterator(pairs.reverse());
		},
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

	return new DataFrame({
		__iterable: new SelectIterable(
			self, 
			selector
		),
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
	if (self.none()) {
		return 0;
	}

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
	var count = self.count();
	if (count > 0) {
		return self.sum() / count;
	}
	else {
		return 0;
	}
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

	return zipSeries(inputSeries, function (values) {
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

/**
 * Determine if the predicate returns truthy for all values.
 * Returns false as soon as the predicate evaluates to falsy.
 * Returns true if the predicate returns truthy for all values in the Series.
 * Returns false if the series is empty.
 *
 * @param {function} predicate - Predicate function that receives each value in turn and returns truthy for a match, otherwise falsy.
 */
Series.prototype.all = function (predicate) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'all' to be a function.")

	var self = this;
	var iterator = self.getIterator();
	validateIterator(iterator);

	var count = 0;

	while (iterator.moveNext()) {
		var pair = iterator.getCurrent();
		if (!predicate(pair[1])) {
			return false;
		}

		++count;
	}

	return count > 0;
};

/**
 * Determine if the predicate returns truthy for any of the values.
 * Returns true as soon as the predicate returns truthy.
 * Returns false if the predicate never returns truthy.
 *
 * @param {function} [predicate] - Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy.
 */
Series.prototype.any = function (predicate) {
	if (predicate) {
		assert.isFunction(predicate, "Expected 'predicate' parameter to 'any' to be a function.")
	}

	var self = this;
	var iterator = self.getIterator();
	validateIterator(iterator);

	if (!predicate) {
		return iterator.moveNext();
	}

	while (iterator.moveNext()) {
		var pair = iterator.getCurrent();
		if (predicate(pair[1])) {
			return true;
		}
	}

	return false;
};

/**
 * Determine if the predicate returns truthy for none of the values.
 * Returns true for an empty Series.
 * Returns true if the predicate always returns falsy.
 * Otherwise returns false.
 *
 * @param {function} [predicate] - Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy.
 */
Series.prototype.none = function (predicate) {

	if (predicate) {
		assert.isFunction(predicate, "Expected 'predicate' parameter to 'none' to be a function.")
	}

	var self = this;
	var iterator = self.getIterator();
	validateIterator(iterator);

	if (!predicate) {
		return !iterator.moveNext();
	}

	while (iterator.moveNext()) {
		var pair = iterator.getCurrent();
		if (predicate(pair[1])) {
			return false;
		}
	}

	return true;
};

/**
 * Group sequential duplicate values into a Series of windows.
 *
 * @param {function} selector - Selects the value used to compare for duplicates.
 */
Series.prototype.sequentialDistinct = function (selector) {
	
	if (selector) {
		assert.isFunction(selector, "Expected 'selector' parameter to 'Series.sequentialDistinct' to be a selector function that determines the value to compare for duplicates.")
	}
	else {
		selector = function (value) {
			return value;
		};
	}

	var self = this;

	return self.variableWindow(function (a, b) {
			return selector(a) === selector(b);
		})
		.selectPairs(function (window) {
			return [window.getIndex().first(), window.first()];
		});
};

/**
 * Group distinct values in the Series into a Series of windows.
 *
 * @param {function} selector - Selects the value used to compare for duplicates.
 */
Series.prototype.distinct = function (selector) {
	
	if (selector) {
		assert.isFunction(selector, "Expected 'selector' parameter to 'Series.distinct' to be a selector function that determines the value to compare for duplicates.")
	}
	else {
		selector = function (value) {
			return value;
		};
	}

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

		for (var j = i+1; j < input.length; ++j) {
			var underComparison = input[j];
			if (underComparison.considered) {
				continue;
			}

			if (selector(underComparison.pair[1]) === selector(underConsideration.pair[1])) {
				underComparison.considered = true;
			}
		}

		output.push(curPair);
	}

	return new self.Constructor({
		iterable: function () {
			return new ArrayIterator(output);
		},
	});
};

/**
 * Groups sequential values into variable length 'windows'. The windows can then be transformed/transformed using selectPairs or selectManyPairs.
 *
 * @param {function} comparer - Predicate that compares two values and returns true if they should be in the same window.
 */
Series.prototype.variableWindow = function (comparer, obsoleteSelector) {
	
	assert.isFunction(comparer, "Expected 'comparer' parameter to 'Series.variableWindow' to be a function.")
	assert(!obsoleteSelector, "Selector parameter is obsolete and no longer required.");

	var self = this;

	//todo: make this lazy.

	var input = self.toPairs();

	var output = [];

	if (input.length > 0) {

		var startIndex = 0;
		var takeAmount = 1;
		var windowIndex = 0;

		var prevPair = input[0]; // 1st pair.

		for (var i = 1; i < input.length; ++i) {

			var curPair = input[i];
			
			if (!comparer(curPair[1], prevPair[1])) {
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

	return new Series({
			values: E.from(output)
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
 * Insert a pair at the start of a Series.
 *
 * @param {pair} pair - The pair to insert.
 */
Series.prototype.insertPair = function (pair) {
	assert.isArray(pair, "Expected 'pair' parameter to 'Series.insertPair' to be an array.");
	assert(pair.length === 2, "Expected 'pair' parameter to 'Series.insertPair' to be an array with two elements. The first element is the index, the second is the value.");

	//todo: make this lazy.

	var self = this;
	var pairs = [pair].concat(self.toPairs());
	return new self.Constructor({
		iterable: function () {
			return new ArrayIterator(pairs);
		},
	});
};

/**
 * Append a pair to the end of a Series.
 *
 * @param {pair} pair - The pair to append.
 */
Series.prototype.appendPair = function (pair) {
	assert.isArray(pair, "Expected 'pair' parameter to 'Series.appendPair' to be an array.");
	assert(pair.length === 2, "Expected 'pair' parameter to 'Series.appendPair' to be an array with two elements. The first element is the index, the second is the value.");

	//todo: make this lazy.

	var self = this;
	var pairs = self.toPairs();
	pairs.push(pair);
	return new self.Constructor({
		iterable: function () {
			return new ArrayIterator(pairs);
		},
	});
};


/**
 * Fill gaps in a series.
 *
 * @param {function} predicate - Predicate that is passed pairA and pairB, two consecutive rows, return truthy if there is a gap between the rows, or falsey if there is no gap.
 * @param {function} generator - Generator that is passed pairA and pairB, two consecutive rows, returns an array of pairs that fills the gap between the rows.
 */
Series.prototype.fillGaps = function (predicate, generator) {
	assert.isFunction(predicate, "Expected 'predicate' parameter to 'Series.fillGaps' to be a predicate function that returns a boolean.")
	assert.isFunction(generator, "Expected 'generator' parameter to 'Series.fillGaps' to be a generator function that returns an array of generated pairs.")

	var self = this;

	return self.rollingWindow(2)
		.selectManyPairs(function (window) {
			var pairA = window.firstPair();
			var pairB = window.lastPair();
			if (!predicate(pairA, pairB)) {
				return [pairA];
			}

			var generatedRows = generator(pairA, pairB);
			assert.isArray(generatedRows, "Expected return from 'generator' parameter to 'Series.fillGaps' to be an array of pairs, instead got a " + typeof(generatedRows));

			return [pairA].concat(generatedRows);
		})
		.appendPair(self.lastPair())
		;
};

//todo: Test me. move to another file.
var ArrayIterable = function (arr) {
	
	assert.isArray(arr);

	var self = this;

	self.getIndexIterator = function () {
		return new CountIterator();
	};

	self.getValuesIterator = function () {
		return new ArrayIterator(arr);
	};
};

var PairsIterable = function (arr) {
	
	assert.isArray(arr);

	var self = this;

	self.getIndexIterator = function () {
		return new SelectIterator(
			new ArrayIterator(arr),
			function (pair) {
				return pair[0];
			}
		);
	};

	self.getValuesIterator = function () {
		return new SelectIterator(
			new ArrayIterator(arr),
			function (pair) {
				return pair[1];
			}
		);
	};
};

/**
 * Group the series according to the selector.
 *
 * @param {function} selector - Selector that defines the value to group by.
 */
Series.prototype.groupBy = function (selector) {

	assert.isFunction(selector, "Expected 'selector' parameter to 'Series.groupBy' to be a selector function that determines the value to group the series by.")
	
	var self = this;
	var groupedPairs = E.from(self.toPairs())
		.groupBy(function (pair) {
			return selector(pair[1], pair[0]);
		})
		.select(function (group) {
			return [
				group.key(),
				new Series({
					iterable: function () {
						return new ArrayIterator(group.getSource());
					},
				}),
			];
		})
		.toArray();

	return new Series({
		__iterable: new PairsIterable(groupedPairs),
	});
};

/**
 * Group sequential duplicate values into a Series of windows.
 *
 * @param {function} selector - Selector that defines the value to group by.
 */
Series.prototype.groupSequentialBy = function (selector) {

	if (selector) {
		assert.isFunction(selector, "Expected 'selector' parameter to 'Series.groupSequentialBy' to be a selector function that determines the value to group the series by.")
	}
	else {
		selector = function (value) {
			return value;
		};
	}
	
	var self = this;

	return self.variableWindow(function (a, b) {
			return selector(a) === selector(b);
		});
};

/**
 * Get the value at a specified index.
 *
 * @param {function} index - Index to for which to retreive the value.
 */
Series.prototype.at = function (index) {

	var self = this;
	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		return undefined;
	}

	//
	// This is pretty expensive.
	// A specialised index could improve this.
	//

	do {

		var curPair = iterator.getCurrent();
		if (curPair[0] === index) {
			return curPair[1];
		}

	} while (iterator.moveNext());

	return undefined;
};

/**
 * Returns true if the Series contains the specified value.
 *
 * @param {function} value - The value to check for in the Series.
 */
Series.prototype.contains = function (value) {

	var self = this;
	return self.any(function (searchValue) {
			return searchValue === value;
		});
};

/**
 * Concatenate multiple other series onto this series.
 * 
 * @param {array|Series*} series - Multiple arguments. Each can be either a series or an array of series. 
 */
Series.prototype.concat = function () {

	var self = this;
	return concatSeries(
		[self].concat(
			E.from(arguments)
				.selectMany(function (argument) {
					if (Object.isArray(argument)) {
						return argument;
					}
					else {
						return [argument];
					}
				})
				.toArray()
		)			
	);
};

/**
 * Correlates the elements of two Series or DataFrames based on matching keys.
 *
 * @param {Series|DataFrame} self - The outer Series or DataFrame to join. 
 * @param {Series|DataFrame} inner - The inner Series or DataFrame to join.
 * @param {function} outerKeySelector - Selector that chooses the join key from the outer sequence.
 * @param {function} innerKeySelector - Selector that chooses the join key from the inner sequence.
 * @param {function} resultSelector - Selector that defines how to merge outer and inner values. 
 */
Series.prototype.join = function (inner, outerKeySelector, innerKeySelector, resultSelector) {

	assert.instanceOf(inner, Series, "Expected 'inner' parameter of 'Series.join' to be a Series or DataFrame.");
	assert.isFunction(outerKeySelector, "Expected 'outerKeySelector' parameter of 'Series.join' to be a selector function.");
	assert.isFunction(innerKeySelector, "Expected 'innerKeySelector' parameter of 'Series.join' to be a selector function.");
	assert.isFunction(resultSelector, "Expected 'resultSelector' parameter of 'Series.join' to be a selector function.");

	var outer = this;
	var joined = E.from(outer.toPairs())
		.join(
			inner.toPairs(),
			function (outerPair) {
				return outerKeySelector(outerPair[1], outerPair[0]);
			},
			function (innerPair) {
				return innerKeySelector(innerPair[1], innerPair[0]);
			},
			function (outerPair, innerPair) {
				return resultSelector(outerPair[1], innerPair[1]);
			}
		)
		.toArray();

	return new DataFrame({
		values: joined,
	});
};

/**
 * Performs an outer join on two Series or DataFrames. Correlates the elements based on matching keys.
 * Includes elements that have no correlation.
 *
 * @param {Series|DataFrame} self - The outer Series or DataFrame to join. 
 * @param {Series|DataFrame} inner - The inner Series or DataFrame to join.
 * @param {function} outerKeySelector - Selector that chooses the join key from the outer sequence.
 * @param {function} innerKeySelector - Selector that chooses the join key from the inner sequence.
 * @param {function} outerResultSelector - Selector that defines how to extract the outer value before joining it with the inner value. 
 * @param {function} innerResultSelector - Selector that defines how to extract the inner value before joining it with the outer value.
 * @param {function} mergeSelector - Selector that defines how to combine left and right.
 * 
 * Implementation from here:
 * 
 * 	http://blogs.geniuscode.net/RyanDHatch/?p=116
 */
Series.prototype.joinOuter = function (rightSeries, outerKeySelector, innerKeySelector, resultSelector) {

	assert.instanceOf(rightSeries, Series, "Expected 'rightSeries' parameter of 'Series.joinOuter' to be a Series.");
	assert.isFunction(outerKeySelector, "Expected 'outerKeySelector' parameter of 'Series.joinOuter' to be a selector function.");
	assert.isFunction(innerKeySelector, "Expected 'innerKeySelector' parameter of 'Series.joinOuter' to be a selector function.");
	assert.isFunction(resultSelector, "Expected 'resultSelector' parameter of 'Series.joinOuter' to be a selector function.");

	var self = this;

	var leftOuter = self.except(rightSeries, function (outer, inner) {
			return outerKeySelector(outer) === innerKeySelector(inner);
		})
		.select(function (outer) { 
			return resultSelector(outer, null);
		})
		;

	var rightOuter = rightSeries.except(self, function (inner, outer) {
			return outerKeySelector(outer) === innerKeySelector(inner);
		})
		.select(function (inner) {
			return resultSelector(null, inner);
		})
		;

	var inner = self.join(rightSeries, outerKeySelector, innerKeySelector, resultSelector);

	return leftOuter
		.concat(inner)
		.concat(rightOuter)
		.resetIndex()
		;
};

/**
 * Performs a left outer join on two Series or DataFrames. Correlates the elements based on matching keys.
 * Includes left elements that have no correlation.
 *
 * @param {Series|DataFrame} self - The outer Series or DataFrame to join. 
 * @param {Series|DataFrame} inner - The inner Series or DataFrame to join.
 * @param {function} outerKeySelector - Selector that chooses the join key from the outer sequence.
 * @param {function} innerKeySelector - Selector that chooses the join key from the inner sequence.
 * @param {function} outerResultSelector - Selector that defines how to extract the outer value before joining it with the inner value. 
 * @param {function} innerResultSelector - Selector that defines how to extract the inner value before joining it with the outer value.
 * @param {function} mergeSelector - Selector that defines how to combine left and right.
 * 
 * Implementation from here:
 * 
 * 	http://blogs.geniuscode.net/RyanDHatch/?p=116
 */
Series.prototype.joinOuterLeft = function (rightSeries, outerKeySelector, innerKeySelector, resultSelector) {

	assert.instanceOf(rightSeries, Series, "Expected 'rightSeries' parameter of 'Series.joinOuterLeft' to be a Series.");
	assert.isFunction(outerKeySelector, "Expected 'outerKeySelector' parameter of 'Series.joinOuterLeft' to be a selector function.");
	assert.isFunction(innerKeySelector, "Expected 'innerKeySelector' parameter of 'Series.joinOuterLeft' to be a selector function.");
	assert.isFunction(resultSelector, "Expected 'resultSelector' parameter of 'Series.joinOuterLeft' to be a selector function.");

	var self = this;

	var leftOuter = self.except(rightSeries, function (outer, inner) {
			return outerKeySelector(outer) === innerKeySelector(inner);
		})
		.select(function (outer) { 
			return resultSelector(outer, null);
		})
		;

	var inner = self.join(rightSeries, outerKeySelector, innerKeySelector, resultSelector);

	return leftOuter
		.concat(inner)
		.resetIndex()
		;
};

/**
 * Performs a right outer join on two Series or DataFrames. Correlates the elements based on matching keys.
 * Includes right elements that have no correlation.
 *
 * @param {Series|DataFrame} self - The outer Series or DataFrame to join. 
 * @param {Series|DataFrame} inner - The inner Series or DataFrame to join.
 * @param {function} outerKeySelector - Selector that chooses the join key from the outer sequence.
 * @param {function} innerKeySelector - Selector that chooses the join key from the inner sequence.
 * @param {function} outerResultSelector - Selector that defines how to extract the outer value before joining it with the inner value. 
 * @param {function} innerResultSelector - Selector that defines how to extract the inner value before joining it with the outer value.
 * @param {function} mergeSelector - Selector that defines how to combine left and right.
 * 
 * Implementation from here:
 * 
 * 	http://blogs.geniuscode.net/RyanDHatch/?p=116
 */
Series.prototype.joinOuterRight = function (rightSeries, outerKeySelector, innerKeySelector, resultSelector) {

	assert.instanceOf(rightSeries, Series, "Expected 'rightSeries' parameter of 'Series.joinOuterRight' to be a Series.");
	assert.isFunction(outerKeySelector, "Expected 'outerKeySelector' parameter of 'Series.joinOuterRight' to be a selector function.");
	assert.isFunction(innerKeySelector, "Expected 'innerKeySelector' parameter of 'Series.joinOuterRight' to be a selector function.");
	assert.isFunction(resultSelector, "Expected 'resultSelector' parameter of 'Series.joinOuterRight' to be a selector function.");

	var self = this;

	var rightOuter = rightSeries.except(self, function (inner, outer) {
			return outerKeySelector(outer) === innerKeySelector(inner);
		})
		.select(function (inner) {
			return resultSelector(null, inner);
		})
		;

	var inner = self.join(rightSeries, outerKeySelector, innerKeySelector, resultSelector);

	return inner
		.concat(rightOuter)
		.resetIndex()
		;
};

/**
 * Returns the specified default sequence if the Series or DataFrame is empty. 
 *
 * @param {array|Series|DataFrame} defaultSequence - Default sequence to return if the Series or DataFrame is empty.
 */
Series.prototype.defaultIfEmpty = function (defaultSequence) {

	if (!Object.isArray(defaultSequence)) {
		assert.instanceOf(defaultSequence, Series, "Expect 'defaultSequence' parameter to 'Series.defaultIfEmpty' to be an array, Series or DataFrame.");
	}

	var self = this;
	if (self.none()) {
		if (defaultSequence instanceof Series) {
			return defaultSequence;
		}
		else {
			return new self.Constructor({
				values: defaultSequence,
			});
		}
	} 
	else {
		return self;
	}
};

/**
 * Returns the unique union of values between two Series or DataFrames.
 *
 * @param {Series|DataFrame} other - The other Series or DataFrame to combine.
 * @param {function} [comparer] - Optional comparer that selects the value to compare.  
 */
Series.prototype.union = function (other, selector) {

	assert.instanceOf(other, Series, "Expected 'other' parameter to 'Series.union' to be a Series or DataFrame.");

	if (selector) {
		assert.isFunction(selector, "Expected optional 'selector' parameter to 'Series.union' to be a selector function.");
	}

	var self = this;
	return self.concat(other)
		.distinct(selector)
		;
};

/**
 * Returns the intersection of values between two Series or DataFrames.
 *
 * @param {Series|DataFrame} other - The other Series or DataFrame to combine.
 * @param {function} [comparer] - Optional comparer that selects the value to compare.  
 */
Series.prototype.intersection = function (other, comparer) {

	assert.instanceOf(other, Series, "Expected 'other' parameter to 'Series.intersection' to be a Series or DataFrame.");

	if (comparer) {
		assert.isFunction(comparer, "Expected optional 'comparer' parameter to 'Series.intersection' to be a comparer function.");
	}
	else {
		comparer = function (left, right) {
			return left === right;
		};
	}

	var self = this;
	return self
		.where(function (left) {
			return other
				.where(function (right) {
					return comparer(left, right);
				})
				.any();
		})
		;
};

/**
 * Returns the exception of values between two Series or DataFrames.
 *
 * @param {Series|DataFrame} other - The other Series or DataFrame to combine.
 * @param {function} [comparer] - Optional comparer that selects the value to compare.  
 */
Series.prototype.except = function (other, comparer) {

	assert.instanceOf(other, Series, "Expected 'other' parameter to 'Series.except' to be a Series or DataFrame.");

	if (comparer) {
		assert.isFunction(comparer, "Expected optional 'comparer' parameter to 'Series.except' to be a comparer function.");
	}
	else {
		comparer = function (left, right) {
			return left === right;
		};
	}

	var self = this;
	return self
		.where(function (left) {
			return other
				.where(function (right) {
					return comparer(left, right);
				})
				.none();
		})
		;
};