'use strict';

describe('multi iterator', function () {

	var MultiIterator = require('../src/iterators/multi');
	var ArrayIterator = require('../src/iterators/array');
	var expect = require('chai').expect;

	it('result is undefined before moving to first element', function () {

		var multi = new MultiIterator([]);
		expect(multi.getCurrent()).to.be.undefined;
	});

	it('completes straight way when there are no child iterators', function () {

		var multi = new MultiIterator([]);
		expect(multi.moveNext()).to.eql(false);
	});

	it('can move multiple iterators forward when not at end', function () {

		var mockIterable = {
			getIterator: function () {
				return {
					moveNext: function () {
						return true;
					},

					getCurrent: function () {
						return null;
					},
				};
			},
		};

		var multi = new MultiIterator([mockIterable, mockIterable]);
		expect(multi.moveNext()).to.eql(true);
	});

	it('completes when first child iterator completes', function () {

		var mockIterable1 = {
			getIterator: function () {
				return {
					moveNext: function () {
						return false;
					},

					getCurrent: function () {
						return null;
					},
				};
			},
		};

		var mockIterable2 = {
			getIterator: function () {
				return {
					moveNext: function () {
						return true;
					},

					getCurrent: function () {
						return null;
					},
				};
			},
		};

		var multi = new MultiIterator([mockIterable1, mockIterable2]);
		expect(multi.moveNext()).to.eql(false);
	});

	it('completes when second child iterator completes', function () {
		var mockIterable1 = {
			getIterator: function () {
				return {
					moveNext: function () {
						return true;
					},

					getCurrent: function () {
						return null;
					},
				};
			},
		};

		var mockIterable2 = {
			getIterator: function () {
				return {
					moveNext: function () {
						return false;
					},

					getCurrent: function () {
						return null;
					},
				};
			},
		};

		var multi = new MultiIterator([mockIterable1, mockIterable2]);
		expect(multi.moveNext()).to.eql(false);
	});

	it('can extract current value', function () {

		var mockIterable1 = {
			getIterator: function () {
				return new ArrayIterator([1, 2]);
			},
		};

		var mockIterable2 = {
			getIterator: function () {
				return new ArrayIterator([10, 20]);
			},
		};

		var multi = new MultiIterator([mockIterable1, mockIterable2]);

		expect(multi.moveNext()).to.eql(true);
		expect(multi.getCurrent()).to.eql([1, 10]);
		expect(multi.moveNext()).to.eql(true);
		expect(multi.getCurrent()).to.eql([2, 20]);
		expect(multi.moveNext()).to.eql(false);
		expect(multi.getCurrent()).to.be.undefined;
	});

});