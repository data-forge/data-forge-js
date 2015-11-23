'use strict';

//
// Implements input/output for the CSV format.
//

var panjas = require('../index');

var E = require('linq');
var assert = require('chai').assert;

module.exports = function (options) {

	if (!options) {
		options = {};
	}
	if (!options.parse_dates) {
		options.parse_dates = [];			
	}

	return {

		//
		// Load a DataFrame from CSV text data.
		//
		from: function (jsonData) {
			assert.isArray(jsonData, "Expected 'jsonData' parameter to 'json.from' to be an array of objects.");

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

			var all = [headers].concat(rows);
			return panjas.builder(all, options);			
		},
		
		//
		// Write DataFrame to json objects.
		//
		to: function (dataFrame) {

			assert.isObject(dataFrame, "Expected 'dataFrame' parameter to 'json.to' to be a data frame object.");

			return [dataFrame.getColumnNames()].concat(dataFrame.getValues());
		},	
	};
};