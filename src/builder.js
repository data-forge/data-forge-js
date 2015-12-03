'use strict';

//
// Builds a DataFrame from raw data.
// Input data is an array of arrays... including header and index.
//

var DataFrame = require('./dataframe');
var E = require('linq');

module.exports = function (rows, options) {
	
	if (!options) {
		options = {};
	}

	if (rows.length == 0) {
		// Handle empty set of rows.
		return new DataFrame([], []);
	}
	
	var columnNames = rows[0];
	var values = E 
		.from(rows)
		.skip(1) // Skip header.
		.toArray();	
		
	var values = E 
		.from(rows)
		.skip(1) // Skip header.
		.select(function (row) {
			return E
				.from(row)
				.toArray();					
		})
		.toArray();	
		
	return new DataFrame(columnNames, values); 
};