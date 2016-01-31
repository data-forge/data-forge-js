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
<dt><a href="#BaseDataFrame">BaseDataFrame()</a></dt>
<dd><p>Base class for data frames.</p>
<p>Derived classes must implement:</p>
<p>getIndex - Get the index for the data frame.
getColumnNames - Get the columns for the data frame.
getIterator - Get a row iterator for the data frame.</p>
</dd>
<dt><a href="#BaseIndex">BaseIndex()</a></dt>
<dd><p>Base class for indexes.</p>
<p>Derives classes must implement:</p>
<pre><code>    getIterator - Get an iterator for iterating the values of the index.
</code></pre></dd>
<dt><a href="#BaseSeries">BaseSeries()</a></dt>
<dd><p>Base class for series.</p>
<p>getIterator - Get the iterator for the series.
getIndex - Get the index for the series.</p>
</dd>
<dt><a href="#Column">Column()</a></dt>
<dd><p>Represents a column in a data frame.</p>
</dd>
<dt><a href="#DataFrame">DataFrame(config)</a></dt>
<dd><p>Constructor for DataFrame.</p>
</dd>
<dt><a href="#Index">Index()</a></dt>
<dd><p>Implements an index for a data frame or column.</p>
</dd>
<dt><a href="#LazyIndex">LazyIndex()</a></dt>
<dd><p>Implements an lazy-evaluated index for a data frame or column.</p>
</dd>
<dt><a href="#LazySeries">LazySeries()</a></dt>
<dd><p>Represents a lazy-evaluated time-series.</p>
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
Merge data frames by index or a particular column.

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

<a name="BaseDataFrame"></a>
## BaseDataFrame()
Base class for data frames.Derived classes must implement:getIndex - Get the index for the data frame.getColumnNames - Get the columns for the data frame.getIterator - Get a row iterator for the data frame.

**Kind**: global function  

* [BaseDataFrame()](#BaseDataFrame)
    * [.getColumnIndex(columnName)](#BaseDataFrame+getColumnIndex) ⇒ <code>Number</code>
    * [.skip(numRows)](#BaseDataFrame+skip)
    * [.skipWhile(predicate)](#BaseDataFrame+skipWhile)
    * [.skipUntil(predicate)](#BaseDataFrame+skipUntil)
    * [.take(numRows)](#BaseDataFrame+take)
    * [.takeWhile(predicate)](#BaseDataFrame+takeWhile)
    * [.takeUntil(predicate)](#BaseDataFrame+takeUntil)
    * [.where(filterSelectorPredicate)](#BaseDataFrame+where)
    * [.select(selector)](#BaseDataFrame+select)
    * [.selectMany(selector)](#BaseDataFrame+selectMany)
    * [.getSeries(columnNameOrIndex)](#BaseDataFrame+getSeries)
    * [.hasSeries(columnName)](#BaseDataFrame+hasSeries)
    * [.expectSeries(columnNameOrIndex)](#BaseDataFrame+expectSeries)
    * [.getColumns()](#BaseDataFrame+getColumns)
    * [.orderBy(columnNameOrIndexOrSelector)](#BaseDataFrame+orderBy)
    * [.orderByDescending(columnNameOrIndexOrSelector)](#BaseDataFrame+orderByDescending)
    * [.dropColumn(columnOrColumns)](#BaseDataFrame+dropColumn)
    * [.setSeries(columnName, data)](#BaseDataFrame+setSeries)
    * [.getRowsSubset(startIndex, endIndex)](#BaseDataFrame+getRowsSubset)
    * [.setIndex(columnNameOrIndex)](#BaseDataFrame+setIndex)
    * [.resetIndex()](#BaseDataFrame+resetIndex)
    * [.toString()](#BaseDataFrame+toString)
    * [.parseInts(columnNameOrIndex)](#BaseDataFrame+parseInts)
    * [.parseFloats(columnNameOrIndex)](#BaseDataFrame+parseFloats)
    * [.parseDates(columnNameOrIndex)](#BaseDataFrame+parseDates)
    * [.toStrings()](#BaseDataFrame+toStrings)
    * [.detectTypes()](#BaseDataFrame+detectTypes)
    * [.detectValues()](#BaseDataFrame+detectValues)
    * [.truncateStrings(maxLength)](#BaseDataFrame+truncateStrings)
    * [.remapColumns(columnNames)](#BaseDataFrame+remapColumns)
    * [.renameColumns(newColumnNames)](#BaseDataFrame+renameColumns)
    * [.toValues()](#BaseDataFrame+toValues)
    * [.toObjects()](#BaseDataFrame+toObjects)
    * [.toJSON()](#BaseDataFrame+toJSON)
    * [.toCSV()](#BaseDataFrame+toCSV)
    * [.toPairs()](#BaseDataFrame+toPairs)
    * [.bake()](#BaseDataFrame+bake)
    * [.count()](#BaseDataFrame+count)
    * [.transformColumn(columnName, selector)](#BaseDataFrame+transformColumn)
    * [.rollingWindow(period, selector)](#BaseDataFrame+rollingWindow)
    * [.first()](#BaseDataFrame+first)
    * [.last()](#BaseDataFrame+last)
    * [.reverse()](#BaseDataFrame+reverse)
    * [.generateColumns(selector)](#BaseDataFrame+generateColumns)
    * [.deflate(selector)](#BaseDataFrame+deflate)
    * [.head(numRows)](#BaseDataFrame+head)
    * [.tail(numRows)](#BaseDataFrame+tail)

<a name="BaseDataFrame+getColumnIndex"></a>
### baseDataFrame.getColumnIndex(columnName) ⇒ <code>Number</code>
Gets a column index from a column name.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
**Returns**: <code>Number</code> - Returns the index of the named column or -1 if the requested column was not found.  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | The name of the column to retrieve the column index for. |

<a name="BaseDataFrame+skip"></a>
### baseDataFrame.skip(numRows)
Skip a number of rows in the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to skip. |

<a name="BaseDataFrame+skipWhile"></a>
### baseDataFrame.skipWhile(predicate)
Skips rows in the data-frame while a condition is met.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="BaseDataFrame+skipUntil"></a>
### baseDataFrame.skipUntil(predicate)
Skips rows in the data-frame until a condition is met.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="BaseDataFrame+take"></a>
### baseDataFrame.take(numRows)
Take a number of rows in the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="BaseDataFrame+takeWhile"></a>
### baseDataFrame.takeWhile(predicate)
Take rows from the data-frame while a condition is met.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="BaseDataFrame+takeUntil"></a>
### baseDataFrame.takeUntil(predicate)
Take rows from the data-frame until a condition is met.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="BaseDataFrame+where"></a>
### baseDataFrame.where(filterSelectorPredicate)
Filter a data frame by a predicate selector.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| filterSelectorPredicate | <code>function</code> | Predicte function to filter rows of the data frame. |

<a name="BaseDataFrame+select"></a>
### baseDataFrame.select(selector)
Generate a new data frame based on the results of the selector function.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each row to a different data structure. |

<a name="BaseDataFrame+selectMany"></a>
### baseDataFrame.selectMany(selector)
Generate a new data frame based on the results of the selector function.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each row to a different data structure. |

<a name="BaseDataFrame+getSeries"></a>
### baseDataFrame.getSeries(columnNameOrIndex)
Retreive a time-series from a column of the data-frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Name or index of the column to retreive. |

<a name="BaseDataFrame+hasSeries"></a>
### baseDataFrame.hasSeries(columnName)
Returns true if the column with the requested name exists in the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name of the column to check. |

<a name="BaseDataFrame+expectSeries"></a>
### baseDataFrame.expectSeries(columnNameOrIndex)
Verify the existance of a column and return it.Throws an exception if the column doesn't exist.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Name or index of the column to retreive. |

<a name="BaseDataFrame+getColumns"></a>
### baseDataFrame.getColumns()
Retreive a collection of all columns.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+orderBy"></a>
### baseDataFrame.orderBy(columnNameOrIndexOrSelector)
Sorts a data frame based on a single column (specified by name or index) or by selector (ascending).

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndexOrSelector | <code>string</code> &#124; <code>index</code> &#124; <code>function</code> | A column name, column index or selector function that indicates the value to sort by. |

<a name="BaseDataFrame+orderByDescending"></a>
### baseDataFrame.orderByDescending(columnNameOrIndexOrSelector)
Sorts a data frame based on a single column (specified by name or index) or by selector (descending).

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndexOrSelector | <code>string</code> &#124; <code>index</code> &#124; <code>function</code> | A column name, column index or selector function that indicates the value to sort by. |

<a name="BaseDataFrame+dropColumn"></a>
### baseDataFrame.dropColumn(columnOrColumns)
Create a new data frame with the requested column or columns dropped.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column name (a string) or columns (array of column names) to drop. |

<a name="BaseDataFrame+setSeries"></a>
### baseDataFrame.setSeries(columnName, data)
Create a new data frame with an additional column specified by the passed-in series.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | The name of the column to add or replace. |
| data | <code>array</code> &#124; <code>column</code> | Array of data or column that contains data. |

<a name="BaseDataFrame+getRowsSubset"></a>
### baseDataFrame.getRowsSubset(startIndex, endIndex)
Get a subset of rows from the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| startIndex | <code>int</code> | Index where the subset starts. |
| endIndex | <code>int</code> | Marks the end of the subset, one row past the last row to include. |

<a name="BaseDataFrame+setIndex"></a>
### baseDataFrame.setIndex(columnNameOrIndex)
Set a column as the index of the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Name or index of the column to set as the index. |

<a name="BaseDataFrame+resetIndex"></a>
### baseDataFrame.resetIndex()
Reset the index of the data frame back to the default sequential integer index.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+toString"></a>
### baseDataFrame.toString()
Format the data frame for display as a string.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+parseInts"></a>
### baseDataFrame.parseInts(columnNameOrIndex)
Parse a column with string values to a column with int values.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Specifies the column to parse. |

<a name="BaseDataFrame+parseFloats"></a>
### baseDataFrame.parseFloats(columnNameOrIndex)
Parse a column with string values to a column with float values.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Specifies the column to parse. |

<a name="BaseDataFrame+parseDates"></a>
### baseDataFrame.parseDates(columnNameOrIndex)
Parse a column with string values to a column with date values.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Specifies the column to parse. |

<a name="BaseDataFrame+toStrings"></a>
### baseDataFrame.toStrings()
Convert a column of values of different types to a column of string values.* @param {string|int} columnNameOrIndex - Specifies the column to convert.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+detectTypes"></a>
### baseDataFrame.detectTypes()
Detect actual types and their frequencies contained within columns in the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+detectValues"></a>
### baseDataFrame.detectValues()
Detect values and their frequencies contained within columns in the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+truncateStrings"></a>
### baseDataFrame.truncateStrings(maxLength)
Produces a new data frame with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="BaseDataFrame+remapColumns"></a>
### baseDataFrame.remapColumns(columnNames)
Create a new data frame with columns reordered.New column names create new columns (with undefined values), omitting existing column names causes those columns to be dropped.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNames | <code>array</code> | The new order for columns. |

<a name="BaseDataFrame+renameColumns"></a>
### baseDataFrame.renameColumns(newColumnNames)
Create a new data frame with different column names.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| newColumnNames | <code>array</code> | Array of strings, with an element for each existing column that specifies the new name of that column. |

<a name="BaseDataFrame+toValues"></a>
### baseDataFrame.toValues()
Bake the data frame to an array of rows.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+toObjects"></a>
### baseDataFrame.toObjects()
Bake the data frame to an array of JavaScript objects.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+toJSON"></a>
### baseDataFrame.toJSON()
Serialize the data frame to JSON.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+toCSV"></a>
### baseDataFrame.toCSV()
Serialize the data frame to CSV.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+toPairs"></a>
### baseDataFrame.toPairs()
Retreive the data as pairs of [index, objects].

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+bake"></a>
### baseDataFrame.bake()
Forces lazy evaluation to complete and 'bakes' the data frame into memory.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+count"></a>
### baseDataFrame.count()
Count the number of rows in the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+transformColumn"></a>
### baseDataFrame.transformColumn(columnName, selector)
Transform a column. This is equivalent to extracting a column, calling 'select' on it,then plugging it back in as the same column.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name of the column to transform. |
| selector | <code>function</code> | Selector function that transforms each row to a different data structure. |

<a name="BaseDataFrame+rollingWindow"></a>
### baseDataFrame.rollingWindow(period, selector)
Move a rolling window over the data frame, invoke a selector function to build a new data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of entries to include in the window. |
| selector | <code>function</code> | The selector function that builds the output series. The selector has the following parameters:  		window - Data-frame that represents the rolling window. 		windowIndex - The 0-based index of the window. |

<a name="BaseDataFrame+first"></a>
### baseDataFrame.first()
Get the first row of the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+last"></a>
### baseDataFrame.last()
Get the last row of the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+reverse"></a>
### baseDataFrame.reverse()
Reverse the data-frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+generateColumns"></a>
### baseDataFrame.generateColumns(selector)
Generate new columns based on existing rows.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each row to a new set of columns. |

<a name="BaseDataFrame+deflate"></a>
### baseDataFrame.deflate(selector)
Deflate a data-frame to a series.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each row to a new sequence of values. |

<a name="BaseDataFrame+head"></a>
### baseDataFrame.head(numRows)
Get X rows from the head of the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="BaseDataFrame+tail"></a>
### baseDataFrame.tail(numRows)
Get X rows from the tail of the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="BaseIndex"></a>
## BaseIndex()
Base class for indexes.Derives classes must implement:		getIterator - Get an iterator for iterating the values of the index.

**Kind**: global function  

* [BaseIndex()](#BaseIndex)
    * [.skip(numRows)](#BaseIndex+skip)
    * [.take(numRows)](#BaseIndex+take)
    * [.getRowsSubset(startIndex, endIndex)](#BaseIndex+getRowsSubset)
    * [.count()](#BaseIndex+count)
    * [.first()](#BaseIndex+first)
    * [.last()](#BaseIndex+last)
    * [.reverse()](#BaseIndex+reverse)
    * [.head(values)](#BaseIndex+head)
    * [.tail(values)](#BaseIndex+tail)

<a name="BaseIndex+skip"></a>
### baseIndex.skip(numRows)
Skip a number of rows from the index.

**Kind**: instance method of <code>[BaseIndex](#BaseIndex)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to skip. |

<a name="BaseIndex+take"></a>
### baseIndex.take(numRows)
Take a number of rows from the index.

**Kind**: instance method of <code>[BaseIndex](#BaseIndex)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="BaseIndex+getRowsSubset"></a>
### baseIndex.getRowsSubset(startIndex, endIndex)
Get a subset of rows from the index.

**Kind**: instance method of <code>[BaseIndex](#BaseIndex)</code>  

| Param | Type | Description |
| --- | --- | --- |
| startIndex | <code>int</code> | Index where the subset starts. |
| endIndex | <code>int</code> | Marks the end of the subset, one row past the last row to include. |

<a name="BaseIndex+count"></a>
### baseIndex.count()
Count the number of rows in the index.

**Kind**: instance method of <code>[BaseIndex](#BaseIndex)</code>  
<a name="BaseIndex+first"></a>
### baseIndex.first()
Get the first row of the index.

**Kind**: instance method of <code>[BaseIndex](#BaseIndex)</code>  
<a name="BaseIndex+last"></a>
### baseIndex.last()
Get the last row of the index.

**Kind**: instance method of <code>[BaseIndex](#BaseIndex)</code>  
<a name="BaseIndex+reverse"></a>
### baseIndex.reverse()
Reverse the index.

**Kind**: instance method of <code>[BaseIndex](#BaseIndex)</code>  
<a name="BaseIndex+head"></a>
### baseIndex.head(values)
Get X values from the head of the index.

**Kind**: instance method of <code>[BaseIndex](#BaseIndex)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="BaseIndex+tail"></a>
### baseIndex.tail(values)
Get X values from the tail of the index.

**Kind**: instance method of <code>[BaseIndex](#BaseIndex)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="BaseSeries"></a>
## BaseSeries()
Base class for series.getIterator - Get the iterator for the series.getIndex - Get the index for the series.

**Kind**: global function  

* [BaseSeries()](#BaseSeries)
    * [.skip(numRows)](#BaseSeries+skip)
    * [.skipWhile(predicate)](#BaseSeries+skipWhile)
    * [.skipUntil(predicate)](#BaseSeries+skipUntil)
    * [.take(numRows)](#BaseSeries+take)
    * [.takeWhile(predicate)](#BaseSeries+takeWhile)
    * [.takeUntil(predicate)](#BaseSeries+takeUntil)
    * [.where(filterSelectorPredicate)](#BaseSeries+where)
    * [.select(selector)](#BaseSeries+select)
    * [.selectMany(selector)](#BaseSeries+selectMany)
    * [.order()](#BaseSeries+order)
    * [.orderDescending()](#BaseSeries+orderDescending)
    * [.orderBy(sortSelector)](#BaseSeries+orderBy)
    * [.orderByDescending(sortSelector)](#BaseSeries+orderByDescending)
    * [.getRowsSubset(startIndex, endIndex)](#BaseSeries+getRowsSubset)
    * [.rollingWindow(period, selector)](#BaseSeries+rollingWindow)
    * [.reindex(newIndex)](#BaseSeries+reindex)
    * [.toString()](#BaseSeries+toString)
    * [.percentChange()](#BaseSeries+percentChange)
    * [.parseInts()](#BaseSeries+parseInts)
    * [.parseFloats()](#BaseSeries+parseFloats)
    * [.parseDates()](#BaseSeries+parseDates)
    * [.toStrings()](#BaseSeries+toStrings)
    * [.detectTypes()](#BaseSeries+detectTypes)
    * [.detectValues()](#BaseSeries+detectValues)
    * [.truncateStrings(maxLength)](#BaseSeries+truncateStrings)
    * [.bake()](#BaseSeries+bake)
    * [.toPairs()](#BaseSeries+toPairs)
    * [.count()](#BaseSeries+count)
    * [.first()](#BaseSeries+first)
    * [.last()](#BaseSeries+last)
    * [.reverse()](#BaseSeries+reverse)
    * [.inflate(selector)](#BaseSeries+inflate)
    * [.head(values)](#BaseSeries+head)
    * [.tail(values)](#BaseSeries+tail)

<a name="BaseSeries+skip"></a>
### baseSeries.skip(numRows)
Skip a number of rows in the series.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to skip. |

<a name="BaseSeries+skipWhile"></a>
### baseSeries.skipWhile(predicate)
Skips values in the series while a condition is met.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="BaseSeries+skipUntil"></a>
### baseSeries.skipUntil(predicate)
Skips values in the series until a condition is met.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="BaseSeries+take"></a>
### baseSeries.take(numRows)
Take a number of rows in the series.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="BaseSeries+takeWhile"></a>
### baseSeries.takeWhile(predicate)
Take values from the series while a condition is met.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="BaseSeries+takeUntil"></a>
### baseSeries.takeUntil(predicate)
Take values from the series until a condition is met.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="BaseSeries+where"></a>
### baseSeries.where(filterSelectorPredicate)
Filter a series by a predicate selector.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| filterSelectorPredicate | <code>function</code> | Predicte function to filter rows of the series. |

<a name="BaseSeries+select"></a>
### baseSeries.select(selector)
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value to a different data structure. |

<a name="BaseSeries+selectMany"></a>
### baseSeries.selectMany(selector)
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value to a different data structure. |

<a name="BaseSeries+order"></a>
### baseSeries.order()
Sorts the series by value (ascending).

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+orderDescending"></a>
### baseSeries.orderDescending()
Sorts the series by value (descending).

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+orderBy"></a>
### baseSeries.orderBy(sortSelector)
Sorts the series by sort selector (ascending).

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | An function to select a value to sort by. |

<a name="BaseSeries+orderByDescending"></a>
### baseSeries.orderByDescending(sortSelector)
Sorts the series by sort selector (descending).

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | An function to select a value to sort by. |

<a name="BaseSeries+getRowsSubset"></a>
### baseSeries.getRowsSubset(startIndex, endIndex)
Get a subset of rows from the series.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| startIndex | <code>int</code> | Index where the subset starts. |
| endIndex | <code>int</code> | Marks the end of the subset, one row past the last row to include. |

<a name="BaseSeries+rollingWindow"></a>
### baseSeries.rollingWindow(period, selector)
Move a rolling window over the series, invoke a selector function to build a new series.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of entries to include in the window. |
| selector | <code>function</code> | The selector function that builds the output series. The selector has the following parameters:  		window - Series that represents the rolling window. 		windowIndex - The 0-based index of the window. |

<a name="BaseSeries+reindex"></a>
### baseSeries.reindex(newIndex)
Create a new series, reindexed from this series.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| newIndex | <code>index</code> | The index used to generate the new series. |

<a name="BaseSeries+toString"></a>
### baseSeries.toString()
Format the data frame for display as a string.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+percentChange"></a>
### baseSeries.percentChange()
Compute the percent change for each row after the first.Percentages are expressed as 0-1 values.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+parseInts"></a>
### baseSeries.parseInts()
Parse a series with string values to a series with int values.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+parseFloats"></a>
### baseSeries.parseFloats()
Parse a series with string values to a series with float values.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+parseDates"></a>
### baseSeries.parseDates()
Parse a series with string values to a series with date values.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+toStrings"></a>
### baseSeries.toStrings()
Convert a series of values of different types to a series of string values.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+detectTypes"></a>
### baseSeries.detectTypes()
Detect the actual types of the values that comprised the series and their frequency.Returns a new series containing the type information.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+detectValues"></a>
### baseSeries.detectValues()
Detect the frequency of values in the series.Returns a new series containing the information.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+truncateStrings"></a>
### baseSeries.truncateStrings(maxLength)
Produces a new series with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="BaseSeries+bake"></a>
### baseSeries.bake()
Forces lazy evaluation to complete and 'bakes' the series into memory.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+toPairs"></a>
### baseSeries.toPairs()
Retreive the data as pairs of [index, value].

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+count"></a>
### baseSeries.count()
Count the number of rows in the series.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+first"></a>
### baseSeries.first()
Get the first row of the series.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+last"></a>
### baseSeries.last()
Get the last row of the series.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+reverse"></a>
### baseSeries.reverse()
Reverse the series.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  
<a name="BaseSeries+inflate"></a>
### baseSeries.inflate(selector)
Inflate a series to a data-frame.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value in the series to a row in the new data-frame. |

<a name="BaseSeries+head"></a>
### baseSeries.head(values)
Get X values from the head of the series.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="BaseSeries+tail"></a>
### baseSeries.tail(values)
Get X values from the tail of the series.

**Kind**: instance method of <code>[BaseSeries](#BaseSeries)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="Column"></a>
## Column()
Represents a column in a data frame.

**Kind**: global function  

* [Column()](#Column)
    * [.getName()](#Column+getName)
    * [.getSeries()](#Column+getSeries)
    * [.toString()](#Column+toString)

<a name="Column+getName"></a>
### column.getName()
Retreive the name of the column.

**Kind**: instance method of <code>[Column](#Column)</code>  
<a name="Column+getSeries"></a>
### column.getSeries()
Retreive the time-series for the column.

**Kind**: instance method of <code>[Column](#Column)</code>  
<a name="Column+toString"></a>
### column.toString()
Format the column for display as a string.

**Kind**: instance method of <code>[Column](#Column)</code>  
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
Get an iterator to enumerate the rows of the DataFrame.

**Kind**: instance method of <code>[DataFrame](#DataFrame)</code>  
<a name="Index"></a>
## Index()
Implements an index for a data frame or column.

**Kind**: global function  
<a name="Index+getIterator"></a>
### index.getIterator()
Get an iterator to iterate the values of the index.

**Kind**: instance method of <code>[Index](#Index)</code>  
<a name="LazyIndex"></a>
## LazyIndex()
Implements an lazy-evaluated index for a data frame or column.

**Kind**: global function  
<a name="LazyIndex+getIterator"></a>
### lazyIndex.getIterator()
Get an iterator to iterate the values of the index.

**Kind**: instance method of <code>[LazyIndex](#LazyIndex)</code>  
<a name="LazySeries"></a>
## LazySeries()
Represents a lazy-evaluated time-series.

**Kind**: global function  
<a name="LazySeries+getIterator"></a>
### lazySeries.getIterator()
Get an iterator for the iterating the values of the series.

**Kind**: instance method of <code>[LazySeries](#LazySeries)</code>  
<a name="Series"></a>
## Series()
Represents a time series.

**Kind**: global function  

* [Series()](#Series)
    * [.getIterator()](#Series+getIterator)
    * [.getIndex()](#Series+getIndex)

<a name="Series+getIterator"></a>
### series.getIterator()
Get an iterator for the iterating the values of the series.

**Kind**: instance method of <code>[Series](#Series)</code>  
<a name="Series+getIndex"></a>
### series.getIndex()
Retreive the index of the series.

**Kind**: instance method of <code>[Series](#Series)</code>  
