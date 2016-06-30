'use strict';

var assert = require('chai').assert;
var E = require('linq');
var Series = require('./series.js');

/**
 * Merge multiple series into a new DataFrame.
 * 
 * @param {array} columnNames - Array of strings that defines the column names for the resulting DataFrame. Must have the same number of elements as the 'series' parameter.
 * @param {array} series - Array of series that defined the values for the columns. Must have the same number of elements as the 'columnNames' parameter.
 */
module.exports = function (columnNames, series) {
	assert.isArray(columnNames, "Expected 'columnNames' parameter of dataForge.mergeSeries to be an array of strings that specify column names in the resulting DataFrame.");
	assert.isArray(series, "Expected 'series' parameter of dataForge.mergeSeries to be an array of Series objects that specify the values for the columns in the resulting DataFrame.");

	columnNames.forEach(function (columnName) {
		//todo: specify bad index.
		assert.isString(columnName, "Expected 'columnNames' parameter of dataForge.mergeSeries to be an array of strings that specify column names in the resulting DataFrame.");
	});

	series.forEach(function (series) {
		//todo: specify bad index.
		assert.instanceOf(series, Series, "Expected 'series' parameter of dataForge.mergeSeries to be an array of Series objects that specify the values for the columns in the resulting DataFrame.");
	});

	assert(columnNames.length === series.length, "Expect 'columnNames' and 'series' parameters to dataForge.mergeSeries to be arrays with the same length. columnNames has length " + columnNames.length + ", series has length " + series.length);

	var distinctColumnNames = E.from(columnNames).distinct().toArray();
	assert(distinctColumnNames.length === columnNames.length, "Only distinct column names are allowed, please remove duplicates from: " + columnNames.join(', ') + ".");

	return E.from(columnNames)
		.zip(series, function (columnName, series) {
			return series.inflate(function (value) {
				var output = {};
				output[columnName] = value;
				return output;
			});
		})
		.aggregate(function (mergedDataFrame, toMerge) { //todo: just call the function that will merge multiple DFs
			return mergedDataFrame.merge(toMerge);
		});
};