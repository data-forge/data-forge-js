'use strict';

describe('BaseIndex', function () {
	
	var BaseIndex = require('../src/baseindex');
	
	var expect = require('chai').expect;
	
	it('can skip', function () {
		var index = new BaseIndex();
		index.values = function () {
			return [
				new Date(1975, 2, 24),
				new Date(2011, 2, 28),
				new Date(2012, 2, 28),
				new Date(2015, 2, 28),			
			];
		}
		
		var skipIndex = index.skip(2);		
		expect(skipIndex.values()).to.eql(
			[new Date(2012, 2, 28), new Date(2015, 2, 28)]		
		);
	});
});