'use strict';


describe('DataFrame', function () {
	
	var panjas = require('../index');	
	
	var expect = require('chai').expect;
	
	var initExampleDataFrame = function () {
		return new panjas.DataFrame(
			[
				"Date",
				"Value1",
				"Value2",
				"Value3",
			],
			[
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
			]
		);		
	}; 

	it('can get columns', function () {
		
		var dataFrame = initExampleDataFrame();
		
		expect(dataFrame.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
		]);		
	});

	it('can get values', function () {
		
		var dataFrame = initExampleDataFrame();
		
		expect(dataFrame.getValues()).to.eql(			[
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		]);		
	});

	it('default index is generated', function () {

		var dataFrame = initExampleDataFrame();

		expect(dataFrame.getIndex().getValues()).to.eql([
			0,
			1
		]);
	});
	
	it('can set index by column name', function () {

		var dataFrame = initExampleDataFrame();
		var indexedDataFrame = dataFrame.setIndex("Date");

		expect(indexedDataFrame.getIndex().getValues()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);

		expect(indexedDataFrame.getValues()).to.eql([
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		]);
	});

	it('can set index by column index', function () {

		var dataFrame = initExampleDataFrame();
		var indexedDataFrame = dataFrame.setIndex(0);

		expect(indexedDataFrame.getIndex().getValues()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);

		expect(indexedDataFrame.getValues()).to.eql([
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		]);
	});

	it('can reset index', function () {

		var dataFrame = initExampleDataFrame();
		var dataFrameWithIndexReset = dataFrame.setIndex("Date").resetIndex();

		expect(dataFrameWithIndexReset.getIndex().getValues()).to.eql([
			0,
			1
		]);

		expect(dataFrameWithIndexReset.getValues()).to.eql([
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		]);
	});

});