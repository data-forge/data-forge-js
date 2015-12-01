# data-forge

JavaScript data transformation and analysis toolkit inspired by Pandas and LINQ.

Works in both NodeJS and the browser. 

[Also available for C#](https://github.com/Real-Serious-Games/data-forge-cs).

----------

This project is a work in progress, please don't use unless you want to be an early adopter. Please expect API changes. Please contribute and help guide the direction of *data-forge*.

# Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Project Aims](#project-aims)
- [Driving Principles](#driving-principles)
- [Implementation](#implementation)
- [Installation](#installation)
  - [NodeJS installation and setup](#nodejs-installation-and-setup)
  - [Browser installation and setup](#browser-installation-and-setup)
  - [Getting the code](#getting-the-code)
- [Key Concepts](#key-concepts)
  - [Data Source](#data-source)
  - [Data Format](#data-format)
  - [Data Frame](#data-frame)
  - [Row](#row)
  - [Column](#column)
  - [Index](#index)
- [Basic Usage](#basic-usage)
  - [Creating a Data Frame](#creating-a-data-frame)
  - [Immutability and Chained Functions](#immutability-and-chained-functions)
- [Working with data](#working-with-data)
  - [Loading data](#loading-data)
  - [Saving data](#saving-data)
  - [Data Sources and Formats](#data-sources-and-formats)
    - [NodeJS data sources](#nodejs-data-sources)
    - [Browser data sources](#browser-data-sources)
    - [Data formats](#data-formats)
    - [Custom data source](#custom-data-source)
    - [Custom data format](#custom-data-format)
- [Data exploration and visualization](#data-exploration-and-visualization)
  - [Console output](#console-output)
  - [Visual output](#visual-output)
- [Accessing the data](#accessing-the-data)
  - [Accessing all values](#accessing-all-values)
  - [Column access](#column-access)
  - [Accessing column values](#accessing-column-values)
- [Data transformation](#data-transformation)
  - [Data frame transformation](#data-frame-transformation)
  - [Column transformation](#column-transformation)
  - [Data frame and column filtering](#data-frame-and-column-filtering)
  - [LINQ functions](#linq-functions)
  - [Adding a column](#adding-a-column)
  - [Replacing a column](#replacing-a-column)
  - [Removing a column](#removing-a-column)
  - [Data frame aggregation](#data-frame-aggregation)
  - [Data frame window](#data-frame-window)
- [Examples](#examples)
  - [Working with CSV files](#working-with-csv-files)
  - [Working with JSON files](#working-with-json-files)
  - [Working with MongoDB](#working-with-mongodb)
  - [Working with HTTP](#working-with-http)
    - [NodeJS](#nodejs)
    - [Browser](#browser)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Project Aims

The aims of this project:

- To combine the best aspects of [Pandas](https://en.wikipedia.org/wiki/Pandas_(software)) and [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query) and make them available in JavaScript and C#.
- To be able to load data, transform and save data.
- To be able to prepare data for visualization. 

# Driving Principles 

The principles that drive decision making and tradeoffs:

- Simple, easy to learn, easy to use.
- High performance.
- Be able to use the same (or very similar) API in both Javascript and C#.

# Implementation

General implementation goals:

- Immutable, every operation generates a new immutable data set.
- Lazy evaluation, to make the performance of immutability acceptable.
- To support different data sources and formats via plugins.


----------

The rest of the README defines the setup and usage of data-forge. Certain features described here are not implemented yet. 

# Installation

## NodeJS installation and setup

Install via [NPM](https://en.wikipedia.org/wiki/Npm_(software)): 

	npm install --save data-forge

Require the module into your script:

	var dataForge = require('data-forge');

## Browser installation and setup

Install via [Bower](https://en.wikipedia.org/wiki/Bower_(software)):

	bower install --save data-forge

Include the main script in your HTML file:

	<script src="bower_components/data-forge/data-forge.js"></script>

You can now access the global `dataForge` variable.
 
## Getting the code

Clone, fork or download the code from Github:

[https://github.com/Real-Serious-Games/data-forge-js](https://github.com/Real-Serious-Games/data-forge-js)


# Key Concepts

This section explains the key concepts related to *data-forge*.

## Data Source

A plugin to load data from or save data to a particular data source. Examples include *file*, [*mongodb*](https://en.wikipedia.org/wiki/MongoDB) and [*HTTP*](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) ([REST API](https://en.wikipedia.org/wiki/Representational_state_transfer)) for NodeJS and just *HTTP* for the browser.

## Data Format

A plugin to load or save data in a particular format. Examples include [*CSV*](https://en.wikipedia.org/wiki/Comma-separated_values) and [*JSON*](https://en.wikipedia.org/wiki/JSON). 

## Data Frame

This is the *main* concept. A matrix of data structured as rows and columns. Has an implicit or explicit index. Think of it as a spreadsheet in memory.

## Row

A single *indexed* row of data in a *data frame*. Contains a slice of data across columns. Has an implicit or explicit index. A sequence of values is associated with a row.

## Column

A single *named* column of data in a *data frame*. Contains a slice of data across rows. A sequence of values is associated with a column. All values in a column are generally expected to have the same type, although this is not a requirement of *data-forge-js*.  

## Index 

Used to index a data frame for operations such as *merge*. If not specified an integer index (starting at 0) is generated based on row position. An index can be explicitly set by promoting a column to an index.

# Basic Usage 

## Creating a Data Frame

A data frame can be simply created from values in memory. The following example creates a data frame with 3 rows:

	var columnNames = ["Col1", "Col2", "Col3"];
	var values = [
		[1, 'hello', new Date(...)],
		[5, 'computer', new Date(...)],
		[10, 'good day', new Date(...)]
	]; 
	var df = new dataForge.DataFrame(columnNames, values);

That example generates an index with the values *0, 1, 2*.

An index can be explicitly be provided as a constructor parameter:

	var index = new dataForge.Index([5, 10, 100]); 
	var df = new dataForge.DataFrame(columnNames, values, index);

Or an existing column can be promoted to an index:
 
	var df = new dataForge.DataFrame(columnNames, values).setIndex("Col3");

Be aware that promoting a column to an index in *data-forge* doesn't remove the column (as it does in *Pandas*). You can easily achieve this by calling *dropColumn*:

	var df = new dataForge.DataFrame(columnNames, values).setIndex("Col3").dropColumn("Col3");

## Immutability and Chained Functions

You may have noticed in the previous examples that multiple functions have been chained.

*data-forge* supports only [immutable](https://en.wikipedia.org/wiki/Immutable_object) operations. Each operation returns a new immutable data frame. No *in place* operations are supported (one of the things I found confusing about *Pandas*). 

This is why, in the following example, the final data frame is captured after all operations are applied:

	var df = new dataForge.DataFrame(columnNames, values).setIndex("Col3").dropColumn("Col3");

Consider an alternate structure:

	var df1 = new dataForge.DataFrame(columnNames, values);
	var df2 = df1.setIndex("Col3");
	var df3 = df2.dropColumn("Col3");

Here *df1*, *df2* and *df3* are separate data frames with the results of the previous operations applied. These data frames are all immutable and cannot be changed. Any function that transforms a data frame returns a new and independent data frame. This is great, but may require some getting used to!
  
# Working with data 

## Loading data

The `from` function acquires data from a particular data source (eg file, HTTP, database).

The `as` function [deserializes](https://en.wikipedia.org/wiki/Serialization) acquired data in a particular data format (eg csv or json).

Data is loaded, saved and formatted by plugins. For this next example let's assume we have a data source plugin called `myDataSource` and a data format plugin called `myDataFormat`.

Asynchronous loading is supported via [promises](https://en.wikipedia.org/wiki/Futures_and_promises). 

Loading from an asynchronous data source looks like this: 

	dataForge.from(myDataSource(sourceOptions))			// <-- Specify where the data is loaded from.
		.as(myDataFormat(formatOptions))				// <-- Deserialize a particular format to a data-frame.
		.then(function (dataFrame)) {
			// ... do something with the data frame ...	// <-- Loaded data frame is delivered by a promise.
		})
		.catch(function (err) {							
			// ... an error occurred ...				// <-- Async error handling.
		});


With certain plugins, we can also use the simpler API for synchronous loading:

	var dataFrame = dataForge.fromSync(myDataSource(sourceOptions))		// <-- Synchronous load.
		.as(myDataFormat(formatOptions));								// <-- Specify data format.


Warning: Asynchronous loading is not supported by all plugins and, if not possible, will cause an exception to be thrown.

## Saving data

The `as` function [serializes](https://en.wikipedia.org/wiki/Serialization) a data-frame to a particular format.

The `to` function saves the serialized data to a particular data source.

Saving data asynchronously:

	dataForge.as(myDataFormat(formatOptions))		// <-- Serialize data-frame to a particular format.
		.to(myDataSource(sourceOptions))			// <-- Specifies where the data is saved to.
		.then(function () {							
			... data has been saved ....			// <-- Promise is resolved on successful save.
		}) 
		.catch(function (err) {							
			// ... an error occurred ...			// <-- Async error handling.
		});

With certain plugins there is a simpler API for synchronous loading:

	dataForge.as(myDataFormat(formatOptions))		// <-- Serialize data.
		.toSync(myDataSource(sourceOptions));		// <-- Synchronously save the data.

	// Data has been synchronously saved. 

## Data Sources and Formats

*data-forge* supports a number of data sources and formats out of the box. Creating custom plugins is very easy.

Please see subsequent sections in the README for examples of the most common plugins.  

### NodeJS data sources

The NodeJS package includes several data sources.

- File: For loading/saving to files.
- MongoDB: For loading/saving to MonogDB collections.

There are more to come, including:

- SQL
- HTTP (rest APIs)

### Browser data sources

- HTTP: For HTTP GET/POST to a REST API.

### Data formats

- CSV: For serializing/deserializing CSV files. 
- Json: For serializing/deserializing JSON files. 

There are more to come, including:

- XML
- BSON
- YAML

### Custom data source

Skip this section if you aren't yet interested in creating plugins.

Creating a custom data source is simple. You must implement a JavaScript object with functions `read` and `write`. Both functions are expected to execute asynchronously and return a [promise](https://en.wikipedia.org/wiki/Futures_and_promises) ([Q](https://www.npmjs.com/package/q) is used internally, other promise libraries should also work).

If your plugin can be executed synchronously you also provide `readSync` and `writeSync` functions. If your plugin can't be executed synchronously, then don't provide these functions. *data-forge* will take care of throwing an exception with a reasonable error message if users tries to synchronously use a plugin that it is not intended to be used that way.

Here is the *simplest* stub for a data source plugin (designed to be used with NodeJS):

	'use strict';

	module.exports = function (dataSourceOptions) {
		
		return {
		
			//
			// Asynchronous read from data source. 
			//	
			read: function () {

				// ... invoke async operation, return promise ...
				
			},
			
			//
			// Asynchronous write to data source.
			//
			write: function (data) {
	
				// ... invoke async operation, write 'data' to data source, return promise ...
			},

			//
			// Synchronous read from data source. 
			//	
			readSync: function () {

				// ... perform synchronous operation, return loaded data ...
				
			},
			
			//
			// Synchronous write to data source.
			//
			writeSync: function (data) {
	
				// ... perform synchronous operation, write 'data' to data source, then return ...
			},
		};
	};
	
### Custom data format

Skip this section if you aren't yet interested in creating plugins.

Creating a data format plugin is even simpler than making a data source plugin (ignoring the peculiarities of serializing specific data formats).

You must implement a JavaScript object with `from` and `to` functions. `from` deserializes a data frame from raw data. `to` serializes a data frame to raw data. The format of the raw data depends on the data sources that the data format is intended to be used with.

Following is the *simplest* stub data format plugin (implemented as NodeJS module):

	'use strict';

	module.exports = function (dataFormatOptions) {

		return {
	
			//
			// Deserialize from raw data.
			//
			from: function (data) {
			
				// ... create a data frame and populate it with the data, return the data frame ...
			},
			
			//
			// Serialize a data frame to raw data.
			//
			to: function (dataFrame) {
				
				// ... generate raw data from the contents of the data rame, return the raw data ...
			},	
		};
	};

# Data exploration and visualization

In order to understand the data we are working 

## Console output

The data frame, index and column classes all provide a `toString` function that can be used to visualize data on the console.

You can also query for data frame values, column names and column values (described further below) so you can dump whatever you want to the console.

If you want to preview a subset of the data you can use the LINQ functions `skip` and `take` (more on LINQ functions soon):

	console.log(df.skip(10).take(20).toString()); // <-- Skip 10 rows, then dump 20 rows.

There is also a convenient function for getting a subset of rows:

	console.log(df.getRowsSubset(10, 20).toString()); // <-- Get a range of 20 rows starting at index 10.

As you explore a data set you may want to understand what data types you are working with. You can use the `getTypes` function to produce a new data frame with information on the data types in the data frame you are exploring:

	var typesDf = df.getTypes(); // <-- Create a data frame with the types from the source data frame.
	console.log(typesDf.toString());


## Visual output

More on this soon. If you need to get started now the [Github repo](https://github.com/Real-Serious-Games/data-forge-js) has [examples](https://github.com/Real-Serious-Games/data-forge-js/tree/master/examples) showing how to use *data-forge* with [Flot](http://www.flotcharts.org/).

# Accessing the data 

## Accessing all values

`getValues` pulls all values (across all columns and rows) for a data frame.

It returns an array of arrays. Each nested array represents a row.

	console.log(df.getValues());

## Column access

There are several ways to access columns.

An entire column can be extracted using `getColumn`. The column is specified by name:

	var column = df.getColumn("Some-Column");
	console.log(column.toString());

Or by (zero-based) index: 

	var column = df.getColumn(2); // <-- Get column at array-index 2. 
	console.log(column.toString());

Get the names of all columns via `getColumnNames`:

	console.log(df.getColumnNames());

Get all column objects via `getColumn`:

	var columns = df.getColumns();
	columns.forEach(function (column) {
		console.log(column.toString());
	});

Create a new data frame from a sub-set of columns:

	var subset = df.getColumnsSubset(["Some-Column", "Some-Other-Column"]);

## Accessing column values

Call `getValues` on a column to pull an array of all values in that column.

	var columnValues = df.getColumn("Some-Column").getValues();

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

The assigned index is maintained for the transformed data frame.

The more advanced [`selectMany`](http://www.dotnetperls.com/selectmany) function is also available.

Note: Data frames are immutable, the original column is unmodified.

## Column transformation

Columns can also be transformed using `select`:

	var oldColumn = df.getColumn("Some-Column");
	var newColumn = oldColumn
		.select(function (value) {
			return transform(value); 	// <-- Apply a transformation to each value in the column.
		});

The column index is maintained for the transformed column.

Note: Columns are immutable, the original column is unmodified.

## Data frame and column filtering

Data frames and columns can be filtered using the [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query)-style [`where`](http://www.dotnetperls.com/where) function:

	var newDf = df
		.where(function (row) {
			// .. return true to include the row in the new data frame, return false to exclude it ...
		});

## LINQ functions

Most of the other [LINQ functions](https://code.msdn.microsoft.com/101-LINQ-Samples-3fb9811b) are or will be available. 

More documentation will be here soon on supported LINQ functions.

## Adding a column

New columns can be added to a data frame. Again note that this doesn't change the original data frame, but generates a new data frame that contains the additional column.

	var newDf = df.setColumn("Some-New-Column", newColumnObject); 

## Replacing a column

We can replace an existing column using the same function:

	var newDf = df.setColumn("Some-Existing-Column", newColumnObject);

Again note that it is only the new data frame that includes the modified column.

## Removing a column

A column can easily be removed:

	var newDf = df.dropColumn('Column-to-be-dropped');

## Data frame aggregation

Under construction this is a work in progress.

## Data frame window

Under construction this is a work in progress.

# Examples

## Working with CSV files

To work with CSV files on disk you need the *file* and *csv* plugins that are included with *data-forge*.

	var dataForge = require('data-forge');
	var file = require('data-forge/source/file');
	var csv = require('data-forge/format/csv');

	var csvInputFilePath = "input-csv-file.csv";
	var csvOutputFilePath = "output-csv-file.csv";

	dataForge.from(file(csvInputFilePath)) 			// <-- Load from input file.
		.as(csv())									// <-- Deserialize the file from CSV.
		.then(function (dataFrame) {
			// ... transform the data frame ...		// <-- Transform the data.

			return dataFrame.as(csv())				// <-- Serialize the file to CSV.
				.to(file(csvOutputFilePath));		// <-- Save to output file.
		})
		.then(function () {
			console.log('Success!');				// <-- Output file successfully saved.
		});	
		.catch(function (err) {
			console.error(err && err.stack || err); // <-- Handle errors.
		});

## Working with JSON files

To work with JSON files on disk you need the *file* and *json* plugins that are included with *data forge*.

	var dataForge = require('data-forge');
	var file = require('data-forge/source/file');
	var json = require('data-forge/format/json');

	var jsonInputFilePath = "input-json-file.json";
	var jsonOutputFilePath = "output-json-file.json";

	dataForge.from(file(jsonInputFilePath)) 		// <-- Load from input file.
		.as(json())									// <-- Deserialize the file from JSON.
		.then(function (dataFrame) {
			// ... transform the data frame ...		// <-- Transform the data.

			return dataFrame.as(json())				// <-- Serialize the file to JSON.
				.to(file(jsonOutputFilePath));		// <-- Save to output file.
		})
		.then(function () {
			console.log('Success!');				// <-- Output file successfully saved.
		});	
		.catch(function (err) {
			console.error(err && err.stack || err); // <-- Handle errors.
		});

## Working with MongoDB

When working with MongoDB we use the *mongo* plugin combine with the *json* plugin. 

	var dataForge = require('data-forge');
	var mongo = require('data-forge/source/mongo');
	var json = require('data-forge/format/json');


	dataForge.from(mongo({							// <-- Load from mongodb collection.
			host: 'some-database-host',
			db: 'some-database',
			collection: 'input-collection'
		})) 		
		.as(json())									// <-- Deserialize the file from JSON.
		.then(function (dataFrame) {
			// ... transform the data frame ...		// <-- Transform the data.

			return dataFrame.as(json())				// <-- Serialize the file to JSON.
				.to(mongo({							// <-- Save to mongodb collection.
					host: 'some-database-host',
					db: 'some-database',
					collection: 'output-collection'
				});
		})
		.then(function () {
			console.log('Success!');				// <-- Output collection successfully saved.
		});	
		.catch(function (err) {
			console.error(err && err.stack || err); // <-- Handle errors.
		});

## Working with HTTP

When working with HTTP we can use *json*, *csv* and other text formats. This example uses *json* as it is the most common used in combination with HTTP. 

Note that HTTP is the only *data source* that works in the browser. So this example can work in both NodeJS and the browser. A NodeJS example is presented first, followed by the browser.

### NodeJS 
 
	var dataForge = require('data-forge');
	var http = require('data-forge/source/http');
	var json = require('data-forge/format/json');

	var url = "http://somewhere.com/rest/api";

	dataForge.from(http(url))						// <-- HTTP GET data from REST API.
		.as(json())									// <-- Deserialize the file from JSON.
		.then(function (dataFrame) {
			// ... transform the data frame ...		// <-- Transform the data.

			return dataFrame.as(json())				// <-- Serialize the file to JSON.
				.to(http(url));						// <-- HTTP POST data to REST API.
		})
		.then(function () {
			console.log('Success!');				// <-- Success!
		});	
		.catch(function (err) {
			console.error(err && err.stack || err); // <-- Handle errors.
		});

### Browser

Note the differences in the way plugins are referenced than in the NodeJS version.

HTML:

	<script src="bower_components/data-forge/data-forge.js"></script>

Javascript:

	var url = "http://somewhere.com/rest/api";

	dataForge.from(dataForge.http(url))				// <-- HTTP GET data from REST API.
		.as(dataForge.json())						// <-- Deserialize the file from JSON.
		.then(function (dataFrame) {
			// ... transform the data frame ...		// <-- Transform the data.

			return dataFrame.as(dataForge.json())	// <-- Serialize the file to JSON.
				.to(dataForge.http(url));			// <-- HTTP POST data to REST API.
		})
		.then(function () {
			console.log('Success!');				// <-- Success!
		});	
		.catch(function (err) {
			console.error(err && err.stack || err); // <-- Handle errors.
		});



