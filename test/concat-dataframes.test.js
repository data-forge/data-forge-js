'use strict';

describe('concat-dataframes', function () {

    var expect = require('chai').expect;

    var DataFrame = require('../src/dataframe');
    var dataForge = require('../index');
    var concat = require('../src/concat-dataframes');

	it('can concat data frames', function () {

	 	var df1 = new DataFrame({ columnNames: ["1", "2"], values: [[1, 2], [3, 4]] });
	 	var df2 = new DataFrame({ columnNames: ["1", "2"], values: [[5, 6], [7, 8]] });
	 	var df3 = new DataFrame({ columnNames: ["1", "2"], values: [[9, 10], [11, 12]] });

	 	var result = dataForge.concatDataFrames([df1, df2, df3]);

	 	expect(result.getColumnNames()).to.eql(["1", "2"]);
	 	expect(result.toPairs()).to.eql([
 			[0, { "1": 1, "2": 2 }],
 			[1, { "1": 3, "2": 4 }],
 			[0, { "1": 5, "2": 6 }],
 			[1, { "1": 7, "2": 8 }],
 			[0, { "1": 9, "2": 10 }],
 			[1, { "1": 11, "2": 12 }],
 		]);
	});

	it('concat can handle out of order columns', function () {

	 	var df1 = new DataFrame({ columnNames: ["1", "2"], values: [[1, 2], [3, 4]] });
	 	var df2 = new DataFrame({ columnNames: ["2", "1"], values: [[6, 5], [8, 7]] });

	 	var result = dataForge.concatDataFrames([df1, df2]);

	 	expect(result.getColumnNames()).to.eql(["1", "2"]);
	 	expect(result.getIndex().toArray()).to.eql([0, 1, 0, 1]);
	 	expect(result.toRows()).to.eql([
 			[1, 2],
 			[3, 4],
 			[5, 6],
 			[7, 8],
 		]);
	});

	it('concat can handle uneven columns', function () {

	 	var df1 = new DataFrame({ columnNames: ["1", "2"], values: [[1, 2], [3, 4]] });
	 	var df2 = new DataFrame({ columnNames: ["2", "3"], values: [[6, 5], [8, 7]] });

	 	var result = dataForge.concatDataFrames([df1, df2]);

	 	expect(result.getColumnNames()).to.eql(["1", "2", "3"]);
	 	expect(result.getIndex().toArray()).to.eql([0, 1, 0, 1]);
	 	expect(result.toRows()).to.eql([
 			[1, 2, undefined],
 			[3, 4, undefined],
 			[undefined, 6, 5],
 			[undefined, 8, 7],
 		]);
	});

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

    it('can concat along other axis', function () {

        var df1 = new DataFrame({ columnNames: ["C1"], values: [[1], [2]] });
        var df2 = new DataFrame({ columnNames: ["C2"], values: [[3], [4]] });

        var concatenated = concat([df1, df2], { axis: 1 })
        expect(concatenated.getColumnNames()).to.eql(['C1', 'C2']);
        expect(concatenated.toRows()).to.eql([
            [1, 3],
            [2, 4],
        ]);

    });
});