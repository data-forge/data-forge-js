'use strict';

//
// Implements input/output for the CSV format.
//

var panjas = require('../index');

var E = require('linq');
var assert = require('chai').assert;

module.exports = {
	
	//
	// Load a DataFrame from CSV text data.
	//
	from: function (csvData, options) {
		assert.isString(csvData, "Expected 'csvData' parameter to 'csv.from' to be a string.");
		
		if (!options) {
			options = {};
		}
		if (!options.parse_dates) {
			options.parse_dates = [];			
		}
		
		var lines = csvData.split('\n');
		var rows = E
			.from(lines)
			.select(function (line) {
				return E
					.from(line.split(','))
					.select(function (col) {
						return col.trim();
					})
					.toArray();					
			})
			.toArray();
				
		return panjas.builder(rows, options);
	},
	
	//
	// Write DataFrame to csv text data.
	//
	to: function (dataFrame, csvOptions) {
		
		var header = ['Index'].concat(dataFrame.columnNames()).join(',');
		var rows = E.from(dataFrame.values())
				.select(function (row) {
					return row.join(',');
				})
				.toArray();
		return [header].concat(rows).join('\n');	
	},	
};