'use strict';


describe('data-forge', function () {
	
	var dataForge = require('../index');	
	var ArrayIterator = require('../src/iterators/array');	
	var E = require('linq');
	var extend = require('extend');

	var expect = require('chai').expect;
	var assert = require('chai').assert;

	var initDataFrame = function (columns, values, index) {
		assert.isArray(columns);
		assert.isArray(values);

		return new dataForge.DataFrame({
			columnNames: columns,
			values: function () {
				return new ArrayIterator(values);
			},
			index: index,
		});
	};

	it('can load from array of empty objects', function () {

		var jsData = "[{}, {}]";
		var dataFrame = dataForge.fromJSON(jsData);

		expect(dataFrame.getColumnNames().length).to.eql(0);
		expect(dataFrame.toRows()).to.eql([
			[],
			[],
		]);
	});

	it('error loading from empty json string', function () {

		var jsData = "";
		expect(function () {
				dataForge.fromJSON(jsData);
			}).to.throw();
	});

	it('can load from json with json array', function () {

		var jsData = "[]";
		var dataFrame = dataForge.fromJSON(jsData);

		expect(dataFrame.getColumnNames().length).to.eql(0);
		expect(dataFrame.toRows().length).to.eql(0);
	});

	it('can load from json array', function () {

		var jsData = 
			'[' +
				'{' +
					'"Column1": "A",' +
					'"Column2": 1' +
				'},' +
				'{' +
					'"Column1": "B",' +
					'"Column2": 2' +
				'}' +
			']';
		var dataFrame = dataForge.fromJSON(jsData);

		expect(dataFrame.getColumnNames()).to.eql(['Column1', 'Column2']);
		expect(dataFrame.toRows()).to.eql([
			['A', 1],
			['B', 2],
		]);
	});

	it('uneven columns loaded from json result in undefined values', function () {

		var jsData = 
			'[' +
				'{' +
					'"Column1": "A"' +
				'},' +
				'{' +
					'"Column2": 2' +
				'}' +
			']';
		var dataFrame = dataForge.fromJSON(jsData);

		expect(dataFrame.getColumnNames()).to.eql(['Column1']); // 2nd column is ignored because it is not part of the first object.
		expect(dataFrame.toRows()).to.eql([
			['A'],
			[undefined],
		]);
	});	

	it('can generate series from range', function () {

		var series = dataForge.range(10, 5);
		expect(series.toPairs()).to.eql([
			[0, 10],
			[1, 11],
			[2, 12],
			[3, 13],
			[4, 14],
		]);

	});

	it('can generate data-frame from matrix', function () {

		var dataFrame = dataForge.matrix(3, 4, 2, 3);
		expect(dataFrame.getColumnNames()).to.eql([
			"1",
			"2",
			"3",
		]);
		expect(dataFrame.toPairs()).to.eql([
			[0, { "1": 2, 	"2": 5, 	"3": 8}],
			[1, { "1": 11, 	"2": 14,	"3": 17}],
			[2, { "1": 20, 	"2": 23, 	"3": 26}],
			[3, { "1": 29, 	"2": 32, 	"3": 35}],
		]);
	});

	it('can register plugin', function () {

		var called = false;

		var plugin = function (passedInDataForge) {
			expect(passedInDataForge).to.equal(dataForge);
			called = true;
		};

		dataForge.use(plugin);

		expect(called).to.equal(true);

	});

	it('registering plugin more than once has no effect', function () {

		var called = 0;

		var plugin = function (passedInDataForge) {
			expect(passedInDataForge).to.equal(dataForge);
			++called;
		};

		dataForge.use(plugin);
		dataForge.use(plugin);

		expect(called).to.equal(1);

	});


});
