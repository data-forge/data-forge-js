'use strict';

var dataForge = require("../../index.js");
var json = require('../../format/json');
var mongo = require('../../source/mongo/mongo');
var csv = require('../../format/csv');
var file = require('../../source/file');

dataForge.from(mongo({
		host: 'localhost:27017',
		db: 'somed-b',
		collection: 'some-collection',
	}))
	.as(json())
	.then(function (dataFrame) {

		console.log(dataFrame.toString());

		var dataRange = dataFrame.skip(5).take(10);
		console.log(dataRange.toString());

		var subset = dataFrame.getColumnsSubset(['SomeColumn', 'SomeOtherColumn']);
		console.log(subset.toString());

		//return subset.as(csv()).to(file('test.csv'));

		return subset
			.as(json())
			.to(mongo({
				host: 'localhost',
				db: 'test',
				collection: "test",
			}));
	})
	.catch(function (err) {
		console.error((err && err.stack) || err);
	});

