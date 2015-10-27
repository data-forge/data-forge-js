'use strict';

//
// Implements input/output for the CSV format.
//

var DataFrame = require('../dataframe');
var DateIndex = require('../dateindex');

var fs = require('fs');
var E = require('linq');
var moment = require('moment');
var assert = require('chai').assert;
var Q = require('q');

module.exports = {
	
	//
	// Load DataFrame from a csv file.
	//
	from: function (filePath, options) {
		assert.isString(filePath, "Expected 'filePath' parameter to 'from.csv' to be a string.");
		
		return Q.Promise(function (resolve, reject) {
			fs.readFile(filePath, 'utf-8', function (err, csvData) {
				if (err) {
					reject(err);
					return;
				}
				
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
		
				var dataFrame = new DataFrame(columnNames, new DateIndex(index), values);
				resolve(dataFrame);
			});
		});	
	},
	
	//
	// Write DataFrame to a csv file.
	//
	to: function (dataFrame, filePath, options) {
		assert.isString(filePath, "Expected 'filePath' parameter to 'csv.to' to be a string.");
		
		return Q.Promise(function (resolve, reject) {
			var header = ['Index'].concat(dataFrame.columns()).join(',');
			var rows = E.from(dataFrame.index().values())
					.zip(dataFrame.values(), function (index, values) {
						return [index].concat(values);
					})
					.select(function (row) {
						return row.join(',');
					})
					.toArray();
			var data = [header].concat(rows).join('\n');	
			fs.writeFile(filePath, data, function (err) {
				if (err) {
					reject(err);
				}
				else {
					resolve();
				}
			});					
		});
		
	},	
};