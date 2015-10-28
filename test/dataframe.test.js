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
	
	it('baking data frame returns self', function () {
		
		var dataFrame = initExampleDataFrame();
		expect(dataFrame.bake()).to.equal(dataFrame);
	});
	

	
});