'use strict';

var panjas = require("../../index.js");
var csv = require('../../fmt/csv');
var file = require('../../datasource/file');

var glob = require('glob');
var E = require('linq');
var assert = require('chai').assert;

//
// Load as single CSV file containing share prices.
//
var loadSharePricesFile = function (filePath) {
	assert.isString(filePath);
	
	return panjas.from(file, filePath).as(csv);
};

//
// Save data frame to a CSV file.
//
var saveSharePricesFile = function (dataFrame, filePath) {
	assert.isObject(dataFrame);
	assert.isString(filePath);

	return dataFrame.as(csv).to(file, filePath);
};

//
// Create a new data frame containing a simple moving average of the share price.
//
var computeSimpleMovingAverage = function (dataFrame, period) {
	assert.isObject(dataFrame);

	var movingAvgColumn = dataFrame
		.getColumn('Close')
		.rollingWindow(period, 
			function (values) {
				return E.from(values).sum() / values.length;
			}
		);

	// Create a new data frame with the new column, doesn't modify original data frame.
	return dataFrame.setColumn('SMA', movingAvgColumn);
};

loadSharePricesFile('share_prices.csv')
	.then(function (dataFrame) {
		return computeSimpleMovingAverage(dataFrame, 30); // 30 day moving average.
	})
	.then(function (dataFrame) {
		return saveSharePricesFile(dataFrame, 'output.csv');
	})
	.catch(function (err) {
		console.error(err.stack);
	});
