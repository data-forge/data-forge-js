# data-forge

JavaScript data transformation and analysis toolkit inspired by Pandas and LINQ.

Works in both NodeJS and the browser. 

[Also in development for C#](https://github.com/data-forge/data-forge-cs).

----------

**Warning**: This project is a work in progress, please don't use unless you want to be an early adopter. Please expect API changes. Please contribute and help guide the direction of *data-forge*.

Note that some features described in this README are not yet implemented, although that list grows smaller every day.

# Generated API docs

See here for [generated API docs](./docs/api.md) that are taking shape.

# Examples

Examples and some tests have been removed to a [separate repository](https://github.com/data-forge/data-forge-js-examples-and-tests).

# Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Key Concepts](#key-concepts)
- [Basic Usage](#basic-usage)
- [Immutability and Chained Functions](#immutability-and-chained-functions)
- [Lazy Evaluation](#lazy-evaluation-1)
- [Working with data](#working-with-data)
- [Data exploration and visualization](#data-exploration-and-visualization)
- [Data transformation](#data-transformation)
- [LINQ/PANDAS-style functions](#linqpandas-style-functions)
- [Collapsing unique values](#collapsing-unique-values)
- [Groups and windows](#groups-and-windows)
- [Summarization and Aggregation](#summarization-and-aggregation)
- [Filling gaps and missing data](#filling-gaps-and-missing-data)
- [Node.js examples](#nodejs-examples)
- [Browser examples](#browser-examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Project Overview

A short overview of the aims, principles and implementation methods for this project.

## Project Aims

The aims of this project:

- To combine the best aspects of [Pandas](https://en.wikipedia.org/wiki/Pandas_(software)) and [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query) and make them available in JavaScript.
- To be able to load, transform and save data.
- To be able to prepare data for visualization. 
- Be able to work with massive data files.

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

## Getting the code

Install via NPM and Bower as described in previous sections or clone, fork or download the code from GitHub:

[https://github.com/data-forge/data-forge-js](https://github.com/data-forge/data-forge-js)


# Key Concepts

This section explains the key concepts of *Data-Forge*.

## DataFrame

DataFrame is the *main* concept. It is a sequence of rows. It can also be considered a matrix (rows and columns) of structured started. Can be considered a sequence of rows. Has an implicit or explicit index. Think of it as a spreadsheet in memory.

A *data-frame* can be easily constructed from various formats and it can be exported to various formats. 

## Series

Series is a sequence of values. A series is indexed. By default a Series has an integer index starting at 0 and couting up (just like arrays). Series will often be used with a date-time index, this is usually known as a [time series](https://en.wikipedia.org/wiki/Time_series).

All values in a series are generally expected to have the same type, although this is not a requirement of *data-forge-js*.

## Value / Row

A single piece of data in a sequence. For `DataFrame` a value is a JavaScript object, each field of the object represnts a column in the data-frame. For `Series` each value can be any valid JavaScript value. 

## Column

A column is a single *named* series of data in a data-frame. Each column is simply a series with a name, the values of the series are the values of the column. A column is a slice of data through all rows.

## Index 

An index sequence of values that is used to index a data-frame or series. When the data is a *time-series* the index is expected to contain *Date* values.
 
Used for operations that search and merge data-farmes and series. 

If not specified an integer index (starting at 0) is generated based on row position. An index can be explicitly by specifying a column by name.

## Pair

Through this documentation and the Data-Forge code you will occasionally see a reference to a *pair* or *pairs*. Series and DataFrames are actually sequences of *pairs*, where each pair contains a index and a value or row.  

## Lazy Evaluation

Data-frames, series and index are only fully evaluated when necessary. Operations are queued up and only fully evaluated as needed and when required, for example when serializing to csv or json (`toCSV` or `toJSON`) or when baking to values (`toValues` or `toRows`). 

A data-frame, series or index can be forcibly evaluated by calling the `bake` function. 

## Iterator

Iterates the rows of a data-frame, series or index. Iterators allow lazy evaluation (row by row evaluation) of data frames, series and index. This is the same concept as an [iterator in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) or an [enumerator in C#](https://msdn.microsoft.com/en-us/library/system.collections.ienumerator(v=vs.110).aspx).

The specification for an iterator is simple:

	var anIterator = {

		moveNext: function () {
			// Move to the next element in the sequence.
			// Return true if the sequence contains more elements.
			// Return false when the sequence is exhausted.
		},

		getCurrent: function () {
			// Return the current element in the sequence. 
		},

	};

## Iterable

An *iterable* is an anonymous function that instantiates and returns an *iterator*. A iterable conceptually represents *a sequence that can be iterated*.

An example iterable:

	var myIterable = function () {
		var myIterator = ... create an iterator for the sequence ...
		return myIterator;
	};


## Selector

A *selector* is a user-defined function (usually anonymous) that is passed to Data-Forge functions to process or transform each value in the sequence. Selectors are also used to instruct Data-Forge on which part of the data to work with.

For example say you have a row that looks as follows:

	{
		Column1: "some data",
		Column2: 42,
	},

Here is an example a *selector* that identifies *Column2*:

	var mySelector = function (row) {
		return row.Column2;
	};

Selectors are usually passed each row in the Data-Frame or each value in the Series. 

Selectors are usually also passed the *index* for the value (although you can ignore this as demonstrated in the previous snippet).

An example of a selector that works with index rather than row: 

	var mySelector = function (row, index) {
		return index;
	};

## Predicate

A *predicate* function is similar to a *selector*, but returns a boolean value (technically you can return any value that can be considered *truthy* or *falsey*).

An example predicate function:

	var myPredicate = function (row) {
		return row.Column2 >= 42;	
	};

Predicates can also take the index: 

	var myPredicate = function (row, index) {
		return index > 20;
	};

## Comparer

A *comparer* method is used to compare to values for equality. It returns true (or *truthy*) to indicate equality or false (or *falsey*) to indicate inequality. 

An example:

	var myComparer = function (row1, row2) {
		return row1.ClientName === row.ClientName; // Row comparison based on client name.
	}; 

## Generator

todo: Review and revise this section.

A generator is a function that produces zero or more values to be inserted into a Series or DataFrame.

A generator may take arguments and it can return an array of values or rows:

	function myGenerator = function (... appropriate arguments ...) {
		return [
			[ .. generated row 1 .. ],
			[ .. row 2 .. ],
			[ .. row 3 .. ],
			[ .. etc .. ]
		];	
	};

Alternatively (to support lazy evaluation) a generator may return a lazily evaluated *iterable*, that is a function that returns an iterator for a sequence of values or rows:


	function myGenerator = function (... appropriate arguments ...) {
		return function () {
			var myIterator = ... some iterator for a sequence of values or rows ...
			return myIterator;
		};
	};


# Basic Usage 

## Getting data in

### DataFrame

The DataFrame constructor is passed a *config* object that specifies the initial contents of the DataFrame and any additional options required. 

Create a data frame from column names and rows:

	var dataFrame = new dataForge.DataFrame({
			columnNames: ["Col1", "Col2", "Col3"],
			values: [
				[1, 'hello', new Date(...)],
				[5, 'computer', new Date(...)],
				[10, 'good day', new Date(...)]
			]
		});

A data frame can also be created from an array of JavaScript objects:

	var dataFrame = new dataForge.DataFrame({
			values: [
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

If you need to specify any other configuration, you can also simply pass in an array of objects:

	var dataFrame = new dataForge.DataFrame([
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
		]);

In this case column names are automatically generated form the fields in the objects. For performance reasons only the fields of the first object are considered.  

If you have irregular data you can enable *considerAllRows*, but be warned that this can be expensive as every value must be examined to determine column names:

	var dataFrame = new dataForge.DataFrame({
			values: [
				{
					Col1: 1,
					Col2: 'hello',
					Col3: new Date(....)
				},
				{
					Col1: 5,
					Col5: 'these are irregular columns',
					Col6: new Date(....)
				},
				{
					Col5: 10,
					Col7: 'another irregular column',
					Col10: new Date(....)
				}
			],
			considerAllRows: true, // Examine all rows to determine column names.
		});
 
### Series

This is very similar to creating a DataFrame. You pass in a *configuration* object with the values and any additional options:

	var series = new dataForge.Series({
			values: [1, 2, 3]
		});

If you don't need additional options you can simply pass in an array:

	var series = new dataForge.Series([1, 2, 3]);

## Get data back out

### DataFrame

To get back the names of columns:

	var columnNames = dataFrame.getColumnNames();

To get back an array of objects (with column names as field names):

	var objects = dataFrame.toValues();

To get back an array of rows (in column order):

	var rows = dataFrame.toRows();

To get back index and value pairs:

	var pairs = dataFrame.toPairs(); 

### Series

To retreive the data from Series as an array:

	var values = series.toValues();

To get back index and value pairs:

	var pairs = series.toPairs(); 

## Setting an index

In the previous examples of creating Series and DataFrames no index was specified, so a default zero-based index was generated.

An index can also be set explicitly when creating a Series or DataFrame:

	var dataFrame = new dataForge.DataFrame({
			columnNames: <column-names>,
			values: <initial-values>,
			index: [5, 10, 100]
		});

	var series = new dataForge.Series({
			values: <initial-values>,
			index: [5, 10, 100]			
		});

A new index can easily be assigned to either Series or DataFrame using the `withIndex` function:

	var dataFrameWithNewIndex = dataFrame.withIndex([1, 2, 3]);

Most likely when using a DataFrame you will want to promote an existing column to an index:
 
	var dataFrame = new dataForge.DataFrame(someConfig).setIndex("Col3");

Be aware that promoting a column to an index in Data-Forge doesn't remove the column (as it does in Pandas). You can easily achieve this by calling `dropSeries`:

	var dataFrame = new dataForge.DataFrame(someConfig).setIndex("Col3").dropSeries("Col3");

An index is required for certain operations like `merge`.

## Reading CSV files

	var fs = require('fs');
	var inputCsvData = fs.readFileSync('some-csv-file.csv', 'utf8');
	var dataFrame = dataForge.fromCSV(inputCsvData );

## Writing CSV files

	var fs = require('fs');
	var outputCsvData = dataFrame.toCSV();
	fs.writeFileSync('some-other-csv-file.csv', outputCsvData);

## Reading JSON files

	var fs = require('fs');
	var inputJsonData = fs.readFileSync('some-json-file.json', 'utf8');
	var dataFrame = dataForge.fromJSON(inputJsonData);

## Writing CSV files

	var fs = require('fs');
	var outputJsonData = dataFrame.toJSON();
	fs.writeFileSync('some-other-json-file.json', outputJsonData);

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

An iterator can be used to traverse a sequence and extract each index+value pair in turn.

	var iterator = something.getIterator();
	while (iterator.moveNext()) {
		var pair = iterator.getCurrent();
		// do something with the pair.
	}

A data-frame can be created from a function that returns an iterator. This is the primary mechanism that supports creation of a pipeline of lazy DataFrames. 

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

# Working with data

## Extracting rows from a data-frame

Rows can be extracted from a data-frame in several ways.

Note: the follow functions cause lazy evaluation to complete (like the *toArray* function in LINQ). This can be performance intensive.

To extract rows as arrays of data (ordered by column): 

	var arrayOfArrays = dataFrame.toRows();

To extract rows as objects (with column names as fields):

	var arrayOfObjects = dataFrame.toValues();

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
		// ... do something with the column ...
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

Retrieve the index from a data-frame:

	var index = dataFrame.getIndex();

Retrieve the index from a series:

	var index = someSeries.getIndex();

An index is actually just another Series so you can call the `toValues` function or anything else that normally works for a Series:

	var arrayOfValues = index.toValues();

## Adding a column

New columns can be added to a DataFrame. This doesn't change the original data-frame, it generates a new data-frame that contains the additional column.

	var newDf = df.withSeries("Some-New-Column", someNewSeries); 

## Replacing a column

`withSeries` can also replace an existing column:

	var newDf = df.withSeries("Some-Existing-Column", someNewSeries);

Again note that it is only the new data frame that includes the modified column.

## Removing columns

One or more columns can easily be removed:

	var newDf = df.dropSeries(['col1', 'col2']);

Also works for single columns:

	var newDf = df.dropSeries('Column-to-be-dropped');

Alternatively you can select the columns to keep and drop the rest:

	var newDf = df.keepSeries(["Column-to-keep", "Some-other-column-to-keep"]);

## Getting a row or value by index

A particular value of a Series or a row of a DataFrame can be retrieved by specifying the index using the `at` function:

	var dataFrame = ...

	// Get a row at index 10.
	var row = dataFrame.at(10);

	// Also works when the index is a different type, eg a time-series index.
	var row = dataFrame.at(new Date(2016, 5, 22));

This works in the same way for a series. 

## Setting a row of value by index
 
A particular value of a Series or a row of DataFrame can be set by specifying the index using the `set` function:

	var dataFrame = ...
	var newRow = ...

	// Set the row and produce a new DataFrame.
	var newDataFrame = dataFrame.set(10, newRow);

Series and DataFrame are immutable, so the set operation does not modify in place, it returns a new Series or DataFrame.

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

## Concatenation

Series and DataFrames can be concatenated.

	var df1 = ... some dataframe ...
	var df2 = ... some other dataframe ...

	var concatenated = df1.concat(df2);

Multiple series or dataframes may be passed to concat:

	var concatenated = df1.concat(df2, df3, df4, etc);

Or an array may be used:

	var toConcat = [df2, df3, df4, etc];
	var concatenated = df1.concat(toConcat); 

You can also concatenate by passing a list to the global data-forge `concat` function:

	var toConcat = [df2, df3, df4, etc];
	var concatenated = dataForge.concat(toConcat);

Note that when concatenating series using the global function you must use the Series-specific version:

	var concatenatedSeries = dataForge.concatSeries([series1, series2, etc]);

## Data frame transformation

An data-frame can be transformed using the [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query)-style [`select`](http://www.dotnetperls.com/select) function:

	var transformedDataFrame = sourceDataFrame
		.select(function (row, index) {
			return {
				NewColumn: row.OldColumn * 2,	// <-- Transform existing column to create a new column.
				AnotherNewColumn: rand(0, 100)	// <-- Create a new column (in this cause just use random data).
			};
		});

This produces an entirely new immutable data-frame. However the new data-frame has the same index as the source data-frame, so both can be merged back together, if required: 

	var mergedDataFrame = dataForge.merge(sourceDataFrame, transformedDataFrame);

Note that `select` only transforms the value. The index for each row is preserved in the new DataFrame. To completely transform a DataFrame, both value and index, you must use `selectPairs`:

	var transformedDataFrame = sourceDataFrame
		.selectPairs(function (index, value) {
			return [ // Returns a new pair.
				... some new index ...,
				... some new row ...
			];
		});

Note that `selectMany` and `selectManyPairs` functions are also available and work the same as LINQ SelectMany.

## Series transformation

Series can be transformed using `select`:

	var oldSeries = df.getSeries("Some-Column");
	var newSeries = oldSeries
		.select(function (value, index) {
			// Apply a transformation to each value in the column.
			return transform(value); 	
		});	

	// Plug the modified series back into the data-frame.
	var newDf = df.withSeries("Some-Column", newSeries);

The source index is preserved to the transformed series.

Use `selectPairs` to transform both value and index:  

	var newSeries = oldSeries
		.selectPairs(function (index, value) {
			return [ // Returns a new pair.
				... some new index ...,
				... some new value ...
			];
		});	

The result of `select` and `selectPairs` is a completely new immutable Series.

Data-Frame offers a convenience function `transformSeries` for when you want to extract, transform and plug back in one or more series at once. For example to simplify the previous code example:

	var newDf = df.transformSeries({
		Some-Column: function (value, index) {
			// Apply a transformation to each value in the column.
			return transform(value); 	
		},
	);

Note that `selectMany` and `selectManyPairs` functions are also available and work the same as LINQ SelectMany.

## Data-frame and series filtering

Data-frames and series can be filtered using the [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query)-style [`where`](http://www.dotnetperls.com/where) function:

	var newDf = df
		.where(function (row) {
			// ... return true to include the row in the new data frame, return false to exclude it ...
		});

# LINQ/PANDAS-style functions

Most of the other [LINQ functions](https://code.msdn.microsoft.com/101-LINQ-Samples-3fb9811b) are or will be available. 

LINQ-style functions that are currently available (or close equivalents):

- select/selectMany
- selectPairs/selectManyPairs
- skip/skipWhile/skipUntil
- take/takeWhile/takeUntil
- where
- any
- all
- none
- subset
- slice
- orderBy/orderByDescending/thenBy/thenByDescending
- groupBy
- distinct
- toValues/toObjects
- count
- head/tail
- first/last
- firstPair/lastPair
- firstIndex/lastIndex
- reverse
- 
- 
- average/min/max/sum
- zip

Pandas-style functions that are currently available: 

- pivot
- merge/mergeSeries
- getSeries/withSeries
- window/rollingWindow/variableWindow

# Collapsing unique values

## Distinct values  

The `distinct` function for `Series` and `DataFrame` works very much like [LINQ Distinct](http://www.dotnetperls.com/distinct).

The `DataFrame` version must be supplied a *selector* that selects which column to use for comparison:

	var distinctDataFrame = someDataFrame.distinct(function (row) {
			reutrn row.SomeColumn; // Compare 'SomeColumn' for unique values.
		});

The result is a `DataFrame` with duplicate rows removed. The first index for each group of duplicates is preserved. 

The `Series` version takes no parameters:

	var distinctSeries = someSeries.distinct();

The result is a `Series` with duplicate values removed. The first index for each group of duplicates is preserved.

## Sequential distinct values

The `sequentialDistinct` function for `Series` and `DataFrame` is similar to `distinct`, but only operates on sequentially distinct values.

The resulting `Series` or `DataFrame` has duplicate values or rows removed, but only where the duplicates where adjacent to each other in the data sequence. The first index for each group of sequential duplicates is preserved.

# Groups and windows

Data-Forge provides various methods for grouping data. All of these methods return a `Series` of *buckets*. Each bucket is a `Series` or `DataFrame` containing grouped data. 

Use any of the [data transformation](#data-transformation) or [aggregation](#summarization-and-aggregation) functions to transform a `Series` of buckets into something else.

## Group

The `groupBy` function groups `Series` or `DataFrame` based on the output of the user-defined *selector*. This works in very much the same way as [LINQ GroupBy](http://www.dotnetperls.com/groupby). 

For example, grouping a `DataFrame` with sales data by client:

	var salesByClient = salesData.groupBy(function (row, index) {
			return row.ClientName;
		});

This returns a `Series` of data buckets. Each group contains a separate `DataFrame` with only those rows that are part of the group as specified by the *selector*.

This can also be done with `Series`:

	var outputSeries = someSeries.groupBy(function (value, index) {
			return index;
		});

The output is still a `Series` of data buckets. Each group contains a separate `Series` with only those values that are part of the group as specified by *selector*.

Note that in this example we are grouping by *index* as an alternative to grouping by *value*.

## Group Sequential

The `groupSequentialBy` function for `Series` and `DataFrame` is similar to `groupBy`, except that it only groups adjacent values or rows in the data sequence.

	var outputSeries = someSeriesOrDataFrame.groupSequentialBy(function (valueOrRow, index) {
			return ... grouping criteria ...
		});


## Window 

The `window` function groups a `Series` or `DataFrame` into equally sized batches. The *window* passes over the data-frame or series *batch-by-batch*, taking the first N rows for the first window, then the second N rows for the next window and so on. 

The output is a `Series` of buckets. Each data bucket contains the values or rows for that *window*.  

	var windowSize = 5; // Looking at 5 rows at a times.
	var newSeries = seriesOrDataFrame.window(windowSize);

Use any of the [data transformation](#data-transformation) functions to transform the `Series` of *window* into something else.

An example that summarizes weekly sales data:

	var salesData = ... series containing amount sales for each business day ...

	var weeklySales = salesData.window(7)
			.selectPairs(function (windowIndex, window) {
				// Return new index and value.
				return [
					window.lastIndex(), 	// Week ending.
					window.sum()			// Total the amount sold during the week.
				]; 
			});

## Rolling window

The `rollingWindow` function groups a `Series` or `DataFrame` into batches, this function however differs from `window` in that it *rolls* the *window* across data set *row-by-row* rather than batch-by-batch. 

The `percentChange` function that is included in Data-Forge is probably the simplest example use of `rollingWindow`. It computes a new series with the percentage increase of each value in the source series.

The implementation of `percentChange` looks a bit like this:
    
	var pctChangeSeries = sourceSeries.rollingWindow(2)
		.selectPairs(function (window, windowIndex) {
				var values = window.toValues();
				var amountChange = values[1] - values[0]; // Compute amount of change.
				var pctChange = amountChange / values[0]; // Compute % change.

				// Return new index and value.
				return [
					window.lastIndex(), 
					pctChange
				]; 
			});
   
`percentChange` is simple because it only considers a window size of 2 (eg it considers each adjacent pair of values).

Now consider an example that requires a configurable window size. Here is some code that computes a *simple moving average* (derived from *[data-forge-indicators](https://github.com/data-forge/data-forge-indicators)*):

	var Enumerable = require('linq');

	var smaPeriod = ... configurable moving average period ...
 	var smSeries = someSeries.rollingWindow(smaPeriod)
		.selectPairs(function (windowIndex, window) {
    		return [
				window.lastIndex(),
				window.sum() / smaPeriod,
    	});

## Variable window

The `variableWindow` function groups a `Series` or `DataFrame` into buckets that have a variable amount of values or rows. Adjacent values and rows are compared using a user-defined [*comparer*](#comparer). When the *comparer* returns `true` (or *truthy*) adjacent data items are combined into the same group.

An example:

	var outputSeries = someSeriesOrDataFrame.variableWindow(function (a, b) {
			return ... compare a and b for equality, return true if they are equal ...
		}; 

The [`sequentialDistinct` function](#sequential-distinct-values) is actually implemented using `variableWindow` so it is a good example:

	var sequentialDistinct = function (valueSelector, obsoleteSelector) {

		var self = this;	
		return self.variableWindow(function (a, b) {
				return valueSelector(a) === valueSelector(b);
			});
	};

# Summarization and Aggregation

## Aggregate

An entire data frame can be aggregated (or summarized) by calling `aggregate` and passing in an object that specifies how to aggregate each column in the data frame.

Here is an example of aggregating the day's sales data to create a summary:

	var dataFrame = ... today's sales, including Price and Revenue ... 
	var summary = dataFrame.aggregate({
			TotalSales: function (dataFrame) {
				return dataFrame.count();
			},
			AveragePrice: function (dataFrame) {
				return dataFrame.getSeries("Price").average();
			},
			TotalRevenue: [
				"Revenue",
				function (revenueSeries) {
					return revenueSeries.sum();
				}
			],
		});

Why not just do this??
Do I even need aggregate.
The old style aggregate is probably ok, just for LINQ compatibility.

	var summary = {
		TotalSales: dataFrame.count(),
		AveragePrice: dataFrame.getSeries("Price").average(),
		TotalRevenue: dataFrame.getSeries("Revenue").sum(),
	};

	// Output average price and total revenue.
	console.log(summary);


todo the two types of aggregation ???

## Merge

todo

## Zip

todo:

## Group, Aggregate and Combine

todo: should be able to do this without LINQ now.

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

# Filling gaps and missing data

The function `fillGaps` works the same for both Series and DataFrame:

	var sequenceWithGaps = ...

	// Predicate that determines if there is a gap.
	var gapExists = function (pairA, pairB) {
		// Returns true if there is a gap.
		return true;
	};

	// Generator function that produces new rows to fill the game.
	var gapFiller = function (pairA, pairB) {
		return [
			newPair1,
			newPair2,
			newPair3,
		];
	}

	var sequenceWithoutGaps = sequenceWithGaps.fillGaps(gapExists, gapFiller);

For a more concrete example, let's fill gaps in daily share data:

	var moment = require('moment');

	var dailyShareDataWithGaps = ...

	var gapExists = function (pairA, pairB) {
		// Return true if there is a gap longer than a day.
		var startDate = pairA[0];
		var endDate = pairB[0];
		var gapSize = moment(endDate).diff(moment(startDate), 'days');
		return gapSize > 1;
	};

	var gapFiller = function (pairA, pairB) {
		// Fill values forward.
		var startDate = pairA[0];
		var endDate = pairB[0];
		var gapSize = moment(endDate).diff(moment(startDate), 'days');
		var numEntries = gapSize - 1;

		var startValue = pairA[1];
		var newEntries = [];

		for (var entryIndex = 0; entryIndex < numEntries; ++entryIndex) {
			newEntries.push([
				moment(pairA[0]).add(entryIndex + 1, 'days').toDate(), // New index
				startValue // New value, copy the start value forward to fill the gaps. 
			]);
		}	

		return newEntries;
	}

	var dailyShareValueWithoutGaps = sequenceWithGaps.fillGaps(gapExists, gapFiller);
	

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


