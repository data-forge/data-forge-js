'use strict';

describe('csv.integration', function () {
	
	var pj = require('../index.js');
	var DataFrame = require('../dataframe');
	var DateIndex = require('../dateindex');
	var csv = require('../fmt/csv');

	var expect = require('chai').expect;
	var fs = require('fs');
	var moment = require('moment');	
	
	var initExampleDataFrame = function () {
		return new DataFrame(
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
			[
				['100', 'foo', '11'], //todo: use integer data here.
				['200', 'bar', '22'],
			]
		);		
	}; 
	
	it('can read data frame from CSV', function () {
		
		var testFile = 'test.csv';
		fs.writeFileSync(testFile, 
			"Date, Value1, Value2, Value3\n" +
			"1975-2-24, 100, foo, 22\n" +
			"2015-10-23, 300, bar, 23"
		);
		
		var dataFrame = pj.from(csv, testFile, {
			index_col: 'Date',
			parse_dates: ['Date',],			
		});
		
		var series1 = dataFrame.series('Value1');
		expect(series1.index().values()).to.eql([
			moment('1975-2-24').toDate(),
			moment('2015-10-23').toDate(),
		]);
		expect(series1.values()).to.eql([  //todo: values should be parsed to numbers.
			"100",
			"300",			
		]);
		
		var series2 = dataFrame.series('Value2');
		expect(series2.index().values()).to.eql([
			moment('1975-2-24').toDate(),
			moment('2015-10-23').toDate(),
		]);
		expect(series2.values()).to.eql([
			'foo',
			'bar',			
		]);
		
		expect(dataFrame.index().values()).to.eql([
			moment('1975-2-24').toDate(),
			moment('2015-10-23').toDate(),
		]);
		
		expect(dataFrame.columns()).to.eql([
			'Value1',
			'Value2',
			'Value3',			
		]);
		
		expect(dataFrame.values()).to.eql([  //todo: values should be parsed to numbers.
			["100", "foo", "22"],
			["300", "bar", "23"],			
		]);
		
		var dataFrame2 = dataFrame.subset(['Value1', 'Value3']); 
		expect(dataFrame.index().values()).to.eql([
			moment('1975-2-24').toDate(),
			moment('2015-10-23').toDate(),
		]);
		
		expect(dataFrame2.columns()).to.eql([
			'Value1',
			'Value3',			
		]);
		
		expect(dataFrame2.values()).to.eql([ //todo: values should be parsed to numbers.
			["100", "22"],
			["300", "23"],			
		]);
		
		fs.unlink(testFile);
				
	});
	
	it('can write csv to file', function () {
		
		var testFile = 'test.csv';
		var dataFrame = initExampleDataFrame();
		dataFrame.to(csv, testFile);
		
		var data = fs.readFileSync(testFile, 'utf8');
		var loadedDataFrame = pj.from(csv, testFile, {
			index_col: 'Date',
			parse_dates: ['Date',],			
		});		
		
		expect(loadedDataFrame.index().values()).to.eql(dataFrame.index().values());
		expect(loadedDataFrame.columns()).to.eql(dataFrame.columns());
		expect(loadedDataFrame.values()).to.eql(dataFrame.values());
		
		fs.unlink(testFile);	
	});
	
});