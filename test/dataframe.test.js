'use strict';


describe('DataFrame', function () {
	
	var dataForge = require('../index');	
	
	var expect = require('chai').expect;
	
	var initExampleDataFrame = function () {
		return new dataForge.DataFrame(
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
		
		expect(dataFrame.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
		]);		
	});

	it('can get values', function () {
		
		var dataFrame = initExampleDataFrame();
		
		expect(dataFrame.getValues()).to.eql(			[
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		]);		
	});

	it('default index is generated', function () {

		var dataFrame = initExampleDataFrame();

		expect(dataFrame.getIndex().getValues()).to.eql([
			0,
			1
		]);
	});
	
});