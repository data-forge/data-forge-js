'use strict';

//
// Builds a DataFrame from raw data.
// Input data is an array of arrays... including header and index.
//

var DataFrame = require('./dataframe');
var NumberIndex = require('./numberindex');
var DateIndex = require('./dateindex');

var E = require('linq');
var moment = require('moment');
require('sugar');

//
// http://pietschsoft.com/post/2008/01/14/javascript-inttryparse-equivalent
//
function tryParseInt(str, defaultValue) {
     var retValue = defaultValue;
     if(str !== null) {
         if(str.length > 0) {
             if (!isNaN(str)) {
                 retValue = parseInt(str);
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
					var val = tryParseInt(col, null);
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
		
		var index = null;
		
		if (options.index_col) {
			var indexColIndex = columnNames.indexOf(options.index_col);
			if (indexColIndex < 0) {
				//todo: test error condition.
				throw new Error("Index column '" + options.index_col + "' doesn't exist in columns: " + columnNames.join(', '));
			}

			// Extract index column from data.
			var indexValues = E
				.from(values)
				.select(function (row) {
					return row[indexColIndex];
				})
				.toArray()
			
			if (Object.isDate(indexValues[0])) {
				index = new DateIndex(indexValues);
			}
			else if (Object.isNumber(indexValues[0])) {
				index = new NumberIndex(indexValues);
			}
			else {
				//todo: throw excetpoin.
			}
			
			// Remove the index column from the column names.
			columnNames = E
				.from(columnNames)
				.take(indexColIndex)
				.concat(
					E.from(columnNames).skip(indexColIndex+1)
				)
				.toArray();
			
			// Remove the index column from the values.
			values = E.from(values)
				.select(function (row) {
					return E
						.from(row)
						.take(indexColIndex)
						.concat(
							E.from(row).skip(indexColIndex+1)
						)
						.toArray();
				}) 
				.toArray();					 
		}
		else {
			//todo: this could be a LazyNumberIndex based on a range.
			index = new NumberIndex(E.range(0, values.length).toArray());
		}
		
		return new DataFrame(columnNames, index, values); 
};