'use strict';


describe('DataFrame', function () {
	
	var DataFrame = require('../dataframe');
	
	var expect = require('chai').expect;
	
	var initExampleDataFrame = function () {
		return new DataFrame(
			[
				"Value1",
				"Value2",
				"Value3",
			],			
			[
				new Date(1975, 24, 2),
				new Date(1975, 24, 2),
			],
			[
				[100, 'foo', 11],
				[200, 'bar', 22],
			]
		);		
	} 

	it('can get columns', function () {
		
		var dataFrame = initExampleDataFrame();
		
		expect(dataFrame.columns()).to.eql([
			"Value1",
			"Value2",
			"Value3",
		]);		
	});
	
	it('can get index', function () {
		
		var dataFrame = initExampleDataFrame();
		
		expect(dataFrame.index()).to.eql([
			new Date(1975, 24, 2),
			new Date(1975, 24, 2)
		]);		
	});
	
	it('can get values', function () {
		
		var dataFrame = initExampleDataFrame();
		
		expect(dataFrame.values()).to.eql(			[
			[100, 'foo', 11],
			[200, 'bar', 22],
		]);		
	});
	
	it('throws expection when pulling a non-existing column name', function () {
		
		expect(function () {
			var dataFrame = initExampleDataFrame();
			dataFrame.series('non-existing column name');			
		}).to.throw(Error).with.property('message').that.equals("In call to 'series' failed to find column with name 'non-existing column name'.");
	});

	it('can pull column as series', function () {
		
		var dataFrame = initExampleDataFrame();
		var series1 = dataFrame.series('Value1');
		expect(series1.index()).to.eql([
			new Date(1975, 24, 2),
			new Date(1975, 24, 2)
		]);
		expect(series1.values()).to.eql(			[
			100,
			200,
		]);		
		
		var series2 = dataFrame.series('Value2');
		expect(series2.index()).to.eql([
			new Date(1975, 24, 2),
			new Date(1975, 24, 2)
		]);
		expect(series2.values()).to.eql(			[
			'foo',
			'bar',
		]);			
		
		var series3 = dataFrame.series('Value3');
		expect(series3.index()).to.eql([
			new Date(1975, 24, 2),
			new Date(1975, 24, 2)
		]);
		expect(series3.values()).to.eql(			[
			11,
			22,
		]);		
	});
});