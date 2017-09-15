'use strict';

//
// Tests for reading/writing various (mocked) data sources.
//

var expect = require('chai').expect;

var mock = require('mock-require');

var dataForge = require('../index');	

describe('data sources - json', function () {

    afterEach(function () {
        mock.stop('fs');
        mock.stop('request-promise');
    });
    
    it('can read JSON file asynchronously', function () {

        var testFilePath = "some/file.json"
        var testJsonData = JSON.stringify([
            {
                Col1: 1,
                Col2: 2,
            },
            {
                Col1: 3,
                Col2: 4,
            },
        ], null, 4);
            

        mock('fs', { 
            readFile: function(filePath, dataFormat, callback) {
                expect(filePath).to.eql(testFilePath);
                expect(dataFormat).to.eql('utf8');

                callback(null, testJsonData);
            },
        });
        
        return dataForge
            .readFile(testFilePath)
            .parseJSON()
            .then(dataFrame => {
                expect(dataFrame.toJSON()).to.eql(testJsonData);
            })
            ;
    });

    it('can read JSON file synchronously', function () {

        var testFilePath = "some/file.json"
        var testJsonData = JSON.stringify([
            {
                Col1: 1,
                Col2: 2,
            },
            {
                Col1: 3,
                Col2: 4,
            },
        ], null, 4);

        mock('fs', { 
            readFileSync: function(filePath, dataFormat) {
                expect(filePath).to.eql(testFilePath);
                expect(dataFormat).to.eql('utf8');

                return testJsonData;
            },
        });
        
        var dataFrame = dataForge.readFileSync(testFilePath).parseJSON();
        expect(dataFrame.toJSON()).to.eql(testJsonData);
    });

    it('can http get JSON file asynchronously', function () {

        var testUrl = "some/url";
        var testData = [
            {
                Col1: 1,
                Col2: 2,
            },
            {
                Col1: 3,
                Col2: 4,
            },
        ];

        mock('request-promise', { 
            get: function(options) {
                expect(options.uri).to.eql(testUrl);
                expect(options.json).to.eql(true);

                return Promise.resolve(testData);
            },
        });
        
        return dataForge
            .httpGet(testUrl)
            .parseJSON()
            .then(dataFrame => {
                expect(dataFrame.toArray()).to.eql(testData);
            })
            ;
    });

    it('can write JSON file asynchronously', function () {

        var testFilePath = "some/file.json"
        var testJsonData = JSON.stringify([
            {
                Col1: 1,
                Col2: 2,
            },
            {
                Col1: 3,
                Col2: 4,
            },
        ], null, 4);
        var dataFrame = dataForge.fromJSON(testJsonData);

        mock('fs', { 
            writeFile: function(filePath, fileData, callback) {
                expect(filePath).to.eql(testFilePath);
                expect(fileData).to.eql(testJsonData);

                callback(null);
            },
        });
        
        return dataFrame
            .asJSON()
            .writeFile(testFilePath)            
            ;

    });

    it('can write JSON file synchronously', function () {

        var testFilePath = "some/file.json"
        var testJsonData = JSON.stringify([
            {
                Col1: 1,
                Col2: 2,
            },
            {
                Col1: 3,
                Col2: 4,
            },
        ], null, 4);
        var dataFrame = dataForge.fromJSON(testJsonData);

        mock('fs', { 
            writeFileSync: function(filePath, fileData) {
                expect(filePath).to.eql(testFilePath);
                expect(fileData).to.eql(testJsonData);
            },
        });
        
        dataFrame.asJSON().writeFileSync(testFilePath);
    });

    it('can http post JSON file asynchronously', function () {

        var testUrl = "some/url"
        var testData = [
            {
                Col1: 1,
                Col2: 2,
            },
            {
                Col1: 3,
                Col2: 4,
            },
        ];
        var dataFrame = new dataForge.DataFrame(testData);

        mock('request-promise', { 
            post: function(options) {
                expect(options.uri).to.eql(testUrl);
                expect(options.body).to.eql(testData);
                expect(options.json).to.eql(true);
                expect(options.headers).to.eql({
                    "content-type": "application/json",
                });

                return Promise.resolve();
            },
        });
        
        return dataFrame
            .asJSON()
            .httpPost(testUrl)
            ;
    });

});