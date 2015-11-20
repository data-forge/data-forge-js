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
		// Write DataFrame to csv text data.
		//
		to: function (dataFrame) {

			throw new Error("Not implemented");
		},	
	};
};