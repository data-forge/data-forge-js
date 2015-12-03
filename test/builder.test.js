'use strict';

describe('builder', function () {
	
	var dataForge = require('../index');
	
	var expect = require('chai').expect;
	var moment = require('moment');

	it('can build data frame from empty set of rows', function () {
		var data = [];
		
		var dataFrame = dataForge.builder(data);
		
		expect(dataFrame).to.be.an.instanceof(dataForge.DataFrame);
		expect(dataFrame.getColumnNames().length).to.eql(0)
		expect(dataFrame.getValues().length).to.eql(0);
	});

	it('can build data when rows only contains the column headers', function () {
		var data = [
			['Col1', 'Col2'],
		];
		
		var dataFrame = dataForge.builder(data);
		
		expect(dataFrame).to.be.an.instanceof(dataForge.DataFrame);
		expect(dataFrame.getColumnNames()).to.eql([
			'Col1',
			'Col2',
		]);
		expect(dataFrame.getValues().length).to.eql(0);
	});
	
	it('raw data is passed through when no transformation is needed', function () {
		
		var data = [
			['Col1', 'Col2'],
			['foo', 'bar'],
			['hello', 'computer'],			
		];
		
		var dataFrame = dataForge.builder(data);
		
		expect(dataFrame).to.be.an.instanceof(dataForge.DataFrame);
		expect(dataFrame.getColumnNames()).to.eql([
			'Col1',
			'Col2',
		]);
		expect(dataFrame.getValues()).to.eql([
			['foo', 'bar'],
			['hello', 'computer'],			
		]);
	});

	it('undefined values are parsed to undefined', function () {
		
		var data = [
			['Col1'],
			[undefined],
			[undefined],			
		];
		
		var dataFrame = dataForge.builder(data);
		
		expect(dataFrame.getValues()).to.eql([
			[undefined],
			[undefined],			
		]);
	});
	
	it('number columns are passed through as is', function () {
		
		var data = [
			['Col1'],
			[1],
			[15],			
		];
		
		var dataFrame = dataForge.builder(data);
		
		expect(dataFrame.getValues()).to.eql([
			[1],
			[15],			
		]);
	});

	it('date columns are passed through as is', function () {
		
		var date1 = new Date(1975, 2, 24);
		var date2 = new Date(2015, 10, 28);
		
		var data = [
			['Col1'],
			[date1],
			[date2],			
		];
		
		var dataFrame = dataForge.builder(data);
		
		expect(dataFrame.getValues()).to.eql([
			[date1],
			[date2],			
		]);
	});

});