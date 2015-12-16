'use strict';

//
// Implements input/output for Javascript objects.
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
		// Load a DataFrame from Javascript objects.
		//
		from: function (jsData) {

			assert.isArray(jsData, "Expected 'jsData' parameter to 'js.from' to be an array of Javascript objects.");	

			var headers = E.from(jsData)
				.selectMany(function (obj) {
					return Object.keys(obj);
				})
				.distinct()
				.toArray();

			var rows = E.from(jsData)
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
		// Write DataFrame to json objects.
		//
		to: function (dataFrame) {

			assert.isObject(dataFrame, "Expected 'dataFrame' parameter to 'json.to' to be a data frame object.");

			var columnNames = dataFrame.getColumnNames();

			return E.from(dataFrame.getValues())
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
				.toArray();
		},	
	};
};