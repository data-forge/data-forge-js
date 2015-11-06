'use strict';

describe('csv.integration', function () {
	
	var panjas = require('../index.js');
	var csv = require('../fmt/csv');
	var file = require('../datasource/file');

	var expect = require('chai').expect;
	var fs = require('fs');
	var moment = require('moment');	

	var testFile = 'test.csv';
	
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

	afterEach(function () {
		if (fs.existsSync(testFile)) {
			fs.unlink(testFile);						
		}
	});
	
	it('can read data frame from CSV', function () {
		
		fs.writeFileSync(testFile, 
			"Date, Value1, Value2, Value3\n" +
			"1975-2-24, 100, foo, 22\n" +
			"2015-10-23, 300, bar, 23"
		);
		
		var csvOptions = {
			index_col: 'Date',
			parse_dates: ['Date',],			
		};
		
		return panjas
			.from(file, testFile)
			.as(csv, csvOptions)
			.then(function (dataFrame) {
				var series1 = dataFrame.getColumn('Value1');
				expect(series1.getValues()).to.eql([
					100,
					300,			
				]);
				
				var series2 = dataFrame.getColumn('Value2');
				expect(series2.getValues()).to.eql([
					'foo',
					'bar',			
				]);
				
				expect(dataFrame.getColumnNames()).to.eql([
					"Date",
					'Value1',
					'Value2',
					'Value3',			
				]);
				
				expect(dataFrame.getValues()).to.eql([
					[moment('1975-2-24').toDate(), 100, "foo", 22],
					[moment('2015-10-23').toDate(), 300, "bar", 23],			
				]);
				
				var dataFrame2 = dataFrame.subset(['Value1', 'Value3']); 
				
				expect(dataFrame2.getColumnNames()).to.eql([
					'Value1',
					'Value3',			
				]);
				
				expect(dataFrame2.getValues()).to.eql([
					[100, 22],
					[300, 23],			
				]);
				
				fs.unlink(testFile);				
			});	
	});
	
	it('can write csv to file', function () {
		
		var dataFrame = initExampleDataFrame();
		return dataFrame
			.as(csv)
			.to(file, testFile)
			.then(function () {
				var data = fs.readFileSync(testFile, 'utf8');
				return panjas
					.from(file, testFile)
					.as(csv, {
						parse_dates: ['Date',],			
					});
			})
			.then(function (loadedDataFrame) {
				expect(loadedDataFrame.getColumnNames()).to.eql(dataFrame.getColumnNames());
				expect(loadedDataFrame.getValues()).to.eql(dataFrame.getValues());
				
			});
	});
});