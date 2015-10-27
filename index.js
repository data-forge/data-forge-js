'use strict';

var Series = require('./series');
var DataFrame = require('./dataframe');
var DateIndex = require('./dateindex');

var fs = require('fs');
var E = require('linq');
var moment = require('moment');
var assert = require('chai').assert;

module.exports = {
	
	//
	// Read a DataFrame from a csv file.
	//
	from: {
		csv: function (filePath) {
			assert.isString(filePath, "Expected 'filePath' parameter to 'from.csv' to be a string.");
			
			var csvData = fs.readFileSync(filePath, 'utf-8');
			var lines = csvData.split('\n');
			var rows = E
				.from(lines)
				.select(function (line) {
					return E
						.from(line.split(','))
						.select(function (row) {
							return row.trim();
						})
						.toArray();					
				})
				.toArray();
			
			var columnNames = E
				.from(rows[0])
				.skip(1)
				.toArray();
			var index = E
				.from(rows)
				.skip(1)
				.select(function (row) {
					return moment(row[0]).toDate(); //todo: this should be selectable based on column name!
				})
				.toArray();
			var values = E 
				.from(rows)
				.skip(1)
				.select(function (row) {
					return E
						.from(row)
						.skip(1)
						.toArray();
				})
				.toArray();
	
			return new DataFrame(columnNames, new DateIndex(index), values);
		},
	},
};