'use strict';


describe('BaseDataFrame', function () {
	
	var panjas = require('../index');	
	var BaseDataFrame = require('../src/basedataframe');
	
	var expect = require('chai').expect;
	
	var initExampleDataFrame = function () {
		var dataFrame = new BaseDataFrame();
		dataFrame.columns = function () {
			return [
				"Value1",
				"Value2",
				"Value3",
			]; 
		};
		dataFrame.index = function () {
			return new panjas.DateIndex(
				[
					new Date(1975, 24, 2),
					new Date(2015, 24, 2),
				]
			);			
		};
		dataFrame.values = function () {
			return [
				[100, 'foo', 11],
				[200, 'bar', 22],
			];
		};
		return dataFrame;
	}; 

	var initExampleDataFrame2 = function () {
		var dataFrame = new BaseDataFrame();
		dataFrame.columns = function () {
			return [
				"Value1",
				"Value2",
				"Value3",
			]; 
		};
		dataFrame.index = function () {
			return new panjas.DateIndex(
				[
					new Date(1975, 24, 2),
					new Date(2011, 24, 2),
					new Date(2013, 24, 2),
					new Date(2015, 24, 2),
				]
			);			
		};
		dataFrame.values = function () {
			return [
				[200, 'b', 1],
				[300, 'c', 3],
				[20, 'c', 22],
				[100, 'd', 4],
			];
		};
		return dataFrame;
	}; 
	
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
	
	it('can output data frame', function () {
		
		var dataFrame = initExampleDataFrame();
		var dataSourceOptions = {};
		var formatOptions = {};
		var formattedText = "some-text";
		var promise = {};

		var dataFormatPlugin = {
			to: function (outputDataFrame, options) {
				expect(outputDataFrame).to.equal(dataFrame);
				expect(options).to.equal(formatOptions);
				return formattedText;				
			},
		};
		
		var dataSourcePlugin = {
			write: function (textData, options) {
				expect(textData).to.equal(formattedText);
				expect(options).to.equal(dataSourceOptions);
				return promise;				
			},
		};
		
		var result = dataFrame
			.as(dataFormatPlugin, formatOptions)
			.to(dataSourcePlugin, dataSourceOptions);
		expect(result).to.equal(promise);
	});
	
	it('can get rows', function () {
		var dataFrame = initExampleDataFrame();
		expect(dataFrame.rows()).to.eql([
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
		]);
	});
	
	it('can sort by single column ascending', function () {
		
		var dataFrame = initExampleDataFrame2();
		var sorted = dataFrame.orderBy('Value1');
		expect(sorted.rows()).to.eql([
			[new Date(2013, 24, 2),20, 'c', 22],
			[new Date(2015, 24, 2),100, 'd', 4],
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2011, 24, 2), 300, 'c', 3],
		]);
	});
	
	it('can sort by multiple columns ascending', function () {
		
		var dataFrame = initExampleDataFrame2();
		var sorted = dataFrame.orderBy('Value2').thenBy('Value1');
		expect(sorted.rows()).to.eql([
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2),20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(2015, 24, 2),100, 'd', 4],
		]);
	});

	it('can sort by 3 columns ascending', function () {
		
		var dataFrame = initExampleDataFrame2();
		var sorted = dataFrame.orderBy('Value2').thenBy('Value1').thenBy('Value3');
		expect(sorted.rows()).to.eql([
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2),20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(2015, 24, 2),100, 'd', 4],
		]);
	});

	it('can sort by single column descending', function () {
		
		var dataFrame = initExampleDataFrame2();
		var sorted = dataFrame.orderByDescending('Value3');
		expect(sorted.rows()).to.eql([
			[new Date(2013, 24, 2),20, 'c', 22],
			[new Date(2015, 24, 2),100, 'd', 4],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
		]);
	});

	it('can sort by multiple column descending', function () {
		
		var dataFrame = initExampleDataFrame2();
		var sorted = dataFrame.orderByDescending('Value2').thenByDescending('Value3');
		expect(sorted.rows()).to.eql([
			[new Date(2015, 24, 2),100, 'd', 4],
			[new Date(2013, 24, 2),20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
		]);
	});

	it('can sort by 3 columns descending', function () {
		
		var dataFrame = initExampleDataFrame2();
		var sorted = dataFrame.orderByDescending('Value2').thenByDescending('Value3').thenByDescending('Value1');
		expect(sorted.rows()).to.eql([
			[new Date(2015, 24, 2),100, 'd', 4],
			[new Date(2013, 24, 2),20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
		]);
	});
});
