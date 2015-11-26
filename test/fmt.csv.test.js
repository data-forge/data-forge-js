'use strict';

describe('fmt/csv', function () {

	var panjas = require('../index');
	var csv = require('../fmt/csv');

	var expect = require('chai').expect;
	var assert = require('chai').assert;

	it('can load from empty csv', function () {

		var options = {};
		var csvFormatter = csv(options);

		var dataFrame = csvFormatter.from("");

		expect(dataFrame.getColumnNames().length).to.eql(0);
		expect(dataFrame.getValues().length).to.eql(0);
	});

	it('can load from csv with header only', function () {

		var options = {};
		var csvFormatter = csv(options);

		var csvData = "Column1,Column2";
		var dataFrame = csvFormatter.from(csvData);

		expect(dataFrame.getColumnNames()).to.eql(["Column1", "Column2"]);
		expect(dataFrame.getValues().length).to.eql(0);
	});

	it('can load from csv with header and an empty line only', function () {

		var options = {};
		var csvFormatter = csv(options);

		var csvData = "Column1,Column2\r\n";
		var dataFrame = csvFormatter.from(csvData);

		expect(dataFrame.getColumnNames()).to.eql(["Column1", "Column2"]);
		expect(dataFrame.getValues().length).to.eql(0);
	});

	it('can load from csv', function () {

		var options = {};
		var csvFormatter = csv(options);

		var csvData = 
			"Column1,Column2\r\n" +
			"A,1\r\n" +
			"B,2\r\n";
		var dataFrame = csvFormatter.from(csvData);

		expect(dataFrame.getColumnNames()).to.eql(['Column1', 'Column2']);
		expect(dataFrame.getValues()).to.eql([
			['A', 1],
			['B', 2],
		]);
	});

	it('can load from csv - with empty rows', function () {

		var options = {};
		var csvFormatter = csv(options);

		var csvData = 
			"Column1,Column2\r\n" +
			"\r\n" +
			"A,1\r\n" +
			"\r\n" + 
			"B,2\r\n" +
			"\r\n";
		var dataFrame = csvFormatter.from(csvData);

		expect(dataFrame.getColumnNames()).to.eql(['Column1', 'Column2']);
		expect(dataFrame.getValues()).to.eql([
			['A',1],
			['B',2],
		]);
	});

	it('can handle csv with empty fields', function () {

		var options = {};
		var csvFormatter = csv(options);

		var csvData = 
			"Column1,Column2\r\n" +
			"\r\n" +
			",1\r\n" +
			"\r\n" + 
			"B,\r\n" +
			"\r\n";
		var dataFrame = csvFormatter.from(csvData);

		expect(dataFrame.getColumnNames()).to.eql(['Column1', 'Column2']);
		expect(dataFrame.getValues()).to.eql([
			[undefined,1],
			['B',undefined],
		]);
	});

	it('can save empty data frame to csv', function () {

		var dataFrame = new panjas.DataFrame([], []);

		var options = {};
		var csvFormatter = csv(options);
		var csvData = csvFormatter.to(dataFrame);

		assert.isString(csvData);
		expect(csvData.length).to.eql(0);
	});

	it('can save data frame to csv', function () {

		var dataFrame = new panjas.DataFrame(["Column1", "Column2"], [
			['A', 1],
			['B', 2],
		]);

		var options = {};
		var csvFormatter = csv(options);
		var csvData = csvFormatter.to(dataFrame);

		assert.isString(csvData);
		expect(csvData).to.eql(
			"Column1,Column2\r\n" +
			"A,1\r\n" +
			"B,2"
		);
	});
});