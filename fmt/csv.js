'use strict';

//
// Implements input/output for the CSV format.
//

var panjas = require('../index');

var E = require('linq');
var assert = require('chai').assert;

module.exports = function (options) {

	if (!options) {
		options = {};
	}
	if (!options.parse_dates) {
		options.parse_dates = [];			
	}

	return {

		//
		// Load a DataFrame from CSV text data.
		//
		from: function (csvData) {
			assert.isString(csvData, "Expected 'csvData' parameter to 'csv.from' to be a string.");
			
			var lines = csvData.split('\n');
			var rows = E
				.from(lines) // Ignore blank lines.
				.where(function (line) {
					return line.trim().length > 0;
				})
				.select(function (line) {
					return E
						.from(line.split(','))
						.select(function (col) {
							return col.trim();
						})
						.select(function (col) {
							if (col.length === 0) {
								return undefined;
							}
							else {
								return col;
							}
						})
						.toArray();					
				})
				.toArray();
					
			return panjas.builder(rows, options);
		},
		
		//
		// Write DataFrame to csv text data.
		//
		to: function (dataFrame) {
			
			var header = dataFrame.getColumnNames().join(',');
			var rows = E.from(dataFrame.getValues())
					.select(function (row) {
						return row.join(',');
					})
					.toArray();
			return [header].concat(rows).join('\r\n');	
		},	
	};
};