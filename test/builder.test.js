'use strict';

describe('builder', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect;
	var moment = require('moment');
	
	it('raw data is passed through when no transformation is needed', function () {
		
		var data = [
			['Col1', 'Col2'],
			['foo', 'bar'],
			['hello', 'computer'],			
		];
		
		var dataFrame = panjas.builder(data);
		
		expect(dataFrame).to.be.an.instanceof(panjas.DataFrame);
		expect(dataFrame.index().values()).to.eql([
			0,
			1,			
		]);		
		expect(dataFrame.columns()).to.eql([
			'Col1',
			'Col2',
		])
		expect(dataFrame.values()).to.eql([
			['foo', 'bar'],
			['hello', 'computer'],			
		]);
	});
	
	it('can parse dates in requested columns', function () {
		
		var date1 = "1975-2-24";
		var date2 = "2015-10-28";
		var date1AsDate = moment(date1).toDate();
		var date2AsDate = moment(date2).toDate();
		
		var data = [
			['Col1', 'Col2', 'Col3'],
			[date1, 'foo', date2],
			[date2, 'hello', date1],			
		];
		
		var dataFrame = panjas.builder(data, {
			parse_dates: ['Col1', 'Col3'],
		});
		
		expect(dataFrame).to.be.an.instanceof(panjas.DataFrame);
		expect(dataFrame.index().values()).to.eql([
			0,
			1,			
		]);		
		expect(dataFrame.columns()).to.eql([
			'Col1',
			'Col2',
			'Col3',
		])
		expect(dataFrame.values()).to.eql([
			[date1AsDate, 'foo', date2AsDate],
			[date2AsDate, 'hello', date1AsDate],			
		]);
	});
	
	it('integer columns are automatically parsed to integer type', function () {
		
		var data = [
			['Col1'],
			['1'],
			['15'],			
		];
		
		var dataFrame = panjas.builder(data);
		
		expect(dataFrame).to.be.an.instanceof(panjas.DataFrame);
		expect(dataFrame.values()).to.eql([
			[1],
			[15],			
		]);
	});
	
});