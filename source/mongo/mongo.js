'use strict';

//
// Implements mongodb data source.
//

module.exports = function (config) {

	var dataForge = require("../../index.js");

	var fs = require('fs');
	var assert = require('chai').assert;
	var E = require('linq');
	var pmongo = require('promised-mongo');

	var connectionString;
	var collection;
	var query;
	var fields;
	var sortParams;

	if (Object.isString(config)) {
		var connectionStringParts = config.split('/');
		assert(connectionStringParts.length === 3, "Expected 'config' parameter to 'mongo data source' to be a connection string composed of 3 parts or a config object. Connection string format: <host>/<db>/<collection-name>");

		connectionString = connectionStringParts[0] + '/' + connectionStringParts[1];
		collection = connectionStringParts[2];

		query = {};
		fields = {};
		sortParams = null;
	}
	else {
		assert.isObject(config, "Expected 'config' parameter to 'mongo data source' to be an object.");
		assert.isString(config.database, "Expected 'config.database' parameter to 'mongo data source' to be a string.");
		assert.isString(config.collection, "Expected 'config.collection' parameter to 'mongo data source' to be a string.");

		var host = config.host || 'localhost';
		connectionString = host + '/' + config.database;
		collection = config.collection;
		query = config.query || {};
		fields = config.fields || {};
		sortParams = config.sort || null;
	}

	return {

		//
		// Read from mongodb.
		//	
		read: function () {

			var db = pmongo(connectionString, [collection]);
			var cursor = db[collection].find(query, fields);
			
			if (sortParams) {
				cursor = cursor.sort(sortParams);
			}

			return cursor.toArray()
				.then(function (docs) {
					return docs;
				})
				.catch(function (err) {
					db.close();
					throw err;

				})
				.then(function (docs) {
					db.close();
					return new dataForge.DataFrame({ rows: docs });
				});
		},
		
		//
		// Write to monogdb.
		//
		write: function (dataFrame) {
			assert.isObject(dataFrame, "Expected 'dataFrame' parameter to 'mongo.write' to be a data frame object.");

			var documents = dataFrame.toObjects();

			var db = pmongo(connectionString, [collection]);
			return E.from(documents)
				.aggregate(Promise.resolve(), function (prevSavePromise, document) {
					return prevSavePromise.then(function () {
						return db[collection].save(document);
					});
				})
				.then(function () {
					db.close();
				});
		},
	};
};
	
