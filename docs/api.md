## Members
<dl>
<dt><a href="#dataForge">dataForge</a></dt>
<dd><p>Main namespace for Data-Forge.</p>
<p>Nodejs:</p>
<pre><code>    npm install --save data-forge

    var dataForge = require(&#39;data-forge&#39;);
</code></pre><p>Browser:</p>
<pre><code>    bower install --save data-forge

    &lt;script language=&quot;javascript&quot; type=&quot;text/javascript&quot; src=&quot;bower_components/data-forge/data-forge.js&quot;&gt;&lt;/script&gt;
</code></pre></dd>
</dl>
## Functions
<dl>
<dt><a href="#DataFrame">DataFrame(config)</a></dt>
<dd><p>Constructor for DataFrame.</p>
</dd>
<dt><a href="#Index">Index()</a></dt>
<dd><p>Implements an index for a data frame or column.</p>
</dd>
<dt><a href="#Series">Series()</a></dt>
<dd><p>Represents a time series.</p>
</dd>
</dl>
<a name="dataForge"></a>
## dataForge
Main namespace for Data-Forge.Nodejs:		npm install --save data-forge				var dataForge = require('data-forge');Browser:		bower install --save data-forge		<script language="javascript" type="text/javascript" src="bower_components/data-forge/data-forge.js"></script>

**Kind**: global variable  

* [dataForge](#dataForge)
  * [.use()](#dataForge.use)
  * [.fromJSON()](#dataForge.fromJSON)
  * [.merge(leftDataFrame, rightDataFrame, [columnName])](#dataForge.merge)
  * [.concat(dataFrames)](#dataForge.concat)
  * [.range(start, count)](#dataForge.range)

<a name="dataForge.use"></a>
### dataForge.use()
Install a plugin in the dataForge namespace.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
<a name="dataForge.fromJSON"></a>
### dataForge.fromJSON()
Deserialize a data frame from a JSON text string.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
<a name="dataForge.merge"></a>
### dataForge.merge(leftDataFrame, rightDataFrame, [columnName])
Merge data-frames by index or a particular column.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| leftDataFrame | <code>[DataFrame](#DataFrame)</code> | One data frame to merge. |
| rightDataFrame | <code>[DataFrame](#DataFrame)</code> | The other data frame to merge. |
| [columnName] | <code>string</code> | The name of the column to merge on. Optional, when not specified merge is based on the index. |

<a name="dataForge.concat"></a>
### dataForge.concat(dataFrames)
Concatenate multiple data frames into a single.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| dataFrames | <code>array</code> | Array of data frames to concatenate. |

<a name="dataForge.range"></a>
### dataForge.range(start, count)
Generate a series from a range of numbers.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>int</code> | The value of the first number in the range. |
| count | <code>int</code> | The number of sequential values in the range. |

<a name="DataFrame"></a>
## DataFrame(config)
Constructor for DataFrame.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | Specifies content and configuration for the data frame. |


* [DataFrame(config)](#DataFrame)
  * [.getIndex()](#DataFrame+getIndex)
  * [.getColumnNames()](#DataFrame+getColumnNames)
  * [.getIterator()](#DataFrame+getIterator)
  * [.getColumnIndex(columnName)](#DataFrame+getColumnIndex) ⇒ <code>Number</code>
  * [.getColumnName(columnIndex)](#DataFrame+getColumnName) ⇒ <code>string</code>
  * [.skip(numRows)](#DataFrame+skip)
  * [.skipWhile(predicate)](#DataFrame+skipWhile)
  * [.skipUntil(predicate)](#DataFrame+skipUntil)
  * [.take(numRows)](#DataFrame+take)
  * [.takeWhile(predicate)](#DataFrame+takeWhile)
  * [.takeUntil(predicate)](#DataFrame+takeUntil)
  * [.where(filterSelectorPredicate)](#DataFrame+where)
  * [.select(selector)](#DataFrame+select)
  * [.selectMany(selector)](#DataFrame+selectMany)
  * [.getSeries(columnName)](#DataFrame+getSeries)
  * [.hasSeries(columnName)](#DataFrame+hasSeries)
  * [.expectSeries(columnName)](#DataFrame+expectSeries)
  * [.getColumns()](#DataFrame+getColumns)
  * [.subset(columnNames)](#DataFrame+subset)
  * [.orderBy(columnNameOrIndexOrSelector)](#DataFrame+orderBy)
  * [.orderByDescending(columnNameOrIndexOrSelector)](#DataFrame+orderByDescending)
  * [.dropColumns(columnOrColumns)](#DataFrame+dropColumns)
  * [.setSeries(columnName, data)](#DataFrame+setSeries)
  * [.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])](#DataFrame+slice)
  * [.setIndex(columnName)](#DataFrame+setIndex)
  * [.resetIndex()](#DataFrame+resetIndex)
  * [.toString()](#DataFrame+toString)
  * [.parseInts(columnNameOrIndex)](#DataFrame+parseInts)
  * [.parseFloats(columnNameOrIndex)](#DataFrame+parseFloats)
  * [.parseDates(columnNameOrIndex, [formatString])](#DataFrame+parseDates)
  * [.toStrings(columnNameOrIndex, [formatString])](#DataFrame+toStrings)
  * [.detectTypes()](#DataFrame+detectTypes)
  * [.detectValues()](#DataFrame+detectValues)
  * [.truncateStrings(maxLength)](#DataFrame+truncateStrings)
  * [.remapColumns(columnNames)](#DataFrame+remapColumns)
  * [.renameColumns(newColumnNames)](#DataFrame+renameColumns)
  * [.toValues()](#DataFrame+toValues)
  * [.toObjects()](#DataFrame+toObjects)
  * [.toJSON()](#DataFrame+toJSON)
  * [.toCSV()](#DataFrame+toCSV)
  * [.toPairs()](#DataFrame+toPairs)
  * [.bake()](#DataFrame+bake)
  * [.count()](#DataFrame+count)
  * [.transformColumns(columnSelectors)](#DataFrame+transformColumns)
  * [.window(period, selector)](#DataFrame+window)
  * [.rollingWindow(period, selector)](#DataFrame+rollingWindow)
  * [.first()](#DataFrame+first)
  * [.last()](#DataFrame+last)
  * [.reverse()](#DataFrame+reverse)
  * [.generateColumns(selector)](#DataFrame+generateColumns)
  * [.deflate(selector)](#DataFrame+deflate)
  * [.inflateColumn(columnNameOrIndex, [selector])](#DataFrame+inflateColumn)
  * [.head(numRows)](#DataFrame+head)
  * [.tail(numRows)](#DataFrame+tail)
  * [.aggregate([seed], selector)](#DataFrame+aggregate)
  * [.toObject(keySelector, keySelector)](#DataFrame+toObject)
  * [.zip(...dataFrames, selector)](#DataFrame+zip)
  * [.bringToFront(columnOrColumns)](#DataFrame+bringToFront)
  * [.bringToBack(columnOrColumns)](#DataFrame+bringToBack)

<a name="DataFrame+getIndex"></a>
### dataFrame.getIndex()
Get the index of the data frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+getColumnNames"></a>
### dataFrame.getColumnNames()
Get the names of the columns in the data frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+getIterator"></a>
### dataFrame.getIterator()
Get an iterator for the data-frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+getColumnIndex"></a>
### dataFrame.getColumnIndex(columnName) ⇒ <code>Number</code>
Gets a column index from a column name.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
**Returns**: <code>Number</code> - Returns the index of the named column or -1 if the requested column was not found.  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | The name of the column to retrieve the column index for. |

<a name="DataFrame+getColumnName"></a>
### dataFrame.getColumnName(columnIndex) ⇒ <code>string</code>
Gets a column name from a column index.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
**Returns**: <code>string</code> - Returns the name of the column or undefined if the requested column was not found.  

| Param | Type | Description |
| --- | --- | --- |
| columnIndex | <code>int</code> | The index of the column to retrieve the column name for. |

<a name="DataFrame+skip"></a>
### dataFrame.skip(numRows)
Skip a number of rows in the data frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to skip. |

<a name="DataFrame+skipWhile"></a>
### dataFrame.skipWhile(predicate)
Skips rows in the data-frame while a condition is met.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="DataFrame+skipUntil"></a>
### dataFrame.skipUntil(predicate)
Skips rows in the data-frame until a condition is met.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="DataFrame+take"></a>
### dataFrame.take(numRows)
Take a number of rows in the data frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="DataFrame+takeWhile"></a>
### dataFrame.takeWhile(predicate)
Take rows from the data-frame while a condition is met.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="DataFrame+takeUntil"></a>
### dataFrame.takeUntil(predicate)
Take rows from the data-frame until a condition is met.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="DataFrame+where"></a>
### dataFrame.where(filterSelectorPredicate)
Filter a data frame by a predicate selector.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| filterSelectorPredicate | <code>function</code> | Predicte function to filter rows of the data frame. |

<a name="DataFrame+select"></a>
### dataFrame.select(selector)
Generate a new data frame based on the results of the selector function.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each row to a different data structure. |

<a name="DataFrame+selectMany"></a>
### dataFrame.selectMany(selector)
Generate a new data frame based on the results of the selector function.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each row to a different data structure. |

<a name="DataFrame+getSeries"></a>
### dataFrame.getSeries(columnName)
Retreive a time-series from a column of the data-frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Specifies the column to retreive. |

<a name="DataFrame+hasSeries"></a>
### dataFrame.hasSeries(columnName)
Returns true if the column with the requested name exists in the data frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name of the column to check. |

<a name="DataFrame+expectSeries"></a>
### dataFrame.expectSeries(columnName)
Verify the existance of a column and return it.Throws an exception if the column doesn't exist.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name or index of the column to retreive. |

<a name="DataFrame+getColumns"></a>
### dataFrame.getColumns()
Retreive a collection of all columns.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+subset"></a>
### dataFrame.subset(columnNames)
Create a new data-frame from a subset of columns.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNames | <code>array</code> | Array of column names to include in the new data-frame. |

<a name="DataFrame+orderBy"></a>
### dataFrame.orderBy(columnNameOrIndexOrSelector)
Sorts a data frame based on a single column (specified by name or index) or by selector (ascending).

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndexOrSelector | <code>string</code> &#124; <code>index</code> &#124; <code>function</code> | A column name, column index or selector function that indicates the value to sort by. |

<a name="DataFrame+orderByDescending"></a>
### dataFrame.orderByDescending(columnNameOrIndexOrSelector)
Sorts a data frame based on a single column (specified by name or index) or by selector (descending).

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndexOrSelector | <code>string</code> &#124; <code>index</code> &#124; <code>function</code> | A column name, column index or selector function that indicates the value to sort by. |

<a name="DataFrame+dropColumns"></a>
### dataFrame.dropColumns(columnOrColumns)
Create a new data frame with the requested column or columns dropped.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column name (a string) or columns (array of column names) to drop. |

<a name="DataFrame+setSeries"></a>
### dataFrame.setSeries(columnName, data)
Create a new data frame with an additional column specified by the passed-in series.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | The name of the column to add or replace. |
| data | <code>array</code> &#124; <code>column</code> | Array of data or column that contains data. |

<a name="DataFrame+slice"></a>
### dataFrame.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])
Create a new data-frame from a slice of rows.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| startIndexOrStartPredicate | <code>int</code> &#124; <code>function</code> | Index where the slice starts or a predicate function that determines where the slice starts. |
| endIndexOrEndPredicate | <code>int</code> &#124; <code>function</code> | Marks the end of the slice, one row past the last row to include. Or a predicate function that determines when the slice has ended. |
| [predicate] | <code>function</code> | Optional predicate to compare index against start/end index. Return true to start or stop the slice. |

<a name="DataFrame+setIndex"></a>
### dataFrame.setIndex(columnName)
Set a named column as the index of the data-frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name or index of the column to set as the index. |

<a name="DataFrame+resetIndex"></a>
### dataFrame.resetIndex()
Reset the index of the data frame back to the default sequential integer index.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+toString"></a>
### dataFrame.toString()
Format the data frame for display as a string.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+parseInts"></a>
### dataFrame.parseInts(columnNameOrIndex)
Parse a column with string values to a column with int values.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Specifies the column to parse. |

<a name="DataFrame+parseFloats"></a>
### dataFrame.parseFloats(columnNameOrIndex)
Parse a column with string values to a column with float values.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Specifies the column to parse. |

<a name="DataFrame+parseDates"></a>
### dataFrame.parseDates(columnNameOrIndex, [formatString])
Parse a column with string values to a column with date values.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Specifies the column to parse. |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="DataFrame+toStrings"></a>
### dataFrame.toStrings(columnNameOrIndex, [formatString])
Convert a column of values of different types to a column of string values.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Specifies the column to convert. |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="DataFrame+detectTypes"></a>
### dataFrame.detectTypes()
Detect actual types and their frequencies contained within columns in the data frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+detectValues"></a>
### dataFrame.detectValues()
Detect values and their frequencies contained within columns in the data frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+truncateStrings"></a>
### dataFrame.truncateStrings(maxLength)
Produces a new data frame with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="DataFrame+remapColumns"></a>
### dataFrame.remapColumns(columnNames)
Create a new data frame with columns reordered.New column names create new columns (with undefined values), omitting existing column names causes those columns to be dropped.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNames | <code>array</code> | The new order for columns. |

<a name="DataFrame+renameColumns"></a>
### dataFrame.renameColumns(newColumnNames)
Create a new data frame with different column names.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| newColumnNames | <code>array</code> | Array of strings, with an element for each existing column that specifies the new name of that column. |

<a name="DataFrame+toValues"></a>
### dataFrame.toValues()
Bake the data frame to an array of rows.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+toObjects"></a>
### dataFrame.toObjects()
Bake the data frame to an array of JavaScript objects.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+toJSON"></a>
### dataFrame.toJSON()
Serialize the data frame to JSON.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+toCSV"></a>
### dataFrame.toCSV()
Serialize the data frame to CSV.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+toPairs"></a>
### dataFrame.toPairs()
Retreive the data as pairs of [index, objects].

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+bake"></a>
### dataFrame.bake()
Forces lazy evaluation to complete and 'bakes' the data frame into memory.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+count"></a>
### dataFrame.count()
Count the number of rows in the data frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+transformColumns"></a>
### dataFrame.transformColumns(columnSelectors)
Transform one or more columns. This is equivalent to extracting a column, calling 'select' on it,then plugging it back in as the same column.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnSelectors | <code>object</code> | Object with field names for each column to be transformed. Each field you be a selector that transforms that column. |

<a name="DataFrame+window"></a>
### dataFrame.window(period, selector)
Move a window over the data-frame (batch by batch), invoke a selector for each window that builds a new series.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of rows in the window. |
| selector | <code>function</code> | The selector function invoked per row that builds the output series. The selector has the following parameters:  		window - Data-frame that represents the rolling window. 		windowIndex - The 0-based index of the window. |

<a name="DataFrame+rollingWindow"></a>
### dataFrame.rollingWindow(period, selector)
Move a window over the data-frame (row by row), invoke a selector for each window that builds a new series.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of rows in the window. |
| selector | <code>function</code> | The selector function invoked per row that builds the output series. The selector has the following parameters:  		window - Data-frame that represents the rolling window. 		windowIndex - The 0-based index of the window. |

<a name="DataFrame+first"></a>
### dataFrame.first()
Get the first row of the data frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+last"></a>
### dataFrame.last()
Get the last row of the data frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+reverse"></a>
### dataFrame.reverse()
Reverse the data-frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="DataFrame+generateColumns"></a>
### dataFrame.generateColumns(selector)
Generate new columns based on existing rows.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each row to a new set of columns. |

<a name="DataFrame+deflate"></a>
### dataFrame.deflate(selector)
Deflate a data-frame to a series.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each row to a new sequence of values. |

<a name="DataFrame+inflateColumn"></a>
### dataFrame.inflateColumn(columnNameOrIndex, [selector])
Inflate a named column in the data-frame to 1 or more new columns.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Name or index of the column to retreive. |
| [selector] | <code>function</code> | Selector function that transforms each value in the column to new columns. |

<a name="DataFrame+head"></a>
### dataFrame.head(numRows)
Get X rows from the head of the data frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="DataFrame+tail"></a>
### dataFrame.tail(numRows)
Get X rows from the tail of the data frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="DataFrame+aggregate"></a>
### dataFrame.aggregate([seed], selector)
Aggregate the rows of the data-frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [seed] | <code>object</code> | The seed value for producing the aggregation. |
| selector | <code>function</code> | Function that takes the seed and then each row in the data-frame and produces the aggregate value. |

<a name="DataFrame+toObject"></a>
### dataFrame.toObject(keySelector, keySelector)
Convert the data-frame to a JavaScript object.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| keySelector | <code>function</code> | Function that selects keys for the resulting object. |
| keySelector | <code>valueSelector</code> | Function that selects values for the resulting object. |

<a name="DataFrame+zip"></a>
### dataFrame.zip(...dataFrames, selector)
Zip together multiple data-frames to produce a new data-frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| ...dataFrames | <code>object</code> | Each data-frame that is to be zipped. |
| selector | <code>function</code> | Selector function that produces a new data-frame based on the inputs. |

<a name="DataFrame+bringToFront"></a>
### dataFrame.bringToFront(columnOrColumns)
Bring the name column to the front, making it the first column in the data-frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column or columns to bring to the front. |

<a name="DataFrame+bringToBack"></a>
### dataFrame.bringToBack(columnOrColumns)
Bring the name column to the back, making it the last column in the data-frame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column or columns to bring to the back. |

<a name="Index"></a>
## Index()
Implements an index for a data frame or column.

**Kind**: global function  

* [Index()](#Index)
  * [.getIterator()](#Index+getIterator)
  * [.skip(numRows)](#Index+skip)
  * [.take(numRows)](#Index+take)
  * [.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])](#Index+slice)
  * [.count()](#Index+count)
  * [.first()](#Index+first)
  * [.last()](#Index+last)
  * [.reverse()](#Index+reverse)
  * [.head(values)](#Index+head)
  * [.tail(values)](#Index+tail)

<a name="Index+getIterator"></a>
### index.getIterator()
Get an iterator to iterate the values of the index.

**Kind**: instance method of <code>[Index](#Index)</code>  
<a name="Index+skip"></a>
### index.skip(numRows)
Skip a number of rows from the index.

**Kind**: instance method of <code>[Index](#Index)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to skip. |

<a name="Index+take"></a>
### index.take(numRows)
Take a number of rows from the index.

**Kind**: instance method of <code>[Index](#Index)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="Index+slice"></a>
### index.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])
Create a new index from a slice of rows.

**Kind**: instance method of <code>[Index](#Index)</code>  

| Param | Type | Description |
| --- | --- | --- |
| startIndexOrStartPredicate | <code>int</code> &#124; <code>function</code> | Index where the slice starts or a predicate function that determines where the slice starts. |
| endIndexOrEndPredicate | <code>int</code> &#124; <code>function</code> | Marks the end of the slice, one row past the last row to include. Or a predicate function that determines when the slice has ended. |
| [predicate] | <code>function</code> | Optional predicate to compare index against start/end index. Return true to start or stop the slice. |

<a name="Index+count"></a>
### index.count()
Count the number of rows in the index.

**Kind**: instance method of <code>[Index](#Index)</code>  
<a name="Index+first"></a>
### index.first()
Get the first row of the index.

**Kind**: instance method of <code>[Index](#Index)</code>  
<a name="Index+last"></a>
### index.last()
Get the last row of the index.

**Kind**: instance method of <code>[Index](#Index)</code>  
<a name="Index+reverse"></a>
### index.reverse()
Reverse the index.

**Kind**: instance method of <code>[Index](#Index)</code>  
<a name="Index+head"></a>
### index.head(values)
Get X values from the head of the index.

**Kind**: instance method of <code>[Index](#Index)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="Index+tail"></a>
### index.tail(values)
Get X values from the tail of the index.

**Kind**: instance method of <code>[Index](#Index)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="Series"></a>
## Series()
Represents a time series.

**Kind**: global function  

* [Series()](#Series)
  * [.getIterator()](#Series+getIterator)
  * [.getIndex()](#Series+getIndex)
  * [.skip(numRows)](#Series+skip)
  * [.skipWhile(predicate)](#Series+skipWhile)
  * [.skipUntil(predicate)](#Series+skipUntil)
  * [.take(numRows)](#Series+take)
  * [.takeWhile(predicate)](#Series+takeWhile)
  * [.takeUntil(predicate)](#Series+takeUntil)
  * [.where(filterSelectorPredicate)](#Series+where)
  * [.select(selector)](#Series+select)
  * [.selectMany(selector)](#Series+selectMany)
  * [.order()](#Series+order)
  * [.orderDescending()](#Series+orderDescending)
  * [.orderBy(sortSelector)](#Series+orderBy)
  * [.orderByDescending(sortSelector)](#Series+orderByDescending)
  * [.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])](#Series+slice)
  * [.window(period, selector)](#Series+window)
  * [.rollingWindow(period, selector)](#Series+rollingWindow)
  * [.reindex(newIndex)](#Series+reindex)
  * [.toString()](#Series+toString)
  * [.percentChange()](#Series+percentChange)
  * [.parseInts()](#Series+parseInts)
  * [.parseFloats()](#Series+parseFloats)
  * [.parseDates([formatString])](#Series+parseDates)
  * [.toStrings([formatString])](#Series+toStrings)
  * [.detectTypes()](#Series+detectTypes)
  * [.detectValues()](#Series+detectValues)
  * [.truncateStrings(maxLength)](#Series+truncateStrings)
  * [.bake()](#Series+bake)
  * [.toPairs()](#Series+toPairs)
  * [.count()](#Series+count)
  * [.first()](#Series+first)
  * [.last()](#Series+last)
  * [.reverse()](#Series+reverse)
  * [.inflate([selector])](#Series+inflate)
  * [.head(values)](#Series+head)
  * [.tail(values)](#Series+tail)
  * [.sum()](#Series+sum)
  * [.average()](#Series+average)
  * [.min()](#Series+min)
  * [.max()](#Series+max)
  * [.aggregate([seed], selector)](#Series+aggregate)
  * [.toObject(keySelector, keySelector)](#Series+toObject)
  * [.zip(...series, selector)](#Series+zip)

<a name="Series+getIterator"></a>
### series.getIterator()
Get an iterator for the iterating the values of the series.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+getIndex"></a>
### series.getIndex()
Retreive the index of the series.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+skip"></a>
### series.skip(numRows)
Skip a number of rows in the series.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to skip. |

<a name="Series+skipWhile"></a>
### series.skipWhile(predicate)
Skips values in the series while a condition is met.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="Series+skipUntil"></a>
### series.skipUntil(predicate)
Skips values in the series until a condition is met.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="Series+take"></a>
### series.take(numRows)
Take a number of rows in the series.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="Series+takeWhile"></a>
### series.takeWhile(predicate)
Take values from the series while a condition is met.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="Series+takeUntil"></a>
### series.takeUntil(predicate)
Take values from the series until a condition is met.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="Series+where"></a>
### series.where(filterSelectorPredicate)
Filter a series by a predicate selector.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| filterSelectorPredicate | <code>function</code> | Predicte function to filter rows of the series. |

<a name="Series+select"></a>
### series.select(selector)
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value to a different data structure. |

<a name="Series+selectMany"></a>
### series.selectMany(selector)
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value to a different data structure. |

<a name="Series+order"></a>
### series.order()
Sorts the series by value (ascending).

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+orderDescending"></a>
### series.orderDescending()
Sorts the series by value (descending).

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+orderBy"></a>
### series.orderBy(sortSelector)
Sorts the series by sort selector (ascending).

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | An function to select a value to sort by. |

<a name="Series+orderByDescending"></a>
### series.orderByDescending(sortSelector)
Sorts the series by sort selector (descending).

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | An function to select a value to sort by. |

<a name="Series+slice"></a>
### series.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])
Create a new series from a slice of rows.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| startIndexOrStartPredicate | <code>int</code> &#124; <code>function</code> | Index where the slice starts or a predicate function that determines where the slice starts. |
| endIndexOrEndPredicate | <code>int</code> &#124; <code>function</code> | Marks the end of the slice, one row past the last row to include. Or a predicate function that determines when the slice has ended. |
| [predicate] | <code>function</code> | Optional predicate to compare index against start/end index. Return true to start or stop the slice. |

<a name="Series+window"></a>
### series.window(period, selector)
Move a window over the series (batch by batch), invoke a selector for each window that builds a new series.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of rows in the window. |
| selector | <code>function</code> | The selector function invoked per row that builds the output series. The selector has the following parameters:  		window - Data-frame that represents the rolling window. 		windowIndex - The 0-based index of the window. |

<a name="Series+rollingWindow"></a>
### series.rollingWindow(period, selector)
Move a rolling window over the series (row by row), invoke a selector for each window that builds a new series.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of rows in the window. |
| selector | <code>function</code> | The selector function invoked per row that builds the output series. The selector has the following parameters:  		window - Series that represents the rolling window. 		windowIndex - The 0-based index of the window. |

<a name="Series+reindex"></a>
### series.reindex(newIndex)
Create a new series, reindexed from this series.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| newIndex | <code>index</code> | The index used to generate the new series. |

<a name="Series+toString"></a>
### series.toString()
Format the data frame for display as a string.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+percentChange"></a>
### series.percentChange()
Compute the percent change for each row after the first.Percentages are expressed as 0-1 values.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+parseInts"></a>
### series.parseInts()
Parse a series with string values to a series with int values.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+parseFloats"></a>
### series.parseFloats()
Parse a series with string values to a series with float values.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+parseDates"></a>
### series.parseDates([formatString])
Parse a series with string values to a series with date values.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="Series+toStrings"></a>
### series.toStrings([formatString])
Convert a series of values of different types to a series of string values.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="Series+detectTypes"></a>
### series.detectTypes()
Detect the actual types of the values that comprised the series and their frequency.Returns a new series containing the type information.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+detectValues"></a>
### series.detectValues()
Detect the frequency of values in the series.Returns a new series containing the information.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+truncateStrings"></a>
### series.truncateStrings(maxLength)
Produces a new series with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="Series+bake"></a>
### series.bake()
Forces lazy evaluation to complete and 'bakes' the series into memory.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+toPairs"></a>
### series.toPairs()
Retreive the data as pairs of [index, value].

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+count"></a>
### series.count()
Count the number of rows in the series.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+first"></a>
### series.first()
Get the first row of the series.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+last"></a>
### series.last()
Get the last row of the series.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+reverse"></a>
### series.reverse()
Reverse the series.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+inflate"></a>
### series.inflate([selector])
Inflate a series to a data-frame.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [selector] | <code>function</code> | Optional selector function that transforms each value in the series to a row in the new data-frame. |

<a name="Series+head"></a>
### series.head(values)
Get X values from the head of the series.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="Series+tail"></a>
### series.tail(values)
Get X values from the tail of the series.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="Series+sum"></a>
### series.sum()
Sum the values in a series.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+average"></a>
### series.average()
Average the values in a series.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+min"></a>
### series.min()
Get the min value in the series.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+max"></a>
### series.max()
Get the max value in the series.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+aggregate"></a>
### series.aggregate([seed], selector)
Aggregate the values in the series.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [seed] | <code>object</code> | The seed value for producing the aggregation. |
| selector | <code>function</code> | Function that takes the seed and then each value in the series and produces the aggregate value. |

<a name="Series+toObject"></a>
### series.toObject(keySelector, keySelector)
Convert the series to a JavaScript object.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| keySelector | <code>function</code> | Function that selects keys for the resulting object. |
| keySelector | <code>valueSelector</code> | Function that selects values for the resulting object. |

<a name="Series+zip"></a>
### series.zip(...series, selector)
Zip together multiple series to produce a new series.

**Kind**: instance method of <code>[Series](#Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| ...series | <code>series</code> | Each series that is to be zipped. |
| selector | <code>function</code> | Selector function that produces a new series based on the inputs. |

