'use strict';

var dataForge = require("../../index.js");
var json = require('../../format/json');
var mongo = require('../../source/mongo/mongo');
var csv = require('../../format/csv');
var file = require('../../source/file');

mongo({
		host: 'localhost:27017',
		database: 'some-database',
		collection: 'some-collection'
	})
	.read()
	.then(function (dataFrame) {

		console.log(dataFrame.toString());

		var subset = dataFrame.getColumnsSubset(['SomeColumn', 'SomeOtherColumn']);
		console.log(subset.toString());

		//return subset.as(csv()).to(file('test.csv'));

		return subset
			.as(json())
			.to(mongo({
				host: 'localhost:27017',
				db: 'some-other-database',
				collection: 'some-other-collection',
			}));
	})
	.catch(function (err) {
		console.error((err && err.stack) || err);
	});

