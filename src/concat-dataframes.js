'use strict';

var assert = require('chai').assert;
var E = require('linq');
var DataFrame = require('./dataframe');
var ConcatIterator = require('./iterators/concat');

/**
 * Concatenate multiple dataframes into a single dataframe.
 *
 * @param {array} dataFrames - Array of data frames to concatenate.
 */
module.exports = function (dataFrames) {
	assert.isArray(dataFrames, "Expected 'dataFrames' parameter to 'dataForge.concat' to be an array of data frames.");

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
};
