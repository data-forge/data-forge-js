'use strict';

//
// Tests for reading/writing various (mocked) data sources.
//

var expect = require('chai').expect;

var mock = require('mock-require');

var dataForge = require('../index');	

describe('data sources - csv', function () {

    afterEach(function () {
        mock.stop('fs');
        mock.stop('request-promise');
    });

    it('can read CSV file asynchronously', function () {

        var testFilePath = "some/file.csv"
        var testCsvData 
            = "Col1,Col2\r\n"
            + "1,2\r\n"
            + "3,4"
            ; 

        mock('fs', { 
            readFile: function(filePath, dataFormat, callback) {
                expect(filePath).to.eql(testFilePath);
                expect(dataFormat).to.eql('utf8');

                callback(null, testCsvData);
            },
        });
        
        return dataForge
            .readFile(testFilePath)
            .parseCSV()
            .then(dataFrame => {
                expect(dataFrame.toCSV()).to.eql(testCsvData);
            })
            ;
    });

    it('can read CSV file synchronously', function () {

        var testFilePath = "some/file.csv"
        var testCsvData 
            = "Col1,Col2\r\n"
            + "1,2\r\n"
            + "3,4"
            ; 

        mock('fs', { 
            readFileSync: function(filePath, dataFormat) {
                expect(filePath).to.eql(testFilePath);
                expect(dataFormat).to.eql('utf8');

                return testCsvData;
            },
        });
        
        var dataFrame = dataForge.readFileSync(testFilePath).parseCSV();
        expect(dataFrame.toCSV()).to.eql(testCsvData);
    });

    it('can http get CSV file asynchronously', function () {

        var testUrl = "some/url"
        var testCsvData 
            = "Col1,Col2\r\n"
            + "1,2\r\n"
            + "3,4"
            ; 

        mock('request-promise', { 
            get: function(options) {
                expect(options.uri).to.eql(testUrl);

                return Promise.resolve(testCsvData);
            },
        });
        
        return dataForge
            .httpGet(testUrl)
            .parseCSV()
            .then(dataFrame => {
                expect(dataFrame.toCSV()).to.eql(testCsvData);
            })
            ;
    });

    it('can write CSV file asynchronously', function () {

        var testFilePath = "some/file.csv"
        var testCsvData 
            = "Col1,Col2\r\n"
            + "1,2\r\n"
            + "3,4"
            ; 
        var dataFrame = dataForge.fromCSV(testCsvData);

        mock('fs', { 
            writeFile: function(filePath, fileData, callback) {
                expect(filePath).to.eql(testFilePath);
                expect(fileData).to.eql(testCsvData);

                callback(null);
            },
        });
        
        return dataFrame
            .asCSV()
            .writeFile(testFilePath)            
            ;

    });

    it('can write CSV file synchronously', function () {

        var testFilePath = "some/file.csv"
        var testCsvData 
            = "Col1,Col2\r\n"
            + "1,2\r\n"
            + "3,4"
            ; 
        var dataFrame = dataForge.fromCSV(testCsvData);

        mock('fs', { 
            writeFileSync: function(filePath, fileData) {
                expect(filePath).to.eql(testFilePath);
                expect(fileData).to.eql(testCsvData);
            },
        });
        
        dataFrame.asCSV().writeFileSync(testFilePath);
    });

    it('can http post CSV file asynchronously', function () {

        var testUrl = "some/url"
        var testCsvData 
            = "Col1,Col2\r\n"
            + "1,2\r\n"
            + "3,4"
            ;            
        var dataFrame = dataForge.fromCSV(testCsvData);

        mock('request-promise', { 
            post: function(options) {
                expect(options.uri).to.eql(testUrl);
                expect(options.body).to.eql(testCsvData);
                expect(options.headers).to.eql({
                    "content-type": "text/csv",
                });

                return Promise.resolve();
            },
        });
        
        return dataFrame
            .asCSV()
            .httpPost(testUrl)
            ;
    });

});