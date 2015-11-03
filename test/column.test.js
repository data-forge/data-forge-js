'use strict';


describe('Series', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect; 
	
	var initExampleColumn = function () {
		return new panjas.Column('some-column', [100, 200]);
	};
	
	it('can get column values', function () {
		
		var column = initExampleColumn();		
		expect(column.values()).to.eql([			
			100,
			200			
		]);		
	});

	it('baking column returns self', function () {
		
		var column = initExampleColumn();
		expect(column.bake()).to.equal(column);
	});

});