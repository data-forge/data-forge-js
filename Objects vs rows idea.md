Prototype idea.

## Objects vs Rows

DataFrames can be in two different formats, they can be used in either *rows* format or *objects* format. When you instantiate a DataFrame it will be in one of the two format depending on what type of data you passed into the constructor. If you pass in an array of rows you will have a rows format DataFrame:

	var rowsFormatDataFrame = new dataForge.DataFrame({ values: <array-of-rows> });

Otherwise if you pass in an array of objects you will have an objects format DataFrame:

	var objectsFormatDataFrame = new dataForge.DataFrame({ values: <array-of-objects> });

In rows format a DataFrame is a sequence of rows, where each row is an array. When a DataFrame is loaded from CSV format it is automatically in rows format:

	var rowsFormatDataFrame = dataForge.fromCSV("<csv-string>");

In objects mode a DataFrame is a sequence of JavaScript objects. When a DataFrame is loaded from a JavaScript array of objects or from other formats (eg JSON, XML, YAML) is is automatically in objects format:

	var objectsFormatDataFrame = new DataFrame({ values: <some-array-of-objects> });

Or:	

	var objectsFormatDataFrame = dataForge.fromJSON("<json-string>");

The functions `toObjects` and `toRows` transform a DataFrame between formats:

	var rowsFormatDataFrame = dataForge.fromCSV("<csv-string>");
	var objectsFormatDataFrame = rowsFormatDataFrame.asObjects(); 

Or:

	var objectsFormatDataFrame = dataForge.fromJSON("<json-string)
	var rowsFormatDataFrame = objectsFormatDataFrame.asRows(); 

Which format you use is completely up to you and it depends on the data you have and your needs.
