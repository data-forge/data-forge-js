Plugins 
=======

Data sources
    File
    Browser rest api
    Nodejs rest api

Data formats
    csv
    json
    xml
    yaml
    text file with reg ex to pull out columns?   
    html

Other Plugins
    Mongodb
    SQL
   

What do I want to do?

    Read X file
    Write X file
    Convert to X data format
    Convert from X data

--------------------

Examples
========

var dataForge = require('data-forge');
dataForge.use(require('data-forge-file'));
dataForge.use(require('data-forge-http'));
dataForge.use(require('data-forge-csv'));
dataForge.use(require('data-forge-json'));

var dataFrame = dataForge
    .readFileSync('somefile.csv') <-- File plugin.
    .parseCSV()                   <-- CSV plugin.

dataFrame.asCSV().writeFileSync('somefile.csv');

var dataFrame = dataForge
    .readFileSync('somefile.json')
    .parseJSON() <-- Plugin register this

dataFrame.asJSON().writeFileSync('somefile.csv');

dataFrame.asJSON().writeFile('somefile.csv');

dataForge
    .httpGet('some/rest/api') <-- Rest API plugin.
    .parseCSV()                 <-- CSV plugin.
    .then(dataFrame => {
        ... transform ...
        return dataFrame.asCSV().httpPost('some/rest/api');
    })
    ;

dataForge
    .httpGet('some/rest/api') <-- Rest API plugin.
    .parseJSON() <-- JSON plugin.     
    .then(dataFrame => {
        ...
    })
    ;

dataFrame.asJSON().httpPost('some/rest/api');

--------------------------

File plugin
===========

????

module.exports = function (dataForge) {

    dataForge.readFileSync = function (filePath) {
        ...
        return fs.readFileSync('...');
    };

    dataForge.registerDataSource('sync-file', {
        readFileSync = function (filePath) {
            ...
            return fs.readFileSync('...');
        },

        writeFileSync: function (dataFrame) {
            ....
        },
    });
};


------------------------------------

CSV plugin
==========

module.exports = function (dataForge) {

    dataForge.registerDataFormat('CSV', {

        parse: function (data) {
            // convert data to a dataframe and return.
        },

        stringify: function (dataFrame) {
            // convert to csv and return.
        },
    });

};

------------------------------------

Mongodb plugin
==========

module.exports = function (dataForge) {

    // [<host>:<port>/] <database>/<collection>


    dataForge.requestMongodb = function (connectionString, query, projection, sortParams) {
        return db[collectionName].find(query, projection).sort(sortParams)
            .toArray()
            .then(documents => new dataForge.DataFrame({ values: documents })
            ;
    };  

    dataForge.DataFrame.prototype.saveMongodb = function (connectionString, replace) {
        var self = this;
        //
    };

};
