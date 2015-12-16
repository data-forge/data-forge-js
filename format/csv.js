'use strict';

//
// Implements input/output for the CSV format.
//

var dataForge = require('../index');

var E = require('linq');
var assert = require('chai').assert;

module.exports = function (options) {

	if (!options) {
		options = {};
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

			if (rows.length === 0) {
				return new dataForge.DataFrame({ columnNames: [], rows: [] });
			}
					
			var header = E.from(rows).first();
			var remaining = E.from(rows).skip(1).toArray();
			return new dataForge.DataFrame({
					columnNames: header, 
					rows: remaining
				});
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
					.select(function (col) { // Strip newlines... these don't work in CSV files.
						if (Object.isString(col)) { //todo: not necessar if all columns are converted to strings.
							return col.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
						}
						else {
							return col;
						}
					})					
					.toArray();
			return [header].concat(rows).join('\r\n');	
		},	
	};
};