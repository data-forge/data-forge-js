'use strict';

//
// Implements input/output for the CSV format.
//

var panjas = require('../index');

var fs = require('fs');
var E = require('linq');
var moment = require('moment');
var assert = require('chai').assert;
var Q = require('q');

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

module.exports = {
	
	//
	// Load DataFrame from a csv file.
	//
	from: function (filePath, options) {
		assert.isString(filePath, "Expected 'filePath' parameter to 'from.csv' to be a string.");
		
		if (!options) {
			options = {};
		}
		if (!options.parse_dates) {
			options.parse_dates = [];			
		}
		
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
							.select(function (col) {
								return col.trim();
							})
							.toArray();					
					})
					.toArray();
				
				var columnNames = rows[0];
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
					
					index = new panjas.DateIndex( //todo: DateIndex shoud be optional!
						E
							.from(values)
							.select(function (row) {
								return row[indexColIndex];
							})
							.toArray()
					);
					
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
					index = new panjas.NumberIndex(E.range(0, values.length).toArray());
				}
				
				var dataFrame = new panjas.DataFrame(columnNames, index, values);
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