'use strict';

var fs = require('fs');
var dataForge = require("../../index.js");
var moment = require('moment');
var E = require('linq');

//
// Summarise dividends by year.
//
var summarizeDividends = function (dataFrame) {

	var grouped = dataFrame
		.groupBy(function (row) {
			return moment(row['Ex Date'], 'dd-mmm-YYYY').toDate().getYear(); // Group by year.
		})
		.select(function (dividendsByYear) {
			return dividendsByYear
				.aggregate(function (prev, dividend) {
					return {
						year: dividendsByYear.key,
						amount: prev.amount + dividend.amount
					};
				});
		});
};

var dataFrame = dataForge.fromCSV(fs.readFileSync('dividends.csv', 'utf8'));
var summary = summarizeDividends(dataFrame);
fs.writeFileSync('output.csv', summary.toCSV());