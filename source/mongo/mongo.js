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

	var host = config.host || 'localhost';
	var collection;
	var connectionString = host + '/' + config.db;
	var query = config.query || {};
	var fields = config.fields || {};

	if (Object.isString(config)) {
		host = config.host || 'localhost';
		var connectionStringParts = config.split('/');
		assert(connectionStringParts.length === 3, "Expected 'config' parameter to 'mongo data source' to be a connection string composed of 3 parts or a config object. Connection string format: <host>/<db>/<collection-name>");

		connectionString = connectionStringParts[0] + '/' + connectionStringParts[1];
		collection = connectionStringParts[2];

		query = {};
		fields = {};
	}
	else {
		assert.isObject(config, "Expected 'config' parameter to 'mongo data source' to be an object.");
		assert.isString(config.db, "Expected 'config.db' parameter to 'mongo data source' to be a string.");
		assert.isString(config.collection, "Expected 'config.collection' parameter to 'mongo data source' to be a string.");

		host = config.host || 'localhost';
		connectionString = host + '/' + config.db;
		collection = config.collection;
		query = config.query || {};
		fields = config.fields || {};
	}

	return {

		//
		// Read from mongodb.
		//	
		read: function () {

			var db = pmongo(connectionString, [collection]);
			return db[collection]
				.find(query, fields)
				.toArray()
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
	
