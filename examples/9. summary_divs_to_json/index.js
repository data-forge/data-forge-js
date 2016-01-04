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
};

var dataFrame = dataForge.fromCSV(fs.readFileSync('dividends.csv', 'utf8'));
var summary = summarizeDividends(dataFrame);
fs.writeFileSync('output.json', summary.toJSON());
