# data-forge

JavaScript data transformation and analysis toolkit inspired by Pandas and LINQ.

Works in both NodeJS and the browser. 

[Also available for C#](https://github.com/Real-Serious-Games/data-forge-cs).

----------

This project is a work in progress, please don't use unless you want to be an early adopter. Please expect API changes. Please contribute and help guide the direction of *data-forge*.

# Generated API docs

See here for [generated API docs](./docs/api.md) that are taking shape.

# Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Project Aims](#project-aims)
- [Driving Principles](#driving-principles)
- [Implementation](#implementation)
- [Installation](#installation)
  - [NodeJS installation and setup](#nodejs-installation-and-setup)
    - [Data-Forge plugins under Node.js](#data-forge-plugins-under-nodejs)
  - [Browser installation and setup](#browser-installation-and-setup)
    - [Data-Forge plugins under the browser](#data-forge-plugins-under-the-browser)
  - [Getting the code](#getting-the-code)
- [Key Concepts](#key-concepts)
  - [Data Frame](#data-frame)
  - [Row](#row)
  - [Column](#column)
  - [Index](#index)
  - [Lazy Evaluation](#lazy-evaluation)
  - [Iterator](#iterator)
- [Basic Usage](#basic-usage)
  - [Creating a Data Frame](#creating-a-data-frame)
  - [Setting an index](#setting-an-index)
- [Working with data](#working-with-data)
  - [Enumerating rows](#enumerating-rows)
  - [Enumerating columns](#enumerating-columns)
  - [Enumerating the index](#enumerating-the-index)
  - [Direct column access](#direct-column-access)
  - [Adding a column](#adding-a-column)
  - [Replacing a column](#replacing-a-column)
  - [Removing a column](#removing-a-column)
- [Immutability and Chained Functions](#immutability-and-chained-functions)
- [Data exploration and visualization](#data-exploration-and-visualization)
  - [Console output](#console-output)
  - [Visual output](#visual-output)
- [Data transformation](#data-transformation)
  - [Data frame transformation](#data-frame-transformation)
  - [Column transformation](#column-transformation)
  - [Data frame and column filtering](#data-frame-and-column-filtering)
  - [LINQ functions](#linq-functions)
  - [Data frame aggregation](#data-frame-aggregation)
  - [Data frame window](#data-frame-window)
- [Examples](#examples)
  - [Working with CSV files](#working-with-csv-files)
  - [Working with JSON files](#working-with-json-files)
  - [Working a massive CSV file](#working-a-massive-csv-file)
  - [Working with a MongoDB collection](#working-with-a-mongodb-collection)
  - [Working with a massive MongoDB collection](#working-with-a-massive-mongodb-collection)
  - [Working with HTTP](#working-with-http)
  - [Working with HTTP in the browser](#working-with-http-in-the-browser)
  - [Working with HTTP in AngularJS](#working-with-http-in-angularjs)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Project Aims

The aims of this project:

- To combine the best aspects of [Pandas](https://en.wikipedia.org/wiki/Pandas_(software)) and [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query) and make them available in JavaScript and C#.
- To be able to load data, transform and save data.
- To be able to prepare data for visualization. 
- Be able to load massive data files.

# Driving Principles 

The principles that drive decision making and tradeoffs:

- Simple, easy to learn, easy to use.
- Minimize the magic, everything should be understandable, the API should be orthogonal.
- High performance.
- Be able to use the same (or very similar) API in both Javascript and C#.
- The code you build during interactive data exploration should be transplantable to an app or microservice.

# Implementation

General implementation goals:

- Immutable, every operation generates a new immutable data set.
- Lazy evaluation, to make the performance of immutability acceptable.
- Extensible via plugins for data sources and formats.


----------

The rest of the README defines the setup and usage of Data-Forge. Certain features described here are not implemented yet. 

# Installation

## NodeJS installation and setup

Install via [NPM](https://en.wikipedia.org/wiki/Npm_(software)): 

	npm install --save data-forge

Require the module into your script:

	var dataForge = require('data-forge');

### Data-Forge plugins under Node.js

Plugins are typically loaded into the Data-Forge namespace as follows, using [*data-forge-from-yahoo*](https://www.npmjs.com/package/data-forge-from-yahoo) as an example. 

Install via NPM:

	npm install --save data-forge-from-yahoo

Required and *use*:

	var dataForge = require('data-forge');
	dataForge.use(require('data-forge-from-yahoo'));

You can use functions defined by the plugin, eg

	dataForge.fromYahoo('MSFT')
		.then(function (dataFrame) {
			// ... use the data returned from Yahoo ...
		}); 

## Browser installation and setup

Install via [Bower](https://en.wikipedia.org/wiki/Bower_(software)):

	bower install --save data-forge

Include the main script in your HTML file:

	<script src="bower_components/data-forge/data-forge.js"></script>

You can now access the global `dataForge` variable.

### Data-Forge plugins under the browser

As in the Node.js example, plugins are typically loaded into the Data-Forge namespace. Example using [*data-forge-from-yahoo*](https://www.npmjs.com/package/data-forge-from-yahoo). 

Install via Bower:

	bower install --save data-forge-from-yahoo

Include in your HTML file:

	<script src="bower_components/data-forge/data-forge.js"></script>
	<script src="bower_components/data-forge-from-yahoo/data-forge-from-yahoo.js"></script>

Use functions defined by the plugin, eg:
 
	dataForge.fromYahoo('MSFT')
		.then(function (dataFrame) {
			// ... use the data returned from Yahoo ...
		}); 

## Getting the code

Install via NPM and Bower as described in previous sections or clone, fork or download the code from GitHub:

[https://github.com/Real-Serious-Games/data-forge-js](https://github.com/Real-Serious-Games/data-forge-js)


# Key Concepts

This section explains the key concepts of *Data-Forge*.

## Data Frame

This is the *main* concept. A matrix of data structured as rows and columns. Can be considered a sequence of rows. Has an implicit or explicit index. Think of it as a spreadsheet in memory. 

## Row

A single row of data in a *data frame*. Contains a slice of data across columns. Has an implicit or explicit index. An JavaScript object or an array of values is associated with each row.

## Column

A single *named* column of data in a *data frame*. Contains a slice of data through all rows. A sequence of values is associated with a column. All values in a column are generally expected to have the same type, although this is not a requirement of *data-forge-js*. 

## Index 

Used to index a data frame for operations such as *merge*. If not specified an integer index (starting at 0) is generated based on row position. An index can be explicitly set by promoting a column to an index.

## Lazy Evaluation

Data frames and columns are only fully evaluated when necessary. Operations that are applied to data frames and columns are queued up and only executed when the full data is required, for example when serializing to csv or json (`toCSV` or `toJSON`) or when baking to values (`toValues` or `toObjects`). A data frame or column can be forcibly evaluated by calling the `bake` function. 

## Iterator

An object that iterates the rows of a data frame or column. Iterators allow lazy evaluation (row by row evaluation) of data frames and columns. This is the same concept as an [iterator in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) or an [enumerator in C#](https://msdn.microsoft.com/en-us/library/system.collections.ienumerator(v=vs.110).aspx).

# Basic Usage 

## Creating a Data Frame

The DataFrame constructor is passed a *config* object that specifies the initial contents of the data frame. 

Create a data frame from column names and rows:

	var dataFrame = new dataForge.DataFrame({
			columnNames: ["Col1", "Col2", "Col3"],
			rows: [
				[1, 'hello', new Date(...)],
				[5, 'computer', new Date(...)],
				[10, 'good day', new Date(...)]
			]
		});

A data frame can also be created from an array of JavaScript objects:

	var dataFrame = new dataForge.DataFrame({
			rows: [
				{
					Col1: 1,
					Col2: 'hello',
					Col3: new Date(....)
				},
				{
					Col1: 5,
					Col2: 'computer',
					Col3: new Date(....)
				},
				{
					Col1: 10,
					Col2: 'good day',
					Col3: new Date(....)
				}
			]
		});

## Setting an index

The previous examples each generated an index with the values *0, 1, 2*.

An index can explicitly be provided when creating a data frame:

	var dataFrame = new dataForge.DataFrame({
			columnNames: <column-names>,
			rows: <rows>,
			index: new dataForge.Index([5, 10, 100])
		});

Or an existing column can be promoted to an index:
 
	var dataFrame = new dataForge.DataFrame(someConfig).setIndex("Col3");

Be aware that promoting a column to an index in Data-Forge doesn't remove the column (as it does in Pandas). You can easily achieve this by calling `dropColumn`:

	var dataFrame = new dataForge.DataFrame(someConfig).setIndex("Col3").dropColumn("Col3");

An index is required for certain operations like `merge`.

# Working with data

Data-Forge has built-in support for serializing and deserializing common data formats.

## CSV 

	var dataFrame = dataForge.fromCSV("<csv-string-data>");

	var csvTextData = dataFrame.toCSV();

## JSON

	var dataFrame = dataForge.fromJSON("<json-string-data>");

	var jsonTextData = dataFrame.toJSON();

## XML

	var dataFrame = dataForge.fromXML("<xml-string-data>");

	var xmlTextData = dataFrame.toXML();

## YAML

	var dataFrame = dataForge.fromYAML("<yaml-string-data>");

	var yamlTextData = dataFrame.toYAML();

## Reading and writing files in Node.js

The *from* / *to* functions can be used in combination with Node.js `fs` functions for reading and writing files, eg:

	var fs = require('fs');

	var dataFrame = dataForge.fromCSV(fs.readFileSync('some-csv-file.csv', 'utf8'));

	fs.writeFileSync('some-other-csv-file.csv', dataFrame.toCSV());

See the [examples section](#examples) for examples of loading various data sources and formats.

## Enumerating rows

Rows can be extracted from a data frame in several ways.

First we can lazily iterate using an iterator. This is the lowest-level method of accessing the rows of a data frame. Using iterators allows data frames and columns to be lazily evaluated (same as with LINQ in C#).

	var iterator = dataFrame.getIterator();
	while (iterator.moveNext()) {
		var row = iterator.getCurrent();
		// do something with the row.
	}

There are higher-level ways to extract the rows. Under the hood these use iterators. These force lazy evaluation to complete (like the *toArray* function in LINQ).

	var arrayOfArrays = dataFrame.toValues();

and

	var arrayOfObjects = dataFrame.toObjects();

Create a new data frame from a subset of rows:

	var startIndex = ... // Starting row index to include in subset. 
	var endIndex = ... // Ending row index to include in subset.
	var rowSubset = dataFrame.getRowsSubset(startIndex, endIndex);

## Enumerating columns

Get the names of the columns:

	var arrayOfColumnNames = dataFrame.getColumnNames();

Get an array of all columns:

	var arrayOfColumns = dataFrame.getColumns();

Use an iterator to lazily iterate an individual column:

	var iterator = someColumn.getIterator();
	while (iterator.moveNext()) {
		var row = iterator.getCurrent();
		// do something with the row.
	}

Slice out an array of values for an individual column. Note that this could be an expensive operation. 
Lazy evaluation of the entire data frame will be forced to complete.  

	var arrayOfValues = someColumn.toValues();

Create a new data frame from a sub-set of columns:

	var columnSubset = df.getColumnsSubset(["Some-Column", "Some-Other-Column"]);

## Enumerating the index

The index can also be lazily iterated:

	var iterator = dataFrame.getIndex().getIterator();
	while (iterator.moveNext()) {
		var row = iterator.getCurrent();
		// do something with the row.
	}

Retrieve an array of an index's values:

	var arrayOfValues = dataFrame.getIndex().toValues();

## Direct column access

Individual columns can be extracted by name:

	var column = dataFrame.getColumn("some-column");

Or by zero-based index:

	var column = dataFrame.getColumn(5);

## Adding a column

New columns can be added to a data frame. This doesn't change the original data frame, it generates a new data frame that contains the additional column.

	var newDf = df.setColumn("Some-New-Column", newColumnObject); 

## Replacing a column

`setColumn` can also replace an existing column:

	var newDf = df.setColumn("Some-Existing-Column", newColumnObject);

Again note that it is only the new data frame that includes the modified column.

## Removing a column

A column can easily be removed:

	var newDf = df.dropColumn('Column-to-be-dropped');


# Immutability and Chained Functions

You may have noticed in previous examples that multiple functions have been chained.

*data-forge* supports only [immutable](https://en.wikipedia.org/wiki/Immutable_object) operations. Each operation returns a new immutable data frame or column. No *in place* operations are supported (one of the things I found confusing about *Pandas*). 

This is why, in the following example, the final data frame is captured after all operations are applied:

	var df = new dataForge.DataFrame(config).setIndex("Col3").dropColumn("Col3");

Consider an alternate structure:

	var df1 = new dataForge.DataFrame(config);
	var df2 = df1.setIndex("Col3");
	var df3 = df2.dropColumn("Col3");

Here *df1*, *df2* and *df3* are separate data frames with the results of the previous operations applied. These data frames are all immutable and cannot be changed. Any function that transforms a data frame returns a new and independent data frame. This is great, but may require some getting used to!
  
# Data exploration and visualization

In order to understand the data we are working with we must explore it, understand the data types involved and composition of the values.

## Console output

Data frame, index and column all provide a `toString` function that can be used to dump data to the console in a readable format.

Use the LINQ functions `skip` and `take` to preview a subset of the data (more on LINQ functions soon):

	// Skip 10 rows, then dump 20 rows.
	console.log(df.skip(10).take(20).toString()); 

Or more conveniently: 

	// Get a range of rows starting at row index 10 and ending at (but not including) row index 20.
	console.log(df.getRowsSubset(10, 20).toString()); 

As you explore a data set you may want to understand what data types you are working with. You can use the `detectTypes` function to produce a new data frame with information on the data types in the data frame you are exploring:

	// Create a data frame with details of the types from the source data frame.
	var typesDf = df.detectTypes(); 
	console.log(typesDf.toString());

For example, here is the output with data from Yahoo:

	__index__  		  Type    Frequency  Column
	----------------  ------  ---------  ---------
	0                 date    100        Date
	1                 number  100        Open
	2                 number  100        High
	3                 number  100        Low
	4                 number  100        Close
	5                 number  100        Volume
	6                 number  100        Adj Close

You also probably want to understand the composition of values in the data frame. This can be done using `detectValues` that examines the values and reports on their frequency: 

	// Create a data frame with the information on the frequency of values from the source data frame.
	var valuesDf = df.detectValues(); 
	console.log(valuesDf.toString());

todo: output

## Visual output

The [Github repo](https://github.com/Real-Serious-Games/data-forge-js) has [examples](https://github.com/Real-Serious-Games/data-forge-js/tree/master/examples) showing how to use *data-forge* with [Flot](http://www.flotcharts.org/).

There is a [Code Project article](http://www.codeproject.com/Articles/1069489/Highstock-plus-Data-Forge-plus-Yahoo) on using Highstock with Data-Forge to chart Yahoo financial data.

# Data transformation

## Data frame transformation

An entire data frame can be transformed using the [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query)-style [`select`](http://www.dotnetperls.com/select) function:

	var transformedDataFrame = df
		.select(function (row) {
			return {
				NewColumn: row.OldColumn * 2,	// <-- Transform existing column to create a new column.
				AnotherNewColumn: rand(0, 100)	// <-- Create a new column (in this cause just use random data).
			};
		});

The source index is preserved to the transformed data frame.

The more advanced [`selectMany`](http://www.dotnetperls.com/selectmany) function is also available.

Note: Data frames are immutable, the original data frame remains unmodified.

## Column transformation

Columns can also be transformed using `select`:

	var oldColumn = df.getColumn("Some-Column");
	var newColumn = oldColumn
		.select(function (value) {
			return transform(value); 	// <-- Apply a transformation to each value in the column.
		});

The source index is preserved to the transformed column.

Note: Columns are immutable, the original column is unmodified.

## Data frame and column filtering

Data frames and columns can be filtered using the [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query)-style [`where`](http://www.dotnetperls.com/where) function:

	var newDf = df
		.where(function (row) {
			// ... return true to include the row in the new data frame, return false to exclude it ...
		});

## LINQ functions

Most of the other [LINQ functions](https://code.msdn.microsoft.com/101-LINQ-Samples-3fb9811b) are or will be available. 

More documentation will be here soon on supported LINQ functions.

## Data frame - aggregation

todo: Coming soon

## Data frame - rolling window

todo: Coming soon

# Node.js examples

## Working with CSV files

	var fs = require('fs');
	var dataForge = require('data-forge');

	var inputFilePath = "input-file.csv";
	var outputFilePath = "output-file.csv";

	var inputDataFrame = dataForge.fromCSV(fs.readFileSync(inputFilePath, 'utf8'));

	var outputDataFrame = inputDataFrame.select(... some transformation ...);

	fs.writeFileSync(outputFilePath, outputDataFrame.toCSV()); 

## Working with JSON files

	var fs = require('fs');
	var dataForge = require('data-forge');

	var inputFilePath = "input-file.json";
	var outputFilePath = "output-file.json";

	var inputDataFrame = dataForge.fromJSON(fs.readFileSync(inputFilePath, 'utf8'));

	var outputDataFrame = inputDataFrame.select(... some transformation ...);

	fs.writeFileSync(outputFilePath, outputDataFrame.toJSON()); 

## Working a massive CSV file

When working with large text files use *FileReader* and *FileWriter*. *FileReader* is an iterator, it allows the specified file to be loaded piecemeal, in chunks, as required. *FileWriter* allows iterative output. These work in combination with lazy evaluation so to incrementally read, process and write massive files that are too large or too slow to work with in memory in their entirety.  

	var dataForge = require('data-forge');
	var FileReader = require('data-forge/file-reader');
	var FileWriter = require('data-forge/file-writer');

	var inputFilePath = "input-file.csv";
	var outputFilePath = "output-file.csv";

	// Read the file as it is processed.	
	var inputDataFrame = dataForge.from(new FileReader(inputFilePath));

	var outputDataFrame = inputDataFrame.select(... some transformation ...);

	dataForge.to(new FileWriter(outputDataFrame)); 
 

## Working with a MongoDB collection

	var pmongo = require('promised-mongo');
	var db = pmongo('localhost/some-database', ['someCollection', 'someOtherCollection']);

	db.someCollection.find().toArray()
		.then(function (documents) {
			var inputDataFrame = new dataForge.DataFrame({ rows: documents });

			var outputDataFrame = inputDataFrame.select(... some transformation ...);

			return db.someOtherCollection.insert(outputDataFrame.toObjects());			
		})
		.then(function () {
			console.log('Done!');
		})
		.catch(function (err) {
			console.error(err);
		});

## Working with a massive MongoDB collection

Same as previous example, except use skip and take to only process a window of the collection.

	var pmongo = require('promised-mongo');
	var db = pmongo('localhost/some-database', ['someCollection', 'someOtherCollection']);

	db.someCollection.find()
		.skip(300)
		.take(100)
		.toArray()		
		.then(function (documents) {
			var inputDataFrame = new dataForge.DataFrame({ rows: documents });

			var outputDataFrame = inputDataFrame.select(... some transformation ...);

			return db.someOtherCollection.insert(outputDataFrame.toObjects());			
		})
		.then(function () {
			console.log('Done!');
		})
		.catch(function (err) {
			console.error(err);
		});

## Working with HTTP

	var request = require('request-promise');

	request(
		{
			method: 'GET',
			uri: "http://some-host/a/rest/api',
			json: true,
		})
		.then(function (data) {
			var inputDataFrame = new DataFrame({ rows: data });

			var outputDataFrame = inputDataFrame.select(... some transformation ...);
			
			return request(
				{
					method: 'POST',
					uri: "http://some-host/another/rest/api',
					body: { 
						data: outputDataFrame.toObjects() 
					},
					json: true,
				});			 
		})
		.then(function () {
			console.log('Done!');
		})
		.catch(function (err) {
			console.error(err);
		});

# Browser examples

## Working with HTTP in the browser

This example depends on the [jQuery](http://jquery.com/) [get function](https://api.jquery.com/jquery.get/). 

Note the differences in the way plugins are referenced than in the NodeJS version.

**HTML**

	<script src="bower_components/jquery/dist/jquery.js"></script>
	<script src="bower_components/data-forge/data-forge.js"></script>

**Javascript for JSON**

	var url = "http://somewhere.com/rest/api";
	$.get(url, 
		function (data) {
			var dataFrame = new dataForge.DataFrame({ rows: data });
			// ... work with the data frame ...
		}
	);

	var someDataFrame = ...
	$.post(url, someDataFrame.toObjects(),
		function (data) {
			// ...
		}
	);
	
**Javascript for CSV**

	var url = "http://somewhere.com/rest/api";
	$.get(url, 
		function (data) {
			var dataFrame = dataForge.fromCSV();
			// ... work with the data frame ...
		}
	);

	var someDataFrame = ...
	$.post(url, someDataFrame.toCSV(),
		function (data) {
			// ...
		}
	);


## Working with HTTP in AngularJS

**HTML**

	<script src="bower_components/angular/angular.js"></script>
	<script src="bower_components/data-forge/data-forge.js"></script>

**Javascript**

	// Assume [$http](https://docs.angularjs.org/api/ng/service/$http) is injected into your controller.

	var url = "http://somewhere.com/rest/api";
	$http.get(url)
		.then(function (data) {
			var dataFrame = new dataForge.DataFrame(data);
			// ... work with the data frame ...			
		})
		.catch(function (err) {
			// ... handle error ...
		});

	var someDataFrame = ...
	$http.post(url, someDataFrame.toObjects())
		.then(function () {
			// ... handle success ...
		})
		.catch(function (err) {
			// ... handle error ...
		});
 
## Visualisation with Flot

todo

## Visualisation with Highstock

todo


