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
// Load share prices and filter for a particular company.
// 
var loadSharePricesForCompany = function (companyCode, filePath) {
	assert.isString(companyCode);
	assert.isString(filePath);

	companyCode = companyCode.toUpperCase();

	loadSharePricesFile(filePath)
		.where(function (row) {
			return row.code.toUpperCase() === companyCode;
		});
};

//
// Save data frame to a CSV file.
//
var saveSharePricesFile = function (dataFrame, filePath) {
	assert.isObject(dataFrame);
	assert.isString(filePath);

	fs.writeFileSync(filePath, dataFrame.toCSV());
};

dataFrame = loadSharePricesForCompany('ABC', 'share_prices.csv')
saveSharePricesFile(dataFrame, 'output.csv');
