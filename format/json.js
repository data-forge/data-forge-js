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

			return new dataForge.DataFrame({
					rows: JSON.parse(inputJsonData)
				});
		},
		
		//
		// Write DataFrame to JSON text data.
		//
		to: function (dataFrame) {

			assert.isObject(dataFrame, "Expected 'dataFrame' parameter to 'json.to' to be a data frame object.");

			return JSON.stringify(dataFrame.toObjects(), null, 4);
		},	
	};
};