'use strict';

//
// Implements input/output for the CSV format.
//

var assert = require('chai').assert;

module.exports = function (textData) {

	return {

		//
		// Async read from a text file.
		//	
		read: function () {
			assert.isString(textData, "Expected 'textData' parameter to 'text data source' to be a string.");

			return Promise.resolve(textData);
		},
		
		//
		// Async write to a text file.
		//
		write: function (fileData) {
			assert.isString(fileData, "Expected 'fileData' parameter to 'text.write' to be a string.");

			return Promise.resolve(fileData);
		},

		//
		// Sync read from a text file.
		//	
		readSync: function () {			
			assert.isString(textData, "Expected 'textData' parameter to 'text data source' to be a string.");

			return textData;
		},
		
		//
		// Sync write to a text file.
		//
		writeSync: function (fileData) {
			return fileData;
		},
	};
};
	
