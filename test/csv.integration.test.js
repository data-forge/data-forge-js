'use strict';

describe('csv.integration', function () {
	
	var pj = require('../index.js');

	var expect = require('chai').expect;
	var fs = require('fs');
	var moment = require('moment');	
	
	it('can read data frame from CSV', function () {
		
		var testFile = 'test.csv';
		fs.writeFileSync(testFile, 
			"Date, Value1, Value2, Value3\n" +
			"1975-2-24, 100, foo, 22\n" +
			"2015-10-23, 300, bar, 23"
		);
		
		var dataFrame = pj.read_csv(testFile, {
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
	
});