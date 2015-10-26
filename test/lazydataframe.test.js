'use strict';


describe('LazyDataFrame', function () {
	
	var LazyDataFrame = require('../lazydataframe');
	var DateIndex = require('../dateindex');
	
	var expect = require('chai').expect;
	
	var initExampleLazyDataFrame = function () {
		return new LazyDataFrame(
			[
				"Value1",
				"Value2",
				"Value3",
			],
			new DateIndex(			
				[
					new Date(1975, 24, 2),
					new Date(2015, 24, 2),
				]
			),
			function () {
				return [
					[100, 'foo', 11],
					[200, 'bar', 22],
				];
			}
		);		
	} 

	it('can get columns', function () {
		
		var lazyDataFrame = initExampleLazyDataFrame();	
		expect(lazyDataFrame.columns()).to.eql([
			"Value1",
			"Value2",
			"Value3",
		]);		
	});
	
	it('can get index', function () {
		
		var lazyDataFrame = initExampleLazyDataFrame();		
		expect(lazyDataFrame.index().values()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);		
	});
	
	it('can get values', function () {
		
		var lazyDataFrame = initExampleLazyDataFrame();		
		expect(lazyDataFrame.values()).to.eql(			[
			[100, 'foo', 11],
			[200, 'bar', 22],
		]);		
	});
	
	it('throws expection when pulling a non-existing column name', function () {
		
		expect(function () {
			var lazyDataFrame = initExampleLazyDataFrame();
			lazyDataFrame.series('non-existing column name');			
		}).to.throw(Error).with.property('message').that.equals("In call to 'series' failed to find column with name 'non-existing column name'.");
	});

	it('can pull column as series', function () {
		
		var lazyDataFrame = initExampleLazyDataFrame();
		var series1 = lazyDataFrame.series('Value1');
		expect(series1.index().values()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);
		expect(series1.values()).to.eql(			[
			100,
			200,
		]);		
		
		var series2 = lazyDataFrame.series('Value2');
		expect(series2.index().values()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);
		expect(series2.values()).to.eql(			[
			'foo',
			'bar',
		]);			
		
		var series3 = lazyDataFrame.series('Value3');
		expect(series3.index().values()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);
		expect(series3.values()).to.eql(			[
			11,
			22,
		]);		
	});
	
	it('can pull column subset as new LazyDataFrame', function () 
	{
		var lazyDataFrame = initExampleLazyDataFrame();
		var subsetLazyDataFrame = lazyDataFrame.subset(['Value3', 'Value1']);
		expect(LazyDataFrame).not.to.equal(subsetLazyDataFrame); 
		expect(subsetLazyDataFrame.index().values()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);		
		expect(subsetLazyDataFrame.values()).to.eql(			[
			[11, 100],
			[22, 200],
		]);
	});
	
});