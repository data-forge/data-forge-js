# data-forge

JavaScript data transformation and analysis toolkit inspired by Pandas and LINQ.

Works in both NodeJS and the browser. 

[Also in development for C#](https://github.com/data-forge/data-forge-cs).

----------

**Warning**: This project is a work in progress, please don't use unless you want to be an early adopter. Please expect API changes. Please contribute and help guide the direction of *data-forge*.

Note that some features described in this README are not yet implemented, although that list grows smaller every day.

# Generated API docs

See here for [generated API docs](./docs/api.md) that are taking shape.

# Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Project Overview](#project-overview)
  - [Project Aims](#project-aims)
  - [Driving Principles](#driving-principles)
  - [Implementation](#implementation)
- [Installation](#installation)
  - [NodeJS installation and setup](#nodejs-installation-and-setup)
    - [Data-Forge plugins under Node.js](#data-forge-plugins-under-nodejs)
  - [Browser installation and setup](#browser-installation-and-setup)
    - [Data-Forge plugins under the browser](#data-forge-plugins-under-the-browser)
  - [Meteor installation and setup](#meteor-installation-and-setup)
  - [Getting the code](#getting-the-code)
- [Key Concepts](#key-concepts)
  - [Data Frame](#data-frame)
  - [Row](#row)
  - [Series](#series)
  - [Column](#column)
  - [Index](#index)
  - [Lazy Evaluation](#lazy-evaluation)
  - [Iterator](#iterator)
- [Basic Usage](#basic-usage)
  - [Creating a Data Frame](#creating-a-data-frame)
  - [Setting an index](#setting-an-index)
- [Working with data](#working-with-data)
  - [CSV](#csv)
  - [JSON](#json)
  - [XML](#xml)
  - [YAML](#yaml)
  - [Reading and writing files in Node.js](#reading-and-writing-files-in-nodejs)
  - [Extracting rows from a data frame](#extracting-rows-from-a-data-frame)
  - [Extracting columns and series from a data frame](#extracting-columns-and-series-from-a-data-frame)
  - [Enumerating a series](#enumerating-a-series)
  - [Enumerating an index](#enumerating-an-index)
  - [Adding a column](#adding-a-column)
  - [Replacing a column](#replacing-a-column)
  - [Removing a column](#removing-a-column)
- [Immutability and Chained Functions](#immutability-and-chained-functions)
- [Data exploration and visualization](#data-exploration-and-visualization)
  - [Console output](#console-output)
  - [Visual output](#visual-output)
- [Data transformation](#data-transformation)
  - [Data frame transformation](#data-frame-transformation)
  - [Series transformation](#series-transformation)
  - [Data frame and series filtering](#data-frame-and-series-filtering)
  - [LINQ functions](#linq-functions)
  - [Aggregation](#aggregation)
  - [Rolling window](#rolling-window)
- [Node.js examples](#nodejs-examples)
  - [Working with CSV files](#working-with-csv-files)
  - [Working with JSON files](#working-with-json-files)
  - [Working a massive CSV file](#working-a-massive-csv-file)
  - [Working with a MongoDB collection](#working-with-a-mongodb-collection)
  - [Working with a massive MongoDB collection](#working-with-a-massive-mongodb-collection)
  - [Working with HTTP](#working-with-http)
- [Browser examples](#browser-examples)
  - [Working with HTTP in the browser](#working-with-http-in-the-browser)
  - [Working with HTTP in AngularJS](#working-with-http-in-angularjs)
  - [Visualisation with Flot](#visualisation-with-flot)
  - [Visualisation with Highstock](#visualisation-with-highstock)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Project Overview

A short overview of the aims, principles and implementation methods for this project.

## Project Aims

The aims of this project:

- To combine the best aspects of [Pandas](https://en.wikipedia.org/wiki/Pandas_(software)) and [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query) and make them available in JavaScript.
- To be able to load, transform and save data.
- To be able to prepare data for visualization. 
- Be able to load massive data files.

## Driving Principles 

The principles that drive decision making and tradeoffs:

- The API should be simple, easy to learn and easy to use.
- Minimize the magic, everything should be understandable, the API should be orthogonal.
- The library should have high performance.
- Be able to use a similar API in both Javascript and C#.
- The code you build during interactive data exploration should be transplantable to an webapp, server or microservice.

## Implementation

General implementation goals:

- Immutable: every operation generates a new immutable data set.
- Lazy evaluation, to make the performance of immutability acceptable.
- Should be easily extensible.
- All the core code is created through test driven development.


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

Import the module and *use* it:

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

## Meteor installation and setup

Coming in the future. Can anyone help with that?

## Getting the code

Install via NPM and Bower as described in previous sections or clone, fork or download the code from GitHub:

[https://github.com/data-forge/data-forge-js](https://github.com/data-forge/data-forge-js)


# Key Concepts

This section explains the key concepts of *Data-Forge*.

## Data Frame

This is the *main* concept. A matrix of data structured as rows and columns. Can be considered a sequence of rows. Has an implicit or explicit index. Think of it as a spreadsheet in memory.

A *data-frame* can be easily constructed from various formats and it can be exported to various formats. 

## Row

A single row of data in a *data-frame*. Contains a slice of data across columns. Has an implicit or explicit index. A row is most commonly represented as a JavaScript object (with column names as fields). A row can also be represented as an array of values.

## Series

A sequence of indexed values. These are often, but not always, time-series, where the values are indexed by date/time.

All values in a series are generally expected to have the same type, although this is not a requirement of *data-forge-js*.

## Column

A single *named* series of data in a data-frame. Each column is simply a series with a name, the values of the series are the values of the column. A column is a slice of data through all rows. 

## Index 

A sequence of values that is used to index a data-frame or series. When the data is a *time-series* the index is expected to contain *Date* values.
 
Used for operations that search and merge data-farmes and series. 

If not specified an integer index (starting at 0) is generated based on row position. An index can be explicitly by specifying a column by name.

## Lazy Evaluation

Data-frames, series and index are only fully evaluated when necessary. Operations are queued up and only fully evaluated as needed and when required, for example when serializing to csv or json (`toCSV` or `toJSON`) or when baking to values (`toValues` or `toObjects`). 

A data-frame, series or index can be forcibly evaluated by calling the `bake` function. 

## Iterator

Iterates the rows of a data-frame, series or index. Iterators allow lazy evaluation (row by row evaluation) of data frames, series and index. This is the same concept as an [iterator in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) or an [enumerator in C#](https://msdn.microsoft.com/en-us/library/system.collections.ienumerator(v=vs.110).aspx).

# Basic Usage 

## Getting data in

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


## Getting data out

To get back the names of columns:

	var columnNames = dataFrame.getColumnNames();

To get back an array of rows:

	var rows = dataFrame.toValues();

To get back an array of objects (with column names as field names):

	var objects = dataFrame.toObjects();

## Setting an index

In the previous examples of creating a data-frame, an index was generated with values starting at zero.

An index can also be set explicitly when creating a data frame:

	var dataFrame = new dataForge.DataFrame({
			columnNames: <column-names>,
			rows: <rows>,
			index: new dataForge.Index([5, 10, 100])
		});

Or an existing column can be promoted to an index:
 
	var dataFrame = new dataForge.DataFrame(someConfig).setIndex("Col3");

Be aware that promoting a column to an index in Data-Forge doesn't remove the column (as it does in Pandas). You can easily achieve this by calling `dropSeries`:

	var dataFrame = new dataForge.DataFrame(someConfig).setIndex("Col3").dropSeries("Col3");

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

	var inputCsvData = fs.readFileSync('some-csv-file.csv', 'utf8');
	var dataFrame = dataForge.fromCSV(inputCsvData );

	var outputCsvData = dataFrame.toCSV();
	fs.writeFileSync('some-other-csv-file.csv', outputCsvData);

See the [examples section](#examples) for more examples of loading various data sources and formats.

## Extracting rows from a data-frame

Rows can be extracted from a data-frame in several ways.

Note: the follow functions cause lazy evaluation to complete (like the *toArray* function in LINQ). This can be performance intensive.

To extract rows as arrays of data (ordered by column): 


	var arrayOfArrays = dataFrame.toValues();

To extract rows as objects (with column names as fields):

	var arrayOfObjects = dataFrame.toObjects();

To extracts index + row pairs:

	var arrayOfPairs = dataFrame.toPairs();

A new data-frame can also be created from a *slice* of rows:

	var startIndex = ... // Starting row index to include in subset. 
	var endIndex = ... // Ending row index to include in subset.
	var rowSubset = dataFrame.slice(startIndex, endIndex);

Invoke a callback for each row in a data-frame using `forEach`:

	dataFrame.forEach(function (row, index) {
		// Callback function invoked for each row.
	}); 

## Extracting columns and series from a data-frame

Get the names of the columns:

	var arrayOfColumnNames = dataFrame.getColumnNames();

Get an array of all columns:

	var arrayOfColumns = dataFrame.getColumns();

	for (var column in columns) {
		var name = column.name;
		var series = column.series;
		// ... so something with the column ...
	}

Get the series for a column by name:

	var series = dataFrame.getSeries('some-series'); 

Get the series for a column by index:

	var series = dataFrame.getSeries(5); 

Create a new data-frame from a subset of columns:

	var columnSubset = df.subset(["Some-Column", "Some-Other-Column"]);

## Extract values from a series

Note: the follow functions cause lazy evaluation to complete (like the *toArray* function in LINQ). This can be performance intensive.

Extract the values from the series as an array:   

	var arrayOfValues = someSeries.toValues();

Extract index + value pairs from the series as an array:

	var arrayOfPairs = someSeries.toPairs();

Invoke a callback for each value in the series using `forEach`:

	someSeries.forEach(function (value, index) {
		// Callback function invoked for each value.
	}); 

## Extract values from an index

Retreive the index from a data-frame:

	var index = dataFrame.getIndex();

Retreive the index from a series:

	var index = someSeries.getIndex();

Retrieve values from the index as an array:

	var arrayOfValues = index.toValues();

## Adding a column

New columns can be added to a data-frame. This doesn't change the original data-frame, it generates a new data-frame that contains the additional column.

	var newDf = df.setSeries("Some-New-Column", someNewSeries); 

## Replacing a column

`setSeries` can also replace an existing column:

	var newDf = df.setSeries("Some-Existing-Column", someNewSeries);

Again note that it is only the new data frame that includes the modified column.

## Generating a column

`setSeries` can be passed a function that is used to generate a new column from the existing contents of the date-frame:

	var newDf = df.setSeries("Generated-Column", function (row) {
			var someValue = ... 
			// ... generate values for the new column from the contents of the data-frame ...
			return someValue;
		});

## Removing a column

One or more columns can easily be removed:

	var newDf = df.dropSeries(['col1', 'col2']);

Also works for single columns:

	var newDf = df.dropSeries('Column-to-be-dropped');

# Immutability and Chained Functions

You may have noticed in previous examples that multiple functions have been chained.

Data-Forge supports only [immutable](https://en.wikipedia.org/wiki/Immutable_object) operations. Each operation returns a new immutable data frame or column. No *in place* operations are supported (one of the things I found confusing about *Pandas*). 

This is why, in the following example, the final data frame is captured after all operations are applied:

	var df = new dataForge.DataFrame(config).setIndex("Col3").dropSeries("Col3");

Consider an alternate structure:

	var df1 = new dataForge.DataFrame(config);
	var df2 = df1.setIndex("Col3");
	var df3 = df2.dropSeries("Col3");

Here *df1*, *df2* and *df3* are separate data-frames with the results of the previous operations applied. These data-frames are all immutable and cannot be changed. Any function that transforms a data-frame returns a new and independent data frame. If you are not used to this sort of thing, it may require some getting used to!

# Lazy Evaluation

Lazy evaluation in Data-Forge is implemented through *iterators*. 

An iterator is retrieved from a data-frame, series or index by calling `getIterator`. A new and distinct iterator is created each time `getIterator` is called.

For example:

	var iterator = dataFrame.getIterator();

Or

	var iterator = series.getIterator();

Or 

	var iterator = index.getIterator();

An iterator can be used to traverse a sequence and extract each index + value pair in turn.

	var iterator = something.getIterator();
	while (iterator.moveNext()) {
		var pair = iterator.getCurrent();
		var index  
		// do something with the row/value.
	}

A data-frame can be created from an function that returns an iterator. This is the primary mechanism that supports creation of a pipeline of lazy DataFrames. 

	var df = new dataForge.DataFrame({ 
		iterable: function () {
			return ... some iterator ...
		},
	});

A series can also be created from a function that returns an iterator:

	var series = new dataForge.Series({ 
		iterable: function () {
			return ... some iterator ...
		},
	});
  
# Data exploration and visualization

In order to understand the data we are working with we must explore it, understand the data types involved and the composition of the values.

## Console output

Data-frame, index and series all provide a `toString` function that can be used to dump data to the console in a readable format.

Use the LINQ functions `skip` and `take` to preview a subset of the data (more on LINQ functions soon):

	// Skip 10 rows, then dump 20 rows.
	console.log(df.skip(10).take(20).toString()); 

Or more conveniently: 

	// Get a range of rows starting at row index 10 and ending at (but not including) row index 20.
	console.log(df.slice(10, 20).toString()); 

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

## Visual output

The [Github repo](https://github.com/data-forge/data-forge-js) has [examples](https://github.com/data-forge/data-forge-js/tree/master/examples) showing how to use *data-forge* with [Flot](http://www.flotcharts.org/).

There is a [Code Project article](http://www.codeproject.com/Articles/1069489/Highstock-plus-Data-Forge-plus-Yahoo) on using Highstock with Data-Forge to chart Yahoo financial data.

# Data transformation

## Data frame transformation

An data-frame can be transformed using the [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query)-style [`select`](http://www.dotnetperls.com/select) function:

	var transformedDataFrame = sourceDataFrame
		.select(function (row) {
			return {
				NewColumn: row.OldColumn * 2,	// <-- Transform existing column to create a new column.
				AnotherNewColumn: rand(0, 100)	// <-- Create a new column (in this cause just use random data).
			};
		});

This produces an entirely new data-frame. However the new data-frame has the same index as the source data-frame, so both can be merged back together, if required: 

	var mergedDataFrame = dataForge.merge(sourceDataFrame, transformedDataFrame);

The more advanced [`selectMany`](http://www.dotnetperls.com/selectmany) function is also available.

Note: Data-frames are immutable, the source data-frame remains unmodified.

## Series transformation

Series can be transformed using `select`:

	var oldSeries = df.getSeries("Some-Column");
	var newSeries = oldSeries
		.select(function (value) {
			// Apply a transformation to each value in the column.
			return transform(value); 	
		});	
	// Plug the modified series back into the data-frame.
	var newDf = df.setSeries("Some-Column", newSeries);

The source index is preserved to the transformed series.

Note: Series are immutable, the original series is unmodified.

Data-Frame offers a convenience function `transformSeries` for when you want to extract, transform and plug back in one or more series at once. For example to simplify the previous code example:

	var newDf = df.transformSeries({
		Some-Column: function (value) {
			// Apply a transformation to each value in the column.
			return transform(value); 	
		},
	);

## Data-frame and series filtering

Data-frames and series can be filtered using the [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query)-style [`where`](http://www.dotnetperls.com/where) function:

	var newDf = df
		.where(function (row) {
			// ... return true to include the row in the new data frame, return false to exclude it ...
		});

## LINQ functions

Most of the other [LINQ functions](https://code.msdn.microsoft.com/101-LINQ-Samples-3fb9811b) are or will be available. 

More documentation will be here soon on supported LINQ functions.

## Summarization and Aggregation

## Group

Data in one data-frame can be grouped into multiple data-frames on values selected from the data-frame.

For example, grouping raw sales data by client:

	var salesByClient = salesData.groupBy(function (row, index) {
			return row.ClientName;
		});

This returns an array of objects with the following format:

	[
		{
			key:	<group-by-value>, 
			data:	<data-frame-containing-grouped-data>,
		},
	
		...
	]

todo: have a proper example here with data.

## Aggregate

todo

### Merge

todo

## Group, Aggregate and Combine

	// Group by client.
	var groups = salesData.groupBy(function (row) { 
			return row.ClientName;
		});

	// Aggregate each group.
	var aggregated = Enumerable.from(groups) 	// Use regular linq. 
		.select(function (group) {
				return group.data.aggregate({
					ClientName: group.key,
					Amount: dataForge.sum, 		// Sum sales per client.
				});
		})
		.toArray();

	// Combine the data back together.
	var combined = dataForge.concat(aggregated);
	console.log(combined.toString());

### Window 

The `window` function allows you to produce a new series for a data-frame or series by considering only a window of rows at a time. The *window* passes over the data-frame or series *batch-by-batch*, taking the first N rows for the first window, then the second N rows for the next window and so on.

	var windowSize = 5; // Looking at 5 rows at a times.
	var newSeries = sourceSeriesOrDataFrame.window(windowSize,
			function (window, windowIndex) {
				var index = ... compute index for row ...
				var value = ... compute value for row ...
				return [index, value]; // Generate a row in the new series.			
			}
		);

Each invocation of the selector function is passed a data-frame or series that represents the window of time requested. The return value of the selector produces a row in the new series: an array is returned that contains a pair of values. The pair specifies the index and value for the row.
	   
The window function can be used for summarization and aggregation of data.

As an example consider computing the weekly totals for daily sales data:

	var salesData = ... series containing amount sold on each day ...

	var weeklySales = salesData.window(7, 
			function (window, windowIndex) {
				return [
					window.getIndex().last(), // Week ending.
					window.sum(),			  // Total the amount sold during the week.
				]; 
			},
		);

## Rolling window

Like the window function, `rollingWindow` considers a window of rows at a time. This function however *rolls* across the data-frame or series *row-by-row* rather than batch-by-batch. The selector function produces a new series with summarized or aggregated data. 

The `percentChange` function that is included is probably the simplest example use of `rollingWindow`. It computes a new series with the percentage increase of each value in the source series.

The implementation of `percentChange` looks a bit like this:
    
	var windowSize = 2;
	var pctChangeSeries = sourceSeries.rollingWindow(windowSize, 
			function (window, windowIndex) {
				var values = window.toValues();
				var amountChange = values[1] - values[0]; // Compute amount of change.
				var pctChange = amountChange / values[0]; // Compute % change.
				return [window.getIndex().last(), pctChange]; // Return new index and value.
			}
		);
   
`percentChange` is simple because it only considers a window size of 2.

Now consider an example that requires a variable window size. Here is some code that computes a *simple moving average* (derived from *[data-forge-indicators](https://github.com/data-forge/data-forge-indicators)*):

	var Enumerable = require('linq');

	var smaPeriod = ... variable window size ...
 	var smSeries = sourceSeries.rollingWindow(smaPeriod, 
			function (window, windowIndex) {
	    		return [
					window.getIndex().last(),
					window.sum() / period,
	    	}
		);	

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


