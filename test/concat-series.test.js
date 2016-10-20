'use strict';

describe('concat-series', function () {

    var expect = require('chai').expect;

    var Series = require('../src/series');
    var concat = require('../src/concat-series');

    it('concatenating zero series results in an empty series', function () {

        var series = concat([]);
        expect(series.count()).to.eql(0);           
    });

    it('concatenating two empty series results in an empty data frame', function () {

        var series = concat([ new Series(), new Series() ]);
        expect(series.count()).to.eql(0);           
    });

    it('can concatenate three series', function () {

        var concatenated = concat([
            new Series({ values: [1, 2] }),
            new Series({ values: [3, 4] }),
            new Series({ values: [5, 6] }),
        ]);

        expect(concatenated.toArray()).to.eql([
            1,
            2,
            3,
            4,
            5,
            6,
        ]);
    });

    it('can concatenate empty series with non empty series', function () {

        var concatenated = concat([
            new Series(),
            new Series({ values: [3, 4] }),
        ]);

        expect(concatenated.toArray()).to.eql([
            3,
            4,
        ]);
    });

    it('can concatenate non-empty series with empty series', function () {

        var concatenated = concat([
            new Series({ values: [1, 2] }),
            new Series(),
        ]);

        expect(concatenated.toArray()).to.eql([
            1,
            2,
        ]);
    });

    it('can concatenate to a series with multiple parameters', function () {

        var df = new Series({ values: [1, 2] });
        var concatenated = df
            .concat(
                new Series({ values: [3, 4] }),
                new Series({ values: [5, 6] })
            );

        expect(concatenated.toArray()).to.eql([
            1,
            2,
            3,
            4,
            5,
            6,
        ]);
    });

    it('can concatenate to a series with array', function () {

        var df = new Series({ values: [1, 2] });
        var concatenated = df
            .concat([
                new Series({ values: [3, 4] }),
                new Series({ values: [5, 6] })
            ]);

        expect(concatenated.toArray()).to.eql([
            1,
            2,
            3,
            4,
            5,
            6,
        ]);
    });

    it('can concatenate to a series with array and extra parameter', function () {

        var df = new Series({ values: [1, 2] });
        var concatenated = df
            .concat(
                [new Series({ values: [3, 4] })],
                new Series({ values: [5, 6] })
            );

        expect(concatenated.toArray()).to.eql([
            1,
            2,
            3,
            4,
            5,
            6,
        ]);
    });

    it('can concatenate to a series with parmaeter and array', function () {

        var df = new Series({ values: [1, 2] });
        var concatenated = df
            .concat(
                new Series({ values: [3, 4] }),
                [new Series({ values: [5, 6] })]
            );

        expect(concatenated.toArray()).to.eql([
            1,
            2,
            3,
            4,
            5,
            6,
        ]);
    });
});

