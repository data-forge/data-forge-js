'use strict';

//
// Implements input/output for the JSON format.
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
		// Load a DataFrame from JSON text data.
		//
		from: function (inputJsonData) {

			assert.isString(inputJsonData, "Expected 'inputJsonData' parameter to 'json.from' to be a string containing JSON data.");	

			var jsonData = JSON.parse(inputJsonData);

			var headers = E.from(jsonData)
				.selectMany(function (obj) {
					return Object.keys(obj);
				})
				.distinct()
				.toArray();

			var rows = E.from(jsonData)
				.select(function (obj) {
					return E.from(headers)
						.select(function (header) {
							return obj[header];
						})
						.toArray();
				})
				.toArray();

			return new dataForge.DataFrame({
					columnNames: headers, 
					rows: rows
				});
		},
		
		//
		// Write DataFrame to JSON text data.
		//
		to: function (dataFrame) {

			assert.isObject(dataFrame, "Expected 'dataFrame' parameter to 'json.to' to be a data frame object.");

			var columnNames = dataFrame.getColumnNames();

			return JSON.stringify(E.from(dataFrame.getValues())
				.select(function (row) {
					return E.from(columnNames)
						.select(function (columnName, columnIndex) {
							return [columnName, columnIndex];
						})
						.toObject(
							function (column) {
								var columnName = column[0];
								return columnName;
							},
							function (column) {
								var columnIndex = column[1];
								return row[columnIndex];
							}
						);
				})
				.toArray(), null, 4);
		},	
	};
};