'use strict';

describe('csv.integration', function () {
	
	var dataForge = require('../index.js');
	var expect = require('chai').expect;
	
	var initExampleDataFrame = function () {
		return new dataForge.DataFrame({
				columnNames: [
					"Date",
					"Value1",
					"Value2",
					"Value3",
				],
				rows: [
					['1975-2-24', '100', 'foo', '11'],
					['2015-2-24', '200', 'bar', '22'],
				]
			});		
	}; 

	it('can read data frame from CSV', function () {
		
		var csv =
			"Date, Value1, Value2, Value3\n" +
			"1975-2-24, 100, foo, 22\n" +
			"2015-10-23, 300, bar, 23";

		var dataFrame = dataForge.fromCSV(csv);
		var series1 = dataFrame.getColumn('Value1');
		expect(series1.getSeries().toValues()).to.eql([
			'100',
			'300',
		]);
		
		var series2 = dataFrame.getColumn('Value2');
		expect(series2.getSeries().toValues()).to.eql([
			'foo',
			'bar',			
		]);
		
		expect(dataFrame.getColumnNames()).to.eql([
			"Date",
			'Value1',
			'Value2',
			'Value3',			
		]);
		
		expect(dataFrame.toValues()).to.eql([
			['1975-2-24', '100', "foo", '22'],
			['2015-10-23', '300', "bar", '23'],
		]);
		
		var dataFrame2 = dataFrame.getColumnsSubset(['Value1', 'Value3']); 
		
		expect(dataFrame2.getColumnNames()).to.eql([
			'Value1',
			'Value3',			
		]);
		
		expect(dataFrame2.toValues()).to.eql([
			['100', '22'],
			['300', '23'],			
		]);
	});

});