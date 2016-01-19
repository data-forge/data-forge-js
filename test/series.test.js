'use strict';


describe('Column', function () {
	
	var dataForge = require('../index');
	
	var expect = require('chai').expect; 
	
	var initExampleColumn = function (index) {
		return new dataForge.Column('some-column', [100, 200], index);
	};

	it('default index is generated', function () {
		
		var column = initExampleColumn();		
		expect(column.getIndex().toValues()).to.eql([			
			0,
			1			
		]);		
	});

	it('can get index', function () {
		
		var column = initExampleColumn(new dataForge.Index("__test__", [5, 6]));
		expect(column.getIndex().toValues()).to.eql([			
			5,
			6
		]);		
	});
	
	it('can get column values', function () {
		
		var column = initExampleColumn();		
		expect(column.toValues()).to.eql([			
			100,
			200			
		]);		
	});

});