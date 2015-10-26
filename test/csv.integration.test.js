'use strict';

describe('csv.integration', function () {
	
	var expect = require('chai').expect;
	
	var pj = require('../index.js');
	
	it('can read data frame from CSV', function () {
		
		pj.mockCsv = 
			"Date, Value1, Value2, Value3\n" +
			"1975-24-2, 100, foo, 22\n" +
			"2015-10-23, 300, bar, 23"
			;
		
		var dataFrame = pj.read_csv("something.csv", {
			index_col: 'Date',
			parse_dates: ['Date',],			
		});
		
		var series1 = dataFrame.series('Value1');
		expect(series1.index()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 10, 23),			
		]);
		expect(series1.values()).to.eql([
			100,
			300,			
		]);
		
		var series2 = dataFrame.series('Value2');
		expect(series2.index()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 10, 23),			
		]);
		expect(series2.values()).to.eql([
			'foo',
			'bar',			
		]);
		
		expect(dataFrame.index()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 10, 23),			
		]);
		
		expect(dataFrame.columns()).to.eql([
			'Value1',
			'Value2',
			'Value3',			
		]);
		
		expect(dataFrame.values()).to.eql([
			[100, "foo", 22],
			[300, "bar", 23],			
		]);
		
		var dataFrame2 = dataFrame.subset(['Value1', 'Value3']); 
		expect(dataFrame.index()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 10, 23),			
		]);
		
		expect(dataFrame2.columns()).to.eql([
			'Value1',
			'Value3',			
		]);
		
		expect(dataFrame2.values()).to.eql([
			[100, 22],
			[300, 23],			
		]);
				
	});
	
});