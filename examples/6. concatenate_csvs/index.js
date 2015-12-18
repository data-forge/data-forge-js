'use strict';

var dataForge = require("../../index.js");
var fs = require('fs');
var glob = require('glob');
var E = require('linq');

//
// Load as single CSV file containing share prices.
//
var loadSharePricesFile = function (filePath) {
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

var dataFrame = loadSharePrices();
fs.writeFileSync('output.csv', dataFrame.toCSV());