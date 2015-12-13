'use strict';

//
// Implements input/output for text files.
//

var fs = require('fs');
var assert = require('chai').assert;

module.exports = function (filePath) {
	assert.isString(filePath, "Expected 'filePath' parameter to 'file data source' to be a string.");

	return {

		//
		// Async read from a text file.
		//	
		read: function () {
			
			return new Promise(function (resolve, reject) {
				fs.readFile(filePath, 'utf-8', function (err, fileData) {
					if (err) {
						reject(err);
						return;
					}
					
					resolve(fileData);
				});		
			});
		},
		
		//
		// Async write to a text file.
		//
		write: function (fileData) {
			assert.isString(fileData, "Expected 'fileData' parameter to 'file.write' to be a string.");
			
			return new Promise(function (resolve, reject) {
				fs.writeFile(filePath, fileData, function (err) {
					if (err) {
						reject(err);
					}
					else {
						resolve();
					}
				});					
			});		
		},

		//
		// Sync read from a text file.
		//	
		readSync: function () {			
			return fs.readFileSync(filePath, 'utf-8');
		},
		
		//
		// Sync write to a text file.
		//
		writeSync: function (fileData) {
			fs.writeFileSync(filePath, fileData);
		},
	};
};
	
