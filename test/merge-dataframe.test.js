'use strict';

describe('merge-examples', function () {

    var expect = require('chai').expect;
    var assert = require('chai').assert;

    var dataForge = require('../index');
    var extend = require('extend');

	var initDataFrame = function (columns, values, index) {
		assert.isArray(columns);
		assert.isArray(values);

		return new dataForge.DataFrame({
			columnNames: columns,
			values: values,
			index: index,
		});
	};

    describe('basic', function () {

        it('can merge on column', function () {

            var left = initDataFrame(
                [
                    'merge-key',
                    'left-val',
                ],
                [
                    ['foo', 1],
                    ['foo', 2],
                ]
            );

            var right = initDataFrame(
                [
                    'merge-key',
                    'right-val',
                    'other-right-value'
                ],
                [
                    ['foo', 4, 100],
                    ['foo', 5, 200],
                ]
            );

            var merged = left.join(
                    right,
                    function (leftRow) {
                        return leftRow["merge-key"];
                    },
                    function (rightRow) {
                        return rightRow["merge-key"];
                    },
                    function (leftRow, rightRow) {
                        return {
                            "merge-key": leftRow["merge-key"],
                            'left-val': leftRow["left-val"],
                            'right-val': rightRow["right-val"],
                            'other-right-value': rightRow["other-right-value"],
                        };
                    }
                );

            expect(merged.getColumnNames()).to.eql([
                'merge-key',
                'left-val',
                'right-val',
                'other-right-value',
            ]);
            expect(merged.toRows()).to.eql([
                ['foo', 1, 4, 100],
                ['foo', 1, 5, 200],
                ['foo', 2, 4, 100],
                ['foo', 2, 5, 200],
            ]);
        });

        it('can merge on index', function () {

            var left = initDataFrame(
                    [
                        'merge-key',
                        'left-val',
                    ],
                    [
                        ['foo', 1],
                        ['foo', 2],
                    ]
                )
                .setIndex('merge-key')
                ;

            var right = initDataFrame(
                    [
                        'merge-key',
                        'right-val',
                        'other-right-value'
                    ],
                    [
                        ['foo', 4, 100],
                        ['foo', 5, 200],
                    ]
                )
                .setIndex('merge-key')
                ;

            var merged = left.join(
                    right,
                    function (leftRow, index) {
                        return index;
                    },
                    function (rightRow, index) {
                        return index;
                    },
                    function (leftRow, rightRow) {
                        return {
                            "merge-key": leftRow["merge-key"],
                            'left-val': leftRow["left-val"],
                            'right-val': rightRow["right-val"],
                            'other-right-value': rightRow["other-right-value"],
                        };
                    }               
                );

            expect(merged.getColumnNames()).to.eql([
                'merge-key',
                'left-val',
                'right-val',
                'other-right-value',
            ]);
            expect(merged.toRows()).to.eql([
                ['foo', 1, 4, 100],
                ['foo', 1, 5, 200],
                ['foo', 2, 4, 100],
                ['foo', 2, 5, 200],
            ]);
        });

        it('can merge on columns that have different indices', function () {

            var left = initDataFrame(
                [
                    'lval',
                    'key',
                ],
                [
                    [1, 'foo'],
                    [2, 'foo'],
                ]
            );
            var right = initDataFrame(
                [
                    'key',
                    'rval',
                ],
                [
                    ['foo', 4],
                    ['foo', 5],
                ]
            );

            var merged = left.join(
                    right,
                    function (leftRow) {
                        return leftRow.key;
                    },
                    function (rightRow) {
                        return rightRow.key;
                    },
                    function (leftRow, rightRow) {
                        return {
                            key: leftRow.key,
                            lval: leftRow.lval,
                            rval: rightRow.rval,
                        };
                    }
                );

            expect(merged.getColumnNames()).to.eql([
                'key',
                'lval',
                'rval',
            ]);
            expect(merged.toRows()).to.eql([
                ['foo', 1, 4],
                ['foo', 1, 5],
                ['foo', 2, 4],
                ['foo', 2, 5],
            ]);
        });

        it('can merge 2 series to create dataframe', function () {

            var series1 = new dataForge.Series({ values: [1, 2, 3] });
            var series2 = new dataForge.Series({ values: [10, 12, 13] });

            var merged = series1.join(
                    series2,
                    function (l, i) {
                        return i;
                    },
                    function (r, i) {
                        return i;
                    },
                    function (l, r) {
                        return {
                            Column1: l,
                            Column2: r,
                        };
                    }
                )
                .inflate()
                ;

            expect(merged.getColumnNames()).to.eql(["Column1", "Column2"]);
            expect(merged.getIndex().take(3).toArray()).to.eql([0, 1, 2]);
            expect(merged.toRows()).to.eql([
                [1, 10],
                [2, 12],
                [3, 13],
            ]);
        });

        // http://blogs.geniuscode.net/RyanDHatch/?p=116
        it('outer join', function () {

            var ryan = { Name: "Ryan" };
            var jer = { Name: "Jer" };
            var people = new dataForge.DataFrame({ values: [ ryan, jer ] });

            var camp = { Name: "Camp", Owner: "Ryan" };
            var brody = { Name: "Brody", Owner: "Ryan", };
            var homeless = { Name: "Homeless" };
            var dogs = new dataForge.DataFrame({ values: [ camp, brody, homeless ] });

            var join = people.joinOuter(
                    dogs,
                    person => person.Name,
                    dog => dog.Owner,
                    (person, dog) => {
                        var output = {};
                        if (person) {
                            output.Person = person.Name;
                        }
                        if (dog) {
                            output.Dog = dog.Name;
                        }
                        return output;
                    }
                )
                ;

            expect(join.getColumnNames()).to.eql(["Person", "Dog"]);
            expect(join.toRows()).to.eql([
                ["Jer", undefined],
                ["Ryan", "Camp"],
                ["Ryan", "Brody"],
                [undefined, "Homeless"],
            ]);
        });
    });

    //
    // These tests based on these examples:
    //
    //  http://chrisalbon.com/python/pandas_join_merge_dataframe.html
    //
    describe('pandas-examples', function () {

        var df_a;
        var df_b;
        var df_n;

        beforeEach(function () {
            df_a = new dataForge.DataFrame({
                columnNames: [
                    'subject_id',
                    'first_name',
                    'last_name',
                ],
                values: [
                    [1, 'Alex', 'Anderson'],
                    [2, 'Amy', 'Ackerman'],
                    [3, 'Allen', 'Ali'],
                    [4, 'Alice', 'Aoni'],
                    [5, 'Ayoung', 'Aitches'],
                ],
            });

            df_b = new dataForge.DataFrame({
                columnNames: [
                    'subject_id',
                    'first_name',
                    'last_name',
                ],
                values: [
                    [4, 'Billy', 'Bonder'],
                    [5, 'Brian', 'Black'],
                    [6, 'Bran', 'Balwner'],
                    [7, 'Bryce', 'Brice'],
                    [8, 'Betty', 'Btisan'],
                ],
            });

            df_n = new dataForge.DataFrame({
                columnNames: [
                    "subject_id",
                    "test_id",
                ],
                values: [
                    [1, 51],
                    [2, 15],
                    [3, 15],
                    [4, 61],
                    [5, 16],
                    [7, 14],
                    [8, 15],
                    [9, 1],
                    [10, 61],
                    [11, 16],
                ],
            });
        });

        it('Join the two dataframes along rows', function () {

            var df_new = dataForge.concatDataFrames([df_a, df_b]);

            expect(df_new.getIndex().toArray()).to.eql([
                0, 1, 2, 3, 4,
                0, 1, 2, 3, 4,
            ]);

            expect(df_new.toRows()).to.eql([
                [1, 'Alex', 'Anderson'],
                [2, 'Amy', 'Ackerman'],
                [3, 'Allen', 'Ali'],
                [4, 'Alice', 'Aoni'],
                [5, 'Ayoung', 'Aitches'],
                [4, 'Billy', 'Bonder'],
                [5, 'Brian', 'Black'],
                [6, 'Bran', 'Balwner'],
                [7, 'Bryce', 'Brice'],
                [8, 'Betty', 'Btisan'],
            ]);

        });

        it('Join the two dataframes along columns', function () {

            var df_new = dataForge.concatDataFrames([df_a, df_b], { axis: 1 });

            expect(df_new.getIndex().take(5).toArray()).to.eql([
                0, 1, 2, 3, 4,
            ]);

            expect(df_new.getColumnNames()).to.eql([
                'subject_id.1',
                'first_name.1',
                'last_name.1',
                'subject_id.2',
                'first_name.2',
                'last_name.2',
            ]);

            expect(df_new.toRows()).to.eql([
                [1, 'Alex', 'Anderson', 4, 'Billy', 'Bonder'],
                [2, 'Amy', 'Ackerman', 5, 'Brian', 'Black'],
                [3, 'Allen', 'Ali', 6, 'Bran', 'Balwner'],
                [4, 'Alice', 'Aoni', 7, 'Bryce', 'Brice'],
                [5, 'Ayoung', 'Aitches', 8, 'Betty', 'Btisan'],          
            ]);
        });

        it('Merge two dataframes along the subject_id value', function () {

            var df_new = dataForge.concatDataFrames([df_a, df_b]);
            var df_merged = df_new
                .join(
                    df_n,
                    function (rowA) {
                        return rowA.subject_id;
                    },
                    function (rowB) {
                        return rowB.subject_id;
                    },
                    function (rowA, rowB) {
                        return {
                            subject_id: rowA.subject_id,
                            first_name: rowA.first_name,
                            last_name: rowA.last_name,
                            test_id: rowB.test_id,
                        };
                    }
                )
                ;

            expect(df_merged.getIndex().take(9).toArray()).to.eql([
                0, 1, 2, 3, 4, 5, 6, 7, 8,
            ]);

            expect(df_merged.getColumnNames()).to.eql([
                'subject_id',
                'first_name',
                'last_name',
                "test_id",
            ]);

            expect(df_merged.toRows()).to.eql([
                [1, 'Alex', 'Anderson', 51],
                [2, 'Amy', 'Ackerman', 15],
                [3, 'Allen', 'Ali', 15],
                [4, 'Alice', 'Aoni', 61],
                [5, 'Ayoung', 'Aitches', 16],
                [4, 'Billy', 'Bonder', 61], // Note this is slighly different to the ordering from Pandas.
                [5, 'Brian', 'Black', 16],
                [7, 'Bryce', 'Brice', 14],
                [8, 'Betty', 'Btisan', 15],
            ]);
        });

        it('Merge two dataframes along the subject_id value', function () {

            var df_new = dataForge.concatDataFrames([df_a, df_b]);
            var df_merged = df_new.join(
                    df_n,
                    left => left.subject_id,
                    right => right.subject_id,
                    (left, right) => {
                        return {
                            subject_id: left.subject_id,
                            first_name: left.first_name,
                            last_name: left.last_name,
                            test_id: right.test_id,
                        };
                    }
                )
                ;

            expect(df_merged.getIndex().take(9).toArray()).to.eql([
                0, 1, 2, 3, 4, 5, 6, 7, 8,
            ]);

            expect(df_merged.getColumnNames()).to.eql([
                'subject_id',
                'first_name',
                'last_name',
                "test_id",
            ]);

            expect(df_merged.toRows()).to.eql([
                [1, 'Alex', 'Anderson', 51],
                [2, 'Amy', 'Ackerman', 15],
                [3, 'Allen', 'Ali', 15],
                [4, 'Alice', 'Aoni', 61],
                [5, 'Ayoung', 'Aitches', 16],
                [4, 'Billy', 'Bonder', 61],  // Note this is slighly different to the ordering from Pandas.
                [5, 'Brian', 'Black', 16],
                [7, 'Bryce', 'Brice', 14],
                [8, 'Betty', 'Btisan', 15],
            ]);

        });

        // Exactly the same as the previous example.
        it('Merge two dataframes with both the left and right dataframes using the subject_id key', function () {

            var df_new = dataForge.concatDataFrames([df_a, df_b]);
            var df_merged = df_new.join(
                    df_n,
                    left => left.subject_id,
                    right => right.subject_id,
                    (left, right) => {
                        return {
                            subject_id: left.subject_id,
                            first_name: left.first_name,
                            last_name: left.last_name,
                            test_id: right.test_id,
                        };
                    }
                )
                ;

            expect(df_merged.getIndex().take(9).toArray()).to.eql([
                0, 1, 2, 3, 4, 5, 6, 7, 8,
            ]);

            expect(df_merged.getColumnNames()).to.eql([
                'subject_id',
                'first_name',
                'last_name',
                "test_id",
            ]);

            expect(df_merged.toRows()).to.eql([
                [1, 'Alex', 'Anderson', 51],
                [2, 'Amy', 'Ackerman', 15],
                [3, 'Allen', 'Ali', 15],
                [4, 'Alice', 'Aoni', 61],
                [5, 'Ayoung', 'Aitches', 16],
                [4, 'Billy', 'Bonder', 61],   // Note this is slighly different to the ordering from Pandas.
                [5, 'Brian', 'Black', 16],
                [7, 'Bryce', 'Brice', 14],
                [8, 'Betty', 'Btisan', 15],
            ]);
        });

        it('Merge with outer join', function () {

            var df_merged = df_a.joinOuter(
                    df_b,
                    left => left.subject_id,
                    right => right.subject_id,
                    (left, right) => {
                        var output = {};
                        if (left) {
                            output.subject_id = left.subject_id;
                            output.first_name_x = left.first_name;
                            output.last_name_x = left.last_name;                            
                        }
                        if (right) {
                            output.subject_id = right.subject_id;
                            output.first_name_y = right.first_name;
                            output.last_name_y = right.last_name;                            
                        }
                        return output;
                    }
                )
                ;

            expect(df_merged.getIndex().take(8).toArray()).to.eql([
                0, 1, 2, 3, 4, 5, 6, 7
            ]);

            expect(df_merged.getColumnNames()).to.eql([
                'subject_id',
                'first_name_x',
                'last_name_x',
                'first_name_y',
                'last_name_y',
            ]);

            expect(df_merged.toRows()).to.eql([
                [1, 'Alex', 'Anderson', undefined, undefined],
                [2, 'Amy', 'Ackerman', undefined, undefined],
                [3, 'Allen', 'Ali', undefined, undefined],
                [4, 'Alice', 'Aoni', 'Billy', 'Bonder'],
                [5, 'Ayoung', 'Aitches', 'Brian', 'Black'],
                [6, undefined, undefined, 'Bran', 'Balwner'],
                [7, undefined, undefined, 'Bryce', 'Brice'],
                [8, undefined, undefined, 'Betty', 'Btisan'],
            ]);
        });

        it('Merge with inner join', function () {

            var df_merged = df_a.join(
                    df_b,
                    left => left.subject_id,
                    right => right.subject_id,
                    (left, right) => {
                        return {
                            subject_id: left.subject_id,
                            first_name_x: left.first_name,
                            last_name_x: left.last_name,
                            first_name_y: right.first_name,
                            last_name_y: right.last_name,
                        };
                    }
                )
                ;

            expect(df_merged.getIndex().take(2).toArray()).to.eql([
                0, 1,
            ]);

            expect(df_merged.getColumnNames()).to.eql([
                'subject_id',
                'first_name_x',
                'last_name_x',
                'first_name_y',
                'last_name_y',
            ]);

            expect(df_merged.toRows()).to.eql([
                [4, 'Alice', 'Aoni', 'Billy', 'Bonder'],
                [5, 'Ayoung', 'Aitches', 'Brian', 'Black'],
            ]);
        });

        it('Merge with right join', function () {

            var df_merged = df_a.joinOuterRight(
                    df_b,
                    left => left.subject_id,
                    right => right.subject_id,
                    (left, right) => {
                        var output = {};
                        if (left) {
                            output.subject_id = left.subject_id;
                            output.first_name_x = left.first_name;
                            output.last_name_x = left.last_name;                            
                        }
                        if (right) {
                            output.subject_id = right.subject_id;
                            output.first_name_y = right.first_name;
                            output.last_name_y = right.last_name;                            
                        }
                        return output;
                    }
                )
                ;

            expect(df_merged.getIndex().take(5).toArray()).to.eql([
                0, 1, 2, 3, 4,
            ]);

            expect(df_merged.getColumnNames()).to.eql([
                'subject_id',
                'first_name_x',
                'last_name_x',
                'first_name_y',
                'last_name_y',
            ]);

            expect(df_merged.toRows()).to.eql([
                [4, 'Alice', 'Aoni', 'Billy', 'Bonder'],
                [5, 'Ayoung', 'Aitches', 'Brian', 'Black'],
                [6, undefined, undefined, 'Bran', 'Balwner'],
                [7, undefined, undefined, 'Bryce', 'Brice'],
                [8, undefined, undefined, 'Betty', 'Btisan'],
            ]);
        });

        it('Merge with left join', function () {

            var df_merged = df_a.joinOuterLeft(
                    df_b,
                    left => left.subject_id,
                    right => right.subject_id,
                    (left, right) => {
                        var output = {};
                        if (left) {
                            output.subject_id = left.subject_id;
                            output.first_name_x = left.first_name;
                            output.last_name_x = left.last_name;                            
                        }
                        if (right) {
                            output.subject_id = right.subject_id;
                            output.first_name_y = right.first_name;
                            output.last_name_y = right.last_name;                            
                        }
                        return output;
                    }
                )
                ;

            expect(df_merged.getIndex().take(5).toArray()).to.eql([
                0, 1, 2, 3, 4,
            ]);

            expect(df_merged.getColumnNames()).to.eql([
                'subject_id',
                'first_name_x',
                'last_name_x',
                'first_name_y',
                'last_name_y',
            ]);

            expect(df_merged.toRows()).to.eql([
                [1, 'Alex', 'Anderson', undefined, undefined],
                [2, 'Amy', 'Ackerman', undefined, undefined],
                [3, 'Allen', 'Ali', undefined, undefined],
                [4, 'Alice', 'Aoni', 'Billy', 'Bonder'],
                [5, 'Ayoung', 'Aitches', 'Brian', 'Black'],
            ]);
        });
        
        it('Merge while adding a suffix to duplicate column names', function () {

            var df_merged = df_a.joinOuterLeft(
                    df_b,
                    left => left.subject_id,
                    right => right.subject_id,
                    (left, right) => {
                        var output = {};
                        if (left) {
                            output.subject_id = left.subject_id;
                            output.first_name_left = left.first_name;
                            output.last_name_left = left.last_name;                            
                        }
                        if (right) {
                            output.subject_id = right.subject_id;
                            output.first_name_right = right.first_name;
                            output.last_name_right = right.last_name;                            
                        }
                        return output;
                    }
                )
                ;

            expect(df_merged.getIndex().take(5).toArray()).to.eql([
                0, 1, 2, 3, 4,
            ]);

            expect(df_merged.getColumnNames()).to.eql([
                'subject_id',
                'first_name_left',
                'last_name_left',
                'first_name_right',
                'last_name_right',
            ]);

            expect(df_merged.toRows()).to.eql([
                [1, 'Alex', 'Anderson', undefined, undefined],
                [2, 'Amy', 'Ackerman', undefined, undefined],
                [3, 'Allen', 'Ali', undefined, undefined],
                [4, 'Alice', 'Aoni', 'Billy', 'Bonder'],
                [5, 'Ayoung', 'Aitches', 'Brian', 'Black'],
            ]);
        });

        it('Merge based on indexes', function () {

               var df_merged = df_a.join(
                    df_b,
                    (left, index) => index,
                    (right, index) => index,
                    (left, right) => {
                        return {
                            subject_id_x: left.subject_id,
                            first_name_x: left.first_name,
                            last_name_x: left.last_name,
                            subject_id_y: right.subject_id,
                            first_name_y: right.first_name,
                            last_name_y: right.last_name,
                        };
                    }
                )
                ;

            expect(df_merged.getIndex().take(5).toArray()).to.eql([
                0, 1, 2, 3, 4,
            ]);

            expect(df_merged.getColumnNames()).to.eql([
                'subject_id_x',
                'first_name_x',
                'last_name_x',
                'subject_id_y',
                'first_name_y',
                'last_name_y',
            ]);

            expect(df_merged.toRows()).to.eql([
                [1, 'Alex', 'Anderson', 4, 'Billy', 'Bonder'],
                [2, 'Amy', 'Ackerman', 5, 'Brian', 'Black'],
                [3, 'Allen', 'Ali', 6, 'Bran', 'Balwner'],
                [4, 'Alice', 'Aoni', 7, 'Bryce', 'Brice'],
                [5, 'Ayoung', 'Aitches', 8, 'Betty', 'Btisan'],
            ]);
        });

    })


});