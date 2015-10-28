'use strict';

describe('builder', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect;
	
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
	
});