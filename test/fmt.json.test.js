'use strict';

describe('fmt/json', function () {

	var panjas = require('../index');
	var json = require('../fmt/json');

	var expect = require('chai').expect;

	it('can load from empty json array', function () {

		var options = {};
		var jsonFormatter = json(options);

		var jsonData = [];
		var dataFrame = jsonFormatter.from(jsonData);

		expect(dataFrame.getColumnNames().length).to.eql(0);
		expect(dataFrame.getValues().length).to.eql(0);
	});

	it('can load from array of empty objects', function () {

		var options = {};
		var jsonFormatter = json(options);

		var jsonData = [{}, {}];
		var dataFrame = jsonFormatter.from(jsonData);

		expect(dataFrame.getColumnNames().length).to.eql(0);
		expect(dataFrame.getValues()).to.eql([
			[],
			[],
		]);
	});

	it('can load from json array', function () {

		var options = {};
		var jsonFormatter = json(options);

		var jsonData = [
			{
				'Column1': 'A',
				'Column2': 1
			},
			{
				'Column1': 'B',
				'Column2': 2
			}
		];
		var dataFrame = jsonFormatter.from(jsonData);

		expect(dataFrame.getColumnNames()).to.eql(['Column1', 'Column2']);
		expect(dataFrame.getValues()).to.eql([
			['A', 1],
			['B', 2],
		]);
	});

	it('uneven columns results in undefined values', function () {

		var options = {};
		var jsonFormatter = json(options);

		var jsonData = [
			{
				'Column1': 'A',
			},
			{
				'Column2': 2
			}
		];
		var dataFrame = jsonFormatter.from(jsonData);

		expect(dataFrame.getColumnNames()).to.eql(['Column1', 'Column2']);
		expect(dataFrame.getValues()).to.eql([
			['A', undefined],
			[undefined, 2],
		]);
	});	

	it('can save empty data frame to json', function () {

		var dataFrame = new panjas.DataFrame([], []);

		var options = {};
		var jsonFormatter = json(options);
		var jsonData = jsonFormatter.to(dataFrame);

		expect(jsonData).to.eql([]);
	});

	it('can save data frame to json', function () {

		var dataFrame = new panjas.DataFrame(["Column1", "Column2"], [
			['A', 1],
			['B', 2],
		]);

		var options = {};
		var jsonFormatter = json(options);
		var jsonData = jsonFormatter.to(dataFrame);

		expect(jsonData).to.eql([
			{
				'Column1': 'A',
				'Column2': 1,
			},
			{
				'Column1': 'B',
				'Column2': 2,
			},
		]);
	});
});