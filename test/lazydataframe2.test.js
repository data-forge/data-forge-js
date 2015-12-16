'use strict';


describe('LazyDataFrame2', function () {
	
	var dataForge = require('../index');
	
	var expect = require('chai').expect;
	
	var initExampleLazyDataFrame = function () {
		return new dataForge.LazyDataFrame2(
			function () {
				return [
					"Value1",
					"Value2",
					"Value3",
				];
			},
			function () {
				return [
					[new Date(1975, 24, 2), 100, 'foo', 11],
					[new Date(2015, 24, 2), 200, 'bar', 22],
				];
			}
		);		
	} 

	it('can get columns', function () {
		
		var lazyDataFrame = initExampleLazyDataFrame();	
		expect(lazyDataFrame.getColumnNames()).to.eql([
			"Value1",
			"Value2",
			"Value3",
		]);		
	});
	
	it('can get values', function () {
		
		var lazyDataFrame = initExampleLazyDataFrame();		
		expect(lazyDataFrame.getValues()).to.eql(			[
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		]);		
	});

	it('default index is generated', function () {

		var dataFrame = initExampleLazyDataFrame();

		expect(dataFrame.getIndex().getValues()).to.eql([
			0,
			1
		]);
	});
});