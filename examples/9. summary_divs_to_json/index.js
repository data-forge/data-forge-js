'use strict';

var dataForge = require("../../index.js");
var csv = require('../../format/csv');
var file = require('../../source/file');

var glob = require('glob');
var E = require('linq');
var assert = require('chai').assert;
var fs = require('fs');

//
// Load single CSV containing dividends.
//
var loadFile = function (filePath) {
	assert.isString(filePath);
	
	return dataForge.from(file(filePath)).as(csv());
};

//
// Summarise dividends by year.
//
var summarizeDividends = function (dataFrame) {

	return dataFrame
		.groupBy(function (row) {
			return row.exDate.getYear(); // Group by year.
		})
		.toObject(
			// Key
			function (dividendsByYear) {
				return dividendsByYear.key;
			},
			// Value
			function (dividendsByYear) {
				return dividendsByYear
					.aggregate(0, function (prev, dividend) {
						return prev + dividend.amount;
					});
			}
		);
	});
};

//
// Save data frame to a CSV file.
//
var saveFile = function (dataFrame, filePath) {
	assert.isObject(dataFrame);
	assert.isString(filePath);

	return dataFrame.as(csv()).to(file(filePath));
};

loadFile('dividends.csv') // Open dividends for a single company.
	.then(summarizeDividends)
	.then(function (summary) {
		fs.writeFileSync('output.json', JSON.stringify(summary, null, 4));
	})
	.catch(function (err) {
		console.error(err.stack);
	});