'use strict';

var dataForge = require("../../index.js");
var fs = require('fs');
var E = require('linq');

//
// Create a new data frame containing a simple moving average of the share price.
//
var computeSimpleMovingAverage = function (dataFrame, period) {

	var movingAvg = dataFrame.getSeries('Close')
		.rollingWindow(period, 
			function (window) {
				return [window.getIndex().last(), window.average()];
			}
		);

	// Create a new data frame with the new column, doesn't modify original data frame.
	//console.log(movingAvg.getIndex().toValues());
	return dataFrame.setSeries('SMA', movingAvg);
};

var dataFrame = dataForge
		.fromCSV(fs.readFileSync('share_prices.csv', 'utf8'))
		.parseFloats('Close');
var withMovingAvg = computeSimpleMovingAverage(dataFrame, 30); // 30 day moving average.
fs.writeFileSync('output.csv', withMovingAvg.toCSV());