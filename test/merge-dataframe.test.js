'use strict';

//
// These tests based on these examples:
//
//  http://chrisalbon.com/python/pandas_join_merge_dataframe.html
//

describe('merge-examples', function () {

    var expect = require('chai').expect;

    var dataForge = require('../index');

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

        var df_new = dataForge.concat([df_a, df_b]);

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

        var df_new = dataForge.concat([df_a, df_b], { axis: 1 });

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

    /*
    it('Merge two dataframes along the subject_id value', function () {

        var df_new = dataForge.concat([df_a, df_b]);
        var df_merged = dataForge.merge(df_new, df_n, 'subject_id');

        expect(df_merged.getColumnNames()).to.eql([
            'subject_id',
            'first_name',
            'last_name',
            "test_id",
        ]);

        expect(df_new.toRows()).to.eql([
            [1, 'Alex', 'Anderson', 51],
            [2, 'Amy', 'Ackerman', 15],
            [3, 'Allen', 'Ali', 15],
            [4, 'Alice', 'Aoni', 61],
            [4, 'Billy', 'Bonder', 61],
            [5, 'Ayoung', 'Aitches', 16],
            [5, 'Brian', 'Black', 16],
            [7, 'Bryce', 'Brice', 14],
            [8, 'Betty', 'Btisan', 15],
        ]);

    });

    it('Merge two dataframes along the subject_id value', function () {

        var df_new = dataForge.concat([df_a, df_b]);
        var df_merged = dataForge.merge(df_new, df_n, {
            on: 'subject_id'
        });

        expect(df_merged.getColumnNames()).to.eql([
            'subject_id',
            'first_name',
            'last_name',
            "test_id",
        ]);

        expect(df_new.toRows()).to.eql([
            [1, 'Alex', 'Anderson', 51],
            [2, 'Amy', 'Ackerman', 15],
            [3, 'Allen', 'Ali', 15],
            [4, 'Alice', 'Aoni', 61],
            [4, 'Billy', 'Bonder', 61],
            [5, 'Ayoung', 'Aitches', 16],
            [5, 'Brian', 'Black', 16],
            [7, 'Bryce', 'Brice', 14],
            [8, 'Betty', 'Btisan', 15],
        ]);

    });

    it('Merge two dataframes with both the left and right dataframes using the subject_id key', function () {

        var df_new = dataForge.concat([df_a, df_b]);
        var df_merged = dataForge.merge(df_new, df_n, {
            left: 'subject_id',
            right: 'subject_id',
        });

        expect(df_merged.getColumnNames()).to.eql([
            'subject_id',
            'first_name',
            'last_name',
            "test_id",
        ]);

        expect(df_new.toRows()).to.eql([
            [1, 'Alex', 'Anderson', 51],
            [2, 'Amy', 'Ackerman', 15],
            [3, 'Allen', 'Ali', 15],
            [4, 'Alice', 'Aoni', 61],
            [4, 'Billy', 'Bonder', 61],
            [5, 'Ayoung', 'Aitches', 16],
            [5, 'Brian', 'Black', 16],
            [7, 'Bryce', 'Brice', 14],
            [8, 'Betty', 'Btisan', 15],
        ]);
    });

    it('Merge with outer join', function () {

        var df_merged = dataForge.merge(df_a, df_b, {
            on: 'subject_id',
            how: 'outer',
        });

        expect(df_merged.getColumnNames()).to.eql([
            'subject_id',
            'first_name_x',
            'last_name_x',
            'first_name_y',
            'last_name_y',
        ]);

        expect(df_new.toRows()).to.eql([
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

        var df_merged = dataForge.merge(df_a, df_b, {
            on: 'subject_id',
            how: 'inner',
        });

        expect(df_merged.getColumnNames()).to.eql([
            'subject_id',
            'first_name_x',
            'last_name_x',
            'first_name_y',
            'last_name_y',
        ]);

        expect(df_new.toRows()).to.eql([
            [4, 'Alice', 'Aoni', 'Billy', 'Bonder'],
            [5, 'Ayoung', 'Aitches', 'Brian', 'Black'],
        ]);
    });

    it('Merge with right join', function () {

        var df_merged = dataForge.merge(df_a, df_b, {
            on: 'subject_id',
            how: 'right',
        });

        expect(df_merged.getColumnNames()).to.eql([
            'subject_id',
            'first_name_x',
            'last_name_x',
            'first_name_y',
            'last_name_y',
        ]);

        expect(df_new.toRows()).to.eql([
            [4, 'Alice', 'Aoni', 'Billy', 'Bonder'],
            [5, 'Ayoung', 'Aitches', 'Brian', 'Black'],
            [6, undefined, undefined, 'Bran', 'Balwner'],
            [7, undefined, undefined, 'Bryce', 'Brice'],
            [8, undefined, undefined, 'Betty', 'Btisan'],
        ]);
    });

    it('Merge with left join', function () {

        var df_merged = dataForge.merge(df_a, df_b, {
            on: 'subject_id',
            how: 'left',
        });

        expect(df_merged.getColumnNames()).to.eql([
            'subject_id',
            'first_name_x',
            'last_name_x',
            'first_name_y',
            'last_name_y',
        ]);

        expect(df_new.toRows()).to.eql([
            [1, 'Alex', 'Anderson', undefined, undefined],
            [2, 'Amy', 'Ackerman', undefined, undefined],
            [3, 'Allen', 'Ali', undefined, undefined],
            [4, 'Alice', 'Aoni', 'Billy', 'Bonder'],
            [5, 'Ayoung', 'Aitches', 'Brian', 'Black'],
        ]);
    });
    
    it('Merge while adding a suffix to duplicate column names', function () {

        var df_merged = dataForge.merge(df_a, df_b, {
            on: 'subject_id',
            how: 'left',
            suffixes: ['_left', '_right],
        });

        expect(df_merged.getColumnNames()).to.eql([
            'subject_id',
            'first_name_left',
            'last_name_left',
            'first_name_right',
            'last_name_right',
        ]);

        expect(df_new.toRows()).to.eql([
            [1, 'Alex', 'Anderson', undefined, undefined],
            [2, 'Amy', 'Ackerman', undefined, undefined],
            [3, 'Allen', 'Ali', undefined, undefined],
            [4, 'Alice', 'Aoni', 'Billy', 'Bonder'],
            [5, 'Ayoung', 'Aitches', 'Brian', 'Black'],
        ]);
    });

    it('Merge based on indexes', function () {

        var df_merged = dataForge.merge(df_a, df_b);

        expect(df_merged.getColumnNames()).to.eql([
            'subject_id_x',
            'first_name_x',
            'last_name_x',
            'subject_id_y',
            'first_name_y',
            'last_name_y',
        ]);

        expect(df_new.toRows()).to.eql([
            [1, 'Alex', 'Anderson', 4, 'Billy', 'Bonder'],
            [2, 'Amy', 'Ackerman', 5, 'Brian', 'Black'],
            [3, 'Allen', 'Ali', 6, 'Bran', 'Balwner'],
            [4, 'Alice', 'Aoni', 7, 'Bryce', 'Brice'],
            [5, 'Ayoung', 'Aitches', 8, 'Betty', 'Btisan'],
        ]);
    });
    */
});