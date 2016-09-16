'use strict';

describe('performance', function () {

	var dataForge = require('../index');

	var E = require('linq');
	var expect = require('chai').expect;
	var assert = require('chai').assert;

	var Stopwatch = require('statman-stopwatch');

	it('calling last on an expensive Series should have good performance', function () {

		var stopwatch = new Stopwatch();
		stopwatch.start();

		var series = new dataForge.Series({
				iterable: {
					getIterator: function () {
						var i = 0;
						return {
							moveNext: function () {
								return ++i < 100;
							},

							getCurrent: function () {
								// Expensive operation!!
								var y = 10;
								var total = 0;
								for (var x = 0; x < 1000; ++x) {
									total += (function () {
										return 3 + y;

									}())
								}

								return total;
							},
						};
					},
				},
			});

		//console.log(series.last());

		stopwatch.stop();
		var time = stopwatch.read();
		//console.log('t ' + time);
		expect(time).to.be.at.most(3);
	});

	it('calling last on an expensive DataFrame should have good performance', function () {

		var stopwatch = new Stopwatch();
		stopwatch.start();

		var df = new dataForge.DataFrame({
			iterable: {
				getIterator: function () {
					var i = 0;
					return {
						moveNext: function () {
							return ++i < 100;
						},

						getCurrent: function () {
							// Expensive operation!!
							var y = 10;
							var total = 0;
							for (var x = 0; x < 1000; ++x) {
								total += (function () {
									return 3 + y;

								}())
							}

							return [
								i,
								{ Total: total },
							];
						},
					};
				},

				getColumnNames: function () {
					return ["Total"];
				},
			},
		});

		var lastValue = df.last();

		stopwatch.stop();
		var time = stopwatch.read();
		//console.log('t ' + time);
		expect(time).to.be.at.most(3);
	});
});