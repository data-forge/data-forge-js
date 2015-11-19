'use strict';


describe('Column', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect; 
	
	var initExampleColumn = function (index) {
		return new panjas.Column('some-column', [100, 200], index);
	};

	it('default index is generated', function () {
		
		var column = initExampleColumn();		
		expect(column.getIndex().getValues()).to.eql([			
			0,
			1			
		]);		
	});

	it('can get index', function () {
		
		var column = initExampleColumn(new panjas.Index("__test__", [5, 6]));
		expect(column.getIndex().getValues()).to.eql([			
			5,
			6
		]);		
	});
	
	it('can get column values', function () {
		
		var column = initExampleColumn();		
		expect(column.getValues()).to.eql([			
			100,
			200			
		]);		
	});

});