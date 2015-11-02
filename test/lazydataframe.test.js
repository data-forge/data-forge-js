'use strict';


describe('LazyDataFrame', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect;
	
	var initExampleLazyDataFrame = function () {
		return new panjas.LazyDataFrame(
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
		expect(lazyDataFrame.columns()).to.eql([
			"Value1",
			"Value2",
			"Value3",
		]);		
	});
	
	it('can get values', function () {
		
		var lazyDataFrame = initExampleLazyDataFrame();		
		expect(lazyDataFrame.values()).to.eql(			[
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		]);		
	});
	
	it('can bake lazy data frame', function () {
		
		var lazyDataFrame = initExampleLazyDataFrame();
		var bakedDataFrame = lazyDataFrame.bake();
		expect(lazyDataFrame).not.to.equal(bakedDataFrame)
		expect(bakedDataFrame).to.be.an.instanceOf(panjas.DataFrame);		
	});
	
});