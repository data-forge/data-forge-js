'use strict';

var dataForge = require("../../index.js");

var pmongo = require('promised-mongo');
var db = pmongo('localhost/some-database', ['someCollection', 'someOtherCollection']);

db.someCollection.find().toArray()
	.then(function (documents) {

		console.log(dataFrame.toString());

		var subset = dataFrame.getColumnsSubset(['SomeColumn', 'SomeOtherColumn']);
		console.log(subset.toString());

		return db.someOtherCollection.insert(subset.toObjects());
	})
	.catch(function (err) {
		console.error((err && err.stack) || err);
	})
	.then(function () {
		db.close();
	});	

