'use strict';

describe('LazyIndex', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect;
	
	it('can get index values', function () {
		
		var index = new panjas.LazyIndex(
			function () {
				return [
					new Date(1975, 2, 24),
					new Date(2015, 2, 28),			
				];
			}
		);
		
		expect(index.values()).to.eql(
			[
				new Date(1975, 2, 24),
				new Date(2015, 2, 28),			
			]
		);
	});

});