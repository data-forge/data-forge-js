'use strict';

//
// Builds a DataFrame from raw data.
// Input data is an array of arrays... including header and index.
//

var DataFrame = require('./dataframe');

var E = require('linq');
var moment = require('moment');
require('sugar');

//
// http://pietschsoft.com/post/2008/01/14/javascript-inttryparse-equivalent
//
function tryParseFloat(str, defaultValue) {
     var retValue = defaultValue;
     if (str) {
         if(str.length > 0) {
             if (!isNaN(str)) {
                 retValue = parseFloat(str);
             }
         }
     }
     return retValue;
}

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
				.select(function (col) { // Auto-parse numbers.
					var val = tryParseFloat(col, null);
					if (val == null) {
						return col;
					}
					else {
						return val;
					}					
				})
				.toArray();					
		})
		.toArray();	
		
	return new DataFrame(columnNames, values); 
};