'use strict';

//
// Builds a DataFrame from raw data.
// Input data is an array of arrays... including header and index.
//

var DataFrame = require('./dataframe');
var NumberIndex = require('./numberindex');

var E = require('linq');

module.exports = function (rows, options) {
	
	var columnNames = rows[0];
	var values = E 
		.from(rows)
		.skip(1) // Skip header.
		.toArray();	
	var index = new NumberIndex(E.range(0, values.length).toArray());
	return new DataFrame(columnNames, index, values); 
};