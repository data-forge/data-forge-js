'use strict';

var fs = require('fs');
var dataForge = require("../../index.js");

//
// Summarise dividends by year.
//
var summarizeDividends = function (dataFrame) {

	return dataFrame
		.groupBy(function (row) {
			return row.exDate.getYear(); // Group by year.
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