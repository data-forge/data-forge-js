'use strict';

describe('merge-performance', function () {

	var dataForge = require('../index.js');
	var expect = require('chai').expect;
	var E = require('linq');

	var Stopwatch = require('statman-stopwatch');

	it('merge performance test', function() {

		var stopwatch = new Stopwatch();

		var numRows = 5500;

		var df1 = new dataForge.DataFrame({
			columnNames: ["Index", "Column1"],
			rows: E.range(0, numRows).select(function (i) {
					return [i, i*i];
				})
				.toArray()
		});

		var df2 = new dataForge.DataFrame({
			columnNames: ["Index", "Column2"],
			rows: E.range(0, numRows).select(function (i) {
					return [i, i+i];
				})
				.toArray()
		});

		stopwatch.start();

		var merged = dataForge.merge(df1, df2, "Index");

		stopwatch.stop();
		var time = stopwatch.read();
		expect(time).to.be.at.most(250);
	});
});