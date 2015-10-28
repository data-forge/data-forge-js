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
				
				resolve(panjas.builder(rows, options));
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