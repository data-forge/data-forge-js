'use strict';

var assert = require('chai').assert;
var E = require('linq');
var DataFrame = require('./dataframe');
var ConcatIterator = require('./iterators/concat');

/**
 * Concatenate multiple data frames into a single.
 *
 * @param {array} dataFrames - Array of data frames to concatenate.
 */
module.exports = function (dataFrames) {
	assert.isArray(dataFrames, "Expected 'dataFrames' parameter to 'dataForge.concat' to be an array of data frames.");

	var concatenateColumns = function () {
		return E.from(dataFrames)
			.selectMany(function (dataFrame) {
				return dataFrame.getColumnNames();
			})
			.distinct()
			.toArray();
	};

	return new DataFrame({
		columnNames: concatenateColumns(),
		iterable: function () {
			var concatenatedColumns = concatenateColumns();
			var iterators = E.from(dataFrames)
				.select(function (dataFrame) {
					return dataFrame.remapColumns(concatenatedColumns);
				})
				.select(function (dataFrame) {
					return dataFrame.getIterator();
				})						
				.toArray()
			return new ConcatIterator(iterators);
		},
	});
};
