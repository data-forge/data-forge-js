'use strict';

var panjas = require("../../index.js");
var csv = require('../../format/csv');
var file = require('../../source/file');

var glob = require('glob');
var E = require('linq');
var assert = require('chai').assert;

//
// Load single CSV containing share prices.
//
var loadFile = function (filePath) {
	assert.isString(filePath);
	
	return panjas.from(file(filePath)).as(csv());
};

//
// Load share prices and filter for a particular company.
// 
var loadSharePricesForCompany = function (companyCode, filePath) {
	assert.isString(companyCode);
	assert.isString(filePath);

	companyCode = companyCode.toUpperCase();

	return loadFile(filePath)
		.then(function (dataFrame) {
			assert.isObject(dataFrame);

			return dataFrame
				.where(function (row) {
					return row.code.toUpperCase() === companyCode;
				});
		})
};

//
// Save data frame to a CSV file.
//
var saveFile = function (dataFrame, filePath) {
	assert.isObject(dataFrame);
	assert.isString(filePath);

	return dataFrame.as(csv()).to(file(filePath));
};

loadSharePricesForCompany('ABC', 'share_prices.csv')
	.then(function (dataFrame) {
		return saveFile(dataFrame, 'output.csv');
	})
	.catch(function (err) {
		console.error(err.stack);
	});