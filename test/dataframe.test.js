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
		
		expect(dataFrame.columnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
		]);		
	});
	
	it('can get values', function () {
		
		var dataFrame = initExampleDataFrame();
		
		expect(dataFrame.values()).to.eql(			[
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		]);		
	});
	
});