'use strict';

var panjas = require("../../index.js");
var csv = require('../../format/csv');
var file = require('../../source/file');

var glob = require('glob');
var E = require('linq');
var assert = require('chai').assert;

//
// Load as single CSV file containing share prices.
//
var loadSharePricesFile = function (filePath) {
	assert.isString(filePath);
	
	return panjas.from(file(filePath)).as(csv());
};

//
// Load a directory full of files containing share prices.
// 
var loadSharePrices = function () {
	var filePaths = glob.sync("./data/prices/*");
	var loadFilePromises = E.from(filePaths).select(loadSharePricesFile).toArray();
	return Promise.all(loadFilePromises)
		.then(function (dataFrames) {
			// Concatenate all data frames.
			return E.from(dataFrames)
				.aggregrate(function (previous, next) {
					return previous.concat(next);
				});
		});
};

//
// Save data frame to a CSV file.
//
var saveSharePricesFile = function (dataFrame, filePath) {
	assert.isObject(dataFrame);
	assert.isString(filePath);

	return dataFrame.as(csv()).to(file(filePath));
};

loadSharePrices()
	.then(function (dataFrame) {
		return saveSharePricesFile(dataFrame, 'output.csv');
	})
	.catch(function (err) {
		console.error(err.stack);
	});