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
// Load a directory full of files containing share prices.
// 
var loadSharePrices = function () {
	var filePaths = glob.sync("./data/prices/*");
	var loaded = E.from(filePaths).select(loadSharePricesFile).toArray();
	return dataForge.concat(loaded);
};

//
// Save data frame to a CSV file.
//
var saveSharePricesFile = function (dataFrame, filePath) {
	assert.isObject(dataFrame);
	assert.isString(filePath);

	fs.writeFileSync(filePath, dataFrame.toCSV());
};

var dataFrame = loadSharePrices();
saveSharePricesFile(dataFrame, 'output.csv');
