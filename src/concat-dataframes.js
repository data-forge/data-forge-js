'use strict';

var assert = require('chai').assert;
var E = require('linq');
var DataFrame = require('./dataframe');
var MultiIterator = require('./iterators/multi');
var ConcatIterator = require('./iterators/concat');
var SelectIterator = require('./iterators/select');
var extend = require('extend');

/**
 * Concatenate multiple dataframes into a single dataframe.
 *
 * @param {array} dataFrames - Array of data frames to concatenate.
 */
module.exports = function (dataFrames, options) {
	assert.isArray(dataFrames, "Expected 'dataFrames' parameter to 'dataForge.concat' to be an array of data frames.");

	if (options) {
		assert.isObject(options, "Expected 'options' parameter to 'dataForge.concat' to be an object with config options.");
	}

	if (options && options.axis === 1) {
		return new DataFrame({
			values: function () {
				var iterators = E.from(dataFrames)
					.select(function (dataFrame) {
						return dataFrame.getValuesIterator();
					})						
					.toArray()
				return new SelectIterator(
					new MultiIterator(iterators),
					function (multi) {
						var result = E.from(multi)
							.aggregate({}, function (prev, toIntegrate) {
								return extend(prev, toIntegrate);
							})
							;		
						return result;			
					}
				);
			},
		});
	}
	else {
		var concatenatedColumnsNames = E.from(dataFrames)
			.selectMany(function (dataFrame) {
				return dataFrame.getColumnNames();
			})
			.distinct()
			.toArray();

		return new DataFrame({
			columnNames: concatenatedColumnsNames,
			iterable: function () {
				var iterators = E.from(dataFrames)
					.select(function (dataFrame) {
						return dataFrame.remapColumns(concatenatedColumnsNames);
					})
					.select(function (dataFrame) {
						return dataFrame.getIterator();
					})						
					.toArray()
				return new ConcatIterator(iterators);
			},
		});
	}
};
