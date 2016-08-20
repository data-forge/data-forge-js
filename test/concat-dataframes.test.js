'use strict';

describe('concat', function () {

    var expect = require('chai').expect;

    var DataFrame = require('../src/dataframe.js');
    var concat = require('../src/concat-dataframes.js');

    it('concatenating zero dataframes results in an empty dataframe', function () {

        var emptyDataFrame = concat([]);
        expect(emptyDataFrame.getColumnNames()).to.eql([]);
        expect(emptyDataFrame.count()).to.eql(0);           
    });

    it('concatenating two empty dataframes results in an empty data frame', function () {

        var emptyDataFrame = concat([ new DataFrame(), new DataFrame() ]);
        expect(emptyDataFrame.getColumnNames()).to.eql([]);
        expect(emptyDataFrame.count()).to.eql(0);           
    });

    it('can concatenate three dataframes', function () {

        var concatenated = concat([
            new DataFrame({ columnNames: ["C1"], values: [[1], [2]] }),
            new DataFrame({ columnNames: ["C1"], values: [[3], [4]] }),
            new DataFrame({ columnNames: ["C1"], values: [[5], [6]] }),
        ]);

        expect(concatenated.toRows()).to.eql([
            [1],
            [2],
            [3],
            [4],
            [5],
            [6],
        ]);
    });

    it('can concatenate empty dataframe with non empty dataframe', function () {

        var concatenated = concat([
            new DataFrame(),
            new DataFrame({ columnNames: ["C1"], values: [[3], [4]] }),
        ]);

        expect(concatenated.toRows()).to.eql([
            [3],
            [4],
        ]);
    });

    it('can concatenate non-empty dataframe with empty dataframe', function () {

        var concatenated = concat([
            new DataFrame({ columnNames: ["C1"], values: [[1], [2]] }),
            new DataFrame(),
        ]);

        expect(concatenated.toRows()).to.eql([
            [1],
            [2],
        ]);
    });

    it('can concatenate dataframes with irregular columns', function () {

        var concatenated = concat([
            new DataFrame({ columnNames: ["C1"], values: [[1], [2]] }),
            new DataFrame({ columnNames: ["C2"], values: [[3], [4]] }),
            new DataFrame({ columnNames: ["C3"], values: [[5], [6]] }),
        ]);

        expect(concatenated.getColumnNames()).to.eql(["C1", "C2", "C3"]);
        expect(concatenated.toRows()).to.eql([
            [1, undefined, undefined],
            [2, undefined, undefined],
            [undefined, 3, undefined],
            [undefined, 4, undefined],
            [undefined, undefined, 5],
            [undefined, undefined, 6],
        ]);
    });

    it('can concatenate to a dataframe with multiple parameters', function () {

        var df = new DataFrame({ columnNames: ["C1"], values: [[1], [2]] });
        var concatenated = df
            .concat(
                new DataFrame({ columnNames: ["C1"], values: [[3], [4]] }),
                new DataFrame({ columnNames: ["C1"], values: [[5], [6]] })
            );

        expect(concatenated.toRows()).to.eql([
            [1],
            [2],
            [3],
            [4],
            [5],
            [6],
        ]);
    });

    it('can concatenate to a dataframe with array', function () {

        var df = new DataFrame({ columnNames: ["C1"], values: [[1], [2]] });
        var concatenated = df
            .concat([
                new DataFrame({ columnNames: ["C1"], values: [[3], [4]] }),
                new DataFrame({ columnNames: ["C1"], values: [[5], [6]] })
            ]);

        expect(concatenated.toRows()).to.eql([
            [1],
            [2],
            [3],
            [4],
            [5],
            [6],
        ]);
    });

    it('can concatenate to a dataframe with array and extra parameter', function () {

        var df = new DataFrame({ columnNames: ["C1"], values: [[1], [2]] });
        var concatenated = df
            .concat(
                [new DataFrame({ columnNames: ["C1"], values: [[3], [4]] })],
                new DataFrame({ columnNames: ["C1"], values: [[5], [6]] })
            );

        expect(concatenated.toRows()).to.eql([
            [1],
            [2],
            [3],
            [4],
            [5],
            [6],
        ]);
    });

    it('can concatenate to a dataframe with parmaeter and array', function () {

        var df = new DataFrame({ columnNames: ["C1"], values: [[1], [2]] });
        var concatenated = df
            .concat(
                new DataFrame({ columnNames: ["C1"], values: [[3], [4]] }),
                [new DataFrame({ columnNames: ["C1"], values: [[5], [6]] })]
            );

        expect(concatenated.toRows()).to.eql([
            [1],
            [2],
            [3],
            [4],
            [5],
            [6],
        ]);
    });
});