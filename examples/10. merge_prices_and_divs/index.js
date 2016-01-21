'use strict';

var dataForge = require("../../index.js");
var glob = require('glob');
var E = require('linq');
var fs = require('fs');

//
// Load as single CSV file containing share prices.
//
var loadSharePricesFile = function (filePath) {
	assert.isString(filePath);

	return dataForge.fromCSV(fs.readFileSync(filePath, 'utf8'));
};

//
// Load a directory full of files containing share prices.
// 
var loadSharePrices = function () {
	var filePaths = glob.sync("./prices/*");
	var loaded = E.from(filePaths).select(loadSharePricesFile).toArray();
	return dataForge.concat(loaded);
};

var prices = loadSharePrices();
var dividends = dataForge.fromCSV(fs.readFileSync('dividends.csv', 'utf8'));

var merged = dataForge
	.merge(sharePricesDataFrame, dividendsDataFrame, {
		left: "date",
		right: "ex date",
		how: 'inner',
	});

fs.writeFileSync('output.csv', merged.toCSV());