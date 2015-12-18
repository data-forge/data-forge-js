'use strict';

var dataForge = require("../../index.js");
var fs = require('fs');

var glob = require('glob');
var E = require('linq');
var assert = require('chai').assert;

//
// Load as single CSV file containing share prices.
//
var loadSharePricesFile = function (filePath) {
	assert.isString(filePath);

	return dataForge.fromCSV(fs.readFileSync(filePath, 'utf8'));
};

//
// Save data frame to a CSV file.
//
var saveSharePricesFile = function (dataFrame, filePath) {
	assert.isObject(dataFrame);
	assert.isString(filePath);

	fs.writeFileSync(filePath, dataFrame.toCSV());
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

var dataFrame = loadSharePricesFile('share_prices.csv');
var withMovingAvg = computeSimpleMovingAverage(dataFrame, 30); // 30 day moving average.
saveSharePricesFile(withMovingAvg, 'output.csv');
