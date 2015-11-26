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
	if (!options.parse_dates) {
		options.parse_dates = [];		
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
		
	var parseDates = E
		.from(columnNames)
		.select(function (columnName) {
			return options.parse_dates.indexOf(columnName) >= 0;
		})	
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
		.select(function (row) { // Parse requested dates.
			var out = [];
			for (var i = 0; i < row.length; ++i) {
				if (parseDates[i]) {
					out.push(moment(row[i]).toDate());	
				}
				else {
					out.push(row[i]);
				}						
			} 			
			return out;			
		})
		.toArray();	
		
	return new DataFrame(columnNames, values); 
};