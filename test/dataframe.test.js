'use strict';


describe('DataFrame', function () {
	
	var panjas = require('../index');	
	
	var expect = require('chai').expect;
	
	var initExampleDataFrame = function () {
		return new panjas.DataFrame(
			[
				"Value1",
				"Value2",
				"Value3",
			],
			new panjas.DateIndex(			
				[
					new Date(1975, 24, 2),
					new Date(2015, 24, 2),
				]
			),
			[
				[100, 'foo', 11],
				[200, 'bar', 22],
			]
		);		
	}; 

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
		
		expect(dataFrame.index().values()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
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
		expect(series1.index().values()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);
		expect(series1.values()).to.eql(			[
			100,
			200,
		]);		
		
		var series2 = dataFrame.series('Value2');
		expect(series2.index().values()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);
		expect(series2.values()).to.eql(			[
			'foo',
			'bar',
		]);			
		
		var series3 = dataFrame.series('Value3');
		expect(series3.index().values()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);
		expect(series3.values()).to.eql(			[
			11,
			22,
		]);		
	});
	
	it('can pull column subset as new dataframe', function () 
	{
		var dataFrame = initExampleDataFrame();
		var subsetDataFrame = dataFrame.subset(['Value3', 'Value1']);
		expect(dataFrame).not.to.equal(subsetDataFrame); 
		expect(subsetDataFrame.index().values()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);		
		expect(subsetDataFrame.values()).to.eql(			[
			[11, 100],
			[22, 200],
		]);
	});
	
	it('baking data frame returns self', function () {
		
		var dataFrame = initExampleDataFrame();
		expect(dataFrame.bake()).to.equal(dataFrame);
	});
	
	it('can output data frame', function () {
		
		var dataFrame = initExampleDataFrame();
		var filePath = 'some-file';
		var options = {};
		var promise = {};
		
		var plugin = {
			to: function (outputDataFrame, outputFilePath, outputOptions) {
				expect(outputDataFrame).to.equal(dataFrame);
				expect(outputFilePath).to.equal(filePath);
				expect(outputOptions).to.equal(options);
				return promise;				
			},
		};
		
		expect(dataFrame.to(plugin, filePath, options)).to.equal(promise);
	});
	
	it('can get rows', function () {
		var dataFrame = initExampleDataFrame();
		expect(dataFrame.rows()).to.eql([
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
		]);
	});
	
});