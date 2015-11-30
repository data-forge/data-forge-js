# data-forge

JavaScript data transformation and analysis toolkit inspired by Pandas and LINQ.

For both NodeJS and the browser. 

[Also available for C#](https://github.com/Real-Serious-Games/data-forge-cs).

----------

This is a work in progress, please don't use unless you want to be an early adopter. Please expect API changes. Please contribute and help guide the direction of data-forge.

## Project Aims

The aims of this project. 

- To combine the best aspects of [Pandas](https://en.wikipedia.org/wiki/Pandas_(software)) and [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query) and make them available in Javascript and C#.
- To be able to load data, transform and save data.
- To be able to prepare data for visualization. 

## Driving Principles 

The principles that drive decision making and tradeoffs.

- Simple, easy to learn, easy to use.
- High performance.
- Be able to use the same (or very similar API in both Javascript and C#).

## Implementation

Specific implementation details.

- Immutable, every operation generates a new immutable data set.
- Lazy evaluation, to make the performance of immutability acceptable.
- To support different data sources and formats via plugins.


----------

The rest of the README defines what we want to achieve with data-forge. Certain features described are not implemented yet. 

## NodeJS Installation and setup

Install via [NPM](https://en.wikipedia.org/wiki/Npm_(software)): 

	npm install data-forge

Require the module into your script:

	var dataForge = require('data-forge');

## Browser Installation and setup

Install via [Bower](https://en.wikipedia.org/wiki/Bower_(software)):

	bower install --save data-forge

Include the data-forge script in your HTML file:

	<script src="bower_components/data-forge/data-forge.js"></script>

You can now access the global `dataForge` variable.
 
## Getting the code

You can fork, clone or download the code from Github:

[https://github.com/Real-Serious-Games/data-forge-js](https://github.com/Real-Serious-Games/data-forge-js)


## Key Concepts

This section lists the key concepts you must know to use *data-forge*.

### Data Source

A plugin to load data from or save data to a particular data source. Examples include *file*, [*mongodb*](https://en.wikipedia.org/wiki/MongoDB) and [*HTTP*](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) ([REST API](https://en.wikipedia.org/wiki/Representational_state_transfer)) for NodeJS, just *HTTP* for the browser.

### Data Format

A plugin to load or save data in a particular format. Examples include [*CSV*](https://en.wikipedia.org/wiki/Comma-separated_values) and [*JSON*](https://en.wikipedia.org/wiki/JSON). 

### Data Frame

This is the *main* concept. A matrix of data structured as rows and columns. Has an implicit or explicit index. Think of it as a spreadsheet in memory.

### Row

A single *indexed* row of data in a *data frame*. Contains a slice of data across columns. Has an implicit or explicit index. 

### Column

A single *named* column of data in a *data frame*. Contains a slice of data across rows. 

### Index 

Used to index a data frame for many operations such as *merge*. If not specified an index is generated based on position. An index can specified explicitly by promoting a column to an index. 

## Creating a Data Frame

A data frame can be simply created from values in memory. This creates a data frame with 3 rows:

	var columnNames = ["Col1", "Col2", "Col3"];
	var values = [
		[1, 'hello', new Date(...)],
		[5, 'computer', new Date(...)],
		[10, 'good day', new Date(...)]
	]; 
	var df = new dataForge.DataFrame(columnNames, values);

That last example generates an index with the values *0, 1, 2*.

An index can be explicitly be provided as a constructor parameter:

	var index = new dataForge.Index([5, 10, 100]); 
	var df = new dataForge.DataFrame(columnNames, values, index);

Or you can promote a column to an index:
 
	var df = new dataForge.DataFrame(columnNames, values).setIndex("Col3");

Be aware that promoting a column to an index in *data forge* doesn't remove the column (as it does in *Pandas*). You can easily achieve this by calling *dropColumn*:

	var df = new dataForge.DataFrame(columnNames, values).setIndex("Col3").dropColumn("Col3");

## Immutability and Chained Functions

You'll have noticed in the previous examples that multiple functions have been chained.

*data forge* supports only immutable operations. Each operation returns a new data frame. No *in place* operations are supported (one of the things I find confusing about *Pandas*). 

That's why in the following case we capture the final data frame after all operations are applied:

	var df = new dataForge.DataFrame(columnNames, values).setIndex("Col3").dropColumn("Col3");

Consider the alternative structure:

	var df1 = new dataForge.DataFrame(columnNames, values);
	var df2 = df1.setIndex("Col3");
	var df3 = df2.dropColumn("Col3");

*df1*, *df2* and *df3* are separate data frames with the results of the previous operations applied! These are all immutable and cannot be changed. Any function that transforms a data frame returns a new and independent data frame. This is great once you get used to it, but may require some getting used to!
  
## Loading data

The `from` function is used to acquire data from a particular data source.

The `as` function specifies the expected data format (eg csv or json).

Data is loaded, saved and formatted by plugins. For this example assume we have a data source plugin called `myDataSource` and a data format plugin called `myDataFormat`.

Asynchronous loading is supported via [promises](https://en.wikipedia.org/wiki/Futures_and_promises). 

Loading the data would look like this: 

	dataForge.from(myDataSource(sourceOptions))			// <-- Specify where the data is loaded from.
		.as(myDataFormat(formatOptions))				// <-- Deserialize a particular format to a data-frame.
		.then(function (dataFrame)) {
			// ... do something with the data frame ...	// <-- Loaded data frame is delivered by a promise.
		})
		.catch(function (err) {							
			// ... an error occurred ...				// <-- Async error handling.
		});

## Saving data

The `as` function serializes a data-frame to a particular format.

The `to` function saves the serialized data to a particular data source.

Saving data looks similar to loading:

	dataForge.as(myDataFormat(formatOptions))		// <-- Serialize data-frame to a particular format.
		.to(myDataSource(sourceOptions))			// <-- Specifies where the data is saved to.
		.then(function () {							
			... data has been saved ....			// <-- Promise is resolved on successful save.
		}) 
		.catch(function (err) {							
			// ... an error occurred ...			// <-- Async error handling.
		});


### NodeJS data sources

The NodeJS package includes several data sources.

- File
- MongoDB

There are more to come, including:

- SQL
- HTTP (rest APIs)

### Browser data sources

- HTTP

### Data formats

- CSV: For serializing/deserializing CSV files. 
- Json: For serializing/deserializing JSON files. 


## Working with CSV files

To work with CSV files on disk you need the *file* and *csv* plugins that are included with *data forge*.

	var dataForge = require('data-forge');
	var file = require('data-forge/source/file');
	var csv = require('data-forge/fmt/csv');

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
	var json = require('data-forge/fmt/json');

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

## Working with Mongodb

When working with MongoDB we use the *mongo* plugin combine with the *json* plugin. 

	var dataForge = require('data-forge');
	var mongo = require('data-forge/source/mongo');
	var json = require('data-forge/fmt/json');


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
	var json = require('data-forge/fmt/json');

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

## Data exploration and visualisation

todo: you need to be able to see what you are doing.

### Console output

### Visual output


## Data transformation

So we know how to load and save to various data sources and formats.

Data transformation is easy, especially if you already know some LINQ.

### Column access

todo: by name or index

### Adding a column

### Extracting a column  

### Column transformation


### Replacing a column


### Removing a column

	var df = ... some data frame ...
	var newDf = df.dropColumn('Column-to-be-dropped');


### Data frame transformation

todo: data frame select

### Data frame filtering

todo: data frame select

### Data frame aggregation

todo:

### Data frame window

todo:

### LINQ functions

todo

## DIY data source

todo

## DIY data format

todo


