'use strict';

describe('text data source', function () {

	var expect = require('chai').expect;
	var dataForge = require('../index');
	var text = require('../source/text');
	var csv = require('../format/csv');

	it('can sync load data frame from text', function () {

		var csvText = 
			"Col1, Col2\n" +
			"1, 2\n" +
			"3, 4";

		var dataFrame = dataForge
			.fromSync(text(csvText))
			.as(csv());

		expect(dataFrame.getColumnNames()).to.eql(["Col1", "Col2"]);
		expect(dataFrame.getValues()).to.eql([
			['1', '2'],
			['3', '4'],
		]);
	});

	it('can sync save data frame to text', function () {

		var csvText = 
			"Col1,Col2\r\n" +
			"1,2\r\n" +
			"3,4";

		var dataFrame = dataForge
			.fromSync(text(csvText))
			.as(csv());

		var outputText = dataFrame.as(csv()).toSync(text());
		expect(outputText).to.eql(csvText);
	});

	it('can async load data frame from text', function () {

		var csvText = 
			"Col1, Col2\n" +
			"1, 2\n" +
			"3, 4";

		return dataForge
			.from(text(csvText))
			.as(csv())
			.then(function (dataFrame) {
				expect(dataFrame.getColumnNames()).to.eql(["Col1", "Col2"]);
				expect(dataFrame.getValues()).to.eql([
					['1', '2'],
					['3', '4'],
				]);
			});
	});

	it('can async save data frame to text', function () {

		var csvText = 
			"Col1,Col2\r\n" +
			"1,2\r\n" +
			"3,4";

		return dataForge
			.from(text(csvText))
			.as(csv())
			.then(function (dataFrame) {
				return dataFrame
					.as(csv())
					.to(text());
			})
			.then(function (outputText) {
				expect(outputText).to.eql(csvText);
			});
	});
});