'use strict';

describe('format/js', function () {

	var dataForge = require('../index');
	var js = require('../format/js');

	var expect = require('chai').expect;

	it('can load from empty js array', function () {

		var options = {};
		var jsonFormatter = js(options);

		var jsonData = [];
		var dataFrame = jsonFormatter.from(jsonData);

		expect(dataFrame.getColumnNames().length).to.eql(0);
		expect(dataFrame.getValues().length).to.eql(0);
	});

	it('can load from array of empty objects', function () {

		var options = {};
		var jsonFormatter = js(options);

		var jsonData = [{}, {}];
		var dataFrame = jsonFormatter.from(jsonData);

		expect(dataFrame.getColumnNames().length).to.eql(0);
		expect(dataFrame.getValues()).to.eql([
			[],
			[],
		]);
	});

	it('error loading from empty string', function () {

		var options = {};
		var jsonFormatter = js(options);

		var jsonData = "";
		expect(function () {
			jsonFormatter.from(jsonData);
		}).to.throw();
	});

	it('can load from js array', function () {

		var options = {};
		var jsonFormatter = js(options);

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
		var jsonFormatter = js(options);

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

	it('can save empty data frame to js', function () {

		var dataFrame = new dataForge.DataFrame([], []);

		var options = {};
		var jsonFormatter = js(options);
		var jsonData = jsonFormatter.to(dataFrame);

		expect(jsonData).to.eql([]);
	});

	it('can save data frame to js', function () {

		var dataFrame = new dataForge.DataFrame(["Column1", "Column2"], [
			['A', 1],
			['B', 2],
		]);

		var options = {};
		var jsonFormatter = js(options);
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