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
<dt><a href="#as">as()</a></dt>
<dd><p>Convert DataFrame from a particular data format using a plugable format.</p>
</dd>
<dt><a href="#as">as()</a></dt>
<dd><p>Convert DataFrame from a particular data format using a plugable format.</p>
</dd>
<dt><a href="#BaseColumn">BaseColumn()</a></dt>
<dd><p>Base class for columns.</p>
<p>getName - Get the name of the column.
getValues - Get the values for each entry in the series.
getIndex - Get the index for the column.</p>
</dd>
<dt><a href="#BaseDataFrame">BaseDataFrame()</a></dt>
<dd><p>Base class for data frames.</p>
<p>Derived classes must implement:</p>
<p>getIndex - Get the index for the data frame.
getColumnNames - Get the columns for the data frame.
getValues - Get the values for the data frame.</p>
</dd>
<dt><a href="#BaseIndex">BaseIndex()</a></dt>
<dd><p>Base class for indexes.</p>
<p>Derives classes must implement:</p>
<pre><code>    getName - Get the name of theindex.
    getValues - Get the array of values from the index.
</code></pre></dd>
<dt><a href="#Column">Column()</a></dt>
<dd><p>Represents a column in a data frame.</p>
</dd>
<dt><a href="#Index">Index()</a></dt>
<dd><p>Implements an index for a data frame or column.</p>
</dd>
<dt><a href="#LazyColumn">LazyColumn()</a></dt>
<dd><p>Represents a lazy-evaluated column in a data frame.</p>
</dd>
<dt><a href="#LazyIndex">LazyIndex()</a></dt>
<dd><p>Implements an lazy-evaluated index for a data frame or column.</p>
</dd>
</dl>
<a name="dataForge"></a>
## dataForge
Main namespace for Data-Forge.Nodejs:		npm install --save data-forge				var dataForge = require('data-forge');Browser:		bower install --save data-forge		<script language="javascript" type="text/javascript" src="bower_components/data-forge/data-forge.js"></script>

**Kind**: global variable  

* [dataForge](#dataForge)
  * [.from()](#dataForge.from)
  * [.fromSync()](#dataForge.fromSync)
  * [.merge(leftDataFrame, rightDataFrame, [columnName])](#dataForge.merge)
  * [.concat(dataFrames)](#dataForge.concat)

<a name="dataForge.from"></a>
### dataForge.from()
Read a DataFrame asynchronously from a plugable data source.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
<a name="dataForge.fromSync"></a>
### dataForge.fromSync()
Read a DataFrame synchronously from a plugable data source.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
<a name="dataForge.merge"></a>
### dataForge.merge(leftDataFrame, rightDataFrame, [columnName])
Merge data frames by index or a particular column.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| leftDataFrame | <code>DataFrame</code> | One data frame to merge. |
| rightDataFrame | <code>DataFrame</code> | The other data frame to merge. |
| [columnName] | <code>string</code> | The name of the column to merge on. Optional, when not specified merge is based on the index. |

<a name="dataForge.concat"></a>
### dataForge.concat(dataFrames)
Concatenate multiple data frames into a single.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| dataFrames | <code>array</code> | Array of data frames to concatenate. |

<a name="as"></a>
## as()
Convert DataFrame from a particular data format using a plugable format.

**Kind**: global function  
<a name="as"></a>
## as()
Convert DataFrame from a particular data format using a plugable format.

**Kind**: global function  
<a name="BaseColumn"></a>
## BaseColumn()
Base class for columns.getName - Get the name of the column.getValues - Get the values for each entry in the series.getIndex - Get the index for the column.

**Kind**: global function  

* [BaseColumn()](#BaseColumn)
  * [.skip(numRows)](#BaseColumn+skip)
  * [.take(numRows)](#BaseColumn+take)
  * [.where(filterSelectorPredicate)](#BaseColumn+where)
  * [.select(selector)](#BaseColumn+select)
  * [.selectMany(selector)](#BaseColumn+selectMany)
  * [.order()](#BaseColumn+order)
  * [.orderDescending()](#BaseColumn+orderDescending)
  * [.orderBy(sortSelector)](#BaseColumn+orderBy)
  * [.orderByDescending(sortSelector)](#BaseColumn+orderByDescending)
  * [.getRowsSubset(index, count)](#BaseColumn+getRowsSubset)
  * [.rollingWindow(period, fn)](#BaseColumn+rollingWindow)
  * [.reindex(newIndex)](#BaseColumn+reindex)
  * [.toString()](#BaseColumn+toString)
  * [.percentChange()](#BaseColumn+percentChange)
  * [.parseInts()](#BaseColumn+parseInts)
  * [.parseFloats()](#BaseColumn+parseFloats)
  * [.parseDates()](#BaseColumn+parseDates)
  * [.toStrings()](#BaseColumn+toStrings)
  * [.detectTypes()](#BaseColumn+detectTypes)
  * [.truncateStrings(maxLength)](#BaseColumn+truncateStrings)

<a name="BaseColumn+skip"></a>
### baseColumn.skip(numRows)
Skip a number of rows in the column.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to skip. |

<a name="BaseColumn+take"></a>
### baseColumn.take(numRows)
Take a number of rows in the column.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="BaseColumn+where"></a>
### baseColumn.where(filterSelectorPredicate)
Filter a column by a predicate selector.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  

| Param | Type | Description |
| --- | --- | --- |
| filterSelectorPredicate | <code>function</code> | Predicte function to filter rows of the column. |

<a name="BaseColumn+select"></a>
### baseColumn.select(selector)
Generate a new column based on the results of the selector function.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value to a different data structure. |

<a name="BaseColumn+selectMany"></a>
### baseColumn.selectMany(selector)
Generate a new column based on the results of the selector function.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value to a different data structure. |

<a name="BaseColumn+order"></a>
### baseColumn.order()
Sorts the column by value (ascending).

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  
<a name="BaseColumn+orderDescending"></a>
### baseColumn.orderDescending()
Sorts the column by value (descending).

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  
<a name="BaseColumn+orderBy"></a>
### baseColumn.orderBy(sortSelector)
Sorts the column by sort selector (ascending).

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | An function to select a value to sort by. |

<a name="BaseColumn+orderByDescending"></a>
### baseColumn.orderByDescending(sortSelector)
Sorts the column by sort selector (descending).

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | An function to select a value to sort by. |

<a name="BaseColumn+getRowsSubset"></a>
### baseColumn.getRowsSubset(index, count)
Get a subset of rows from the column.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>int</code> | Index where the subset starts. |
| count | <code>int</code> | Number of rows to include in the subset. |

<a name="BaseColumn+rollingWindow"></a>
### baseColumn.rollingWindow(period, fn)
Execute code over a moving window to produce a new data frame.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of entries to include in the window. |
| fn | <code>function</code> | The function to invoke on each window. |

<a name="BaseColumn+reindex"></a>
### baseColumn.reindex(newIndex)
Create a new column, reindexed from this column.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  

| Param | Type | Description |
| --- | --- | --- |
| newIndex | <code>index</code> | The index used to generate the new column. |

<a name="BaseColumn+toString"></a>
### baseColumn.toString()
Format the data frame for display as a string.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  
<a name="BaseColumn+percentChange"></a>
### baseColumn.percentChange()
Compute the percent change for each row after the first.Percentages are expressed as 0-1 values.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  
<a name="BaseColumn+parseInts"></a>
### baseColumn.parseInts()
Parse a column with string values to a column with int values.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  
<a name="BaseColumn+parseFloats"></a>
### baseColumn.parseFloats()
Parse a column with string values to a column with float values.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  
<a name="BaseColumn+parseDates"></a>
### baseColumn.parseDates()
Parse a column with string values to a column with date values.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  
<a name="BaseColumn+toStrings"></a>
### baseColumn.toStrings()
Convert a column of values of different types to a column of string values.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  
<a name="BaseColumn+detectTypes"></a>
### baseColumn.detectTypes()
Detect the actual types of the values that comprised the column and their frequency.Returns a new column containing the type information.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  
<a name="BaseColumn+truncateStrings"></a>
### baseColumn.truncateStrings(maxLength)
Produces a new column with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[BaseColumn](#BaseColumn)</code>  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="BaseDataFrame"></a>
## BaseDataFrame()
Base class for data frames.Derived classes must implement:getIndex - Get the index for the data frame.getColumnNames - Get the columns for the data frame.getValues - Get the values for the data frame.

**Kind**: global function  

* [BaseDataFrame()](#BaseDataFrame)
  * [.getColumnIndex(columnName)](#BaseDataFrame+getColumnIndex) ⇒ <code>Number</code>
  * [.skip(numRows)](#BaseDataFrame+skip)
  * [.take(numRows)](#BaseDataFrame+take)
  * [.where(filterSelectorPredicate)](#BaseDataFrame+where)
  * [.select(selector)](#BaseDataFrame+select)
  * [.selectMany(selector)](#BaseDataFrame+selectMany)
  * [.getColumns()](#BaseDataFrame+getColumns)
  * [.orderBy(columnNameOrIndexOrSelector)](#BaseDataFrame+orderBy)
  * [.orderByDescending(columnNameOrIndexOrSelector)](#BaseDataFrame+orderByDescending)
  * [.dropColumn(columnOrColumns)](#BaseDataFrame+dropColumn)
  * [.setColumn(columnName, data)](#BaseDataFrame+setColumn)
  * [.getRowsSubset(index, count)](#BaseDataFrame+getRowsSubset)
  * [.setIndex(columnNameOrIndex)](#BaseDataFrame+setIndex)
  * [.resetIndex()](#BaseDataFrame+resetIndex)
  * [.toString()](#BaseDataFrame+toString)
  * [.parseInts()](#BaseDataFrame+parseInts)
  * [.parseFloats()](#BaseDataFrame+parseFloats)
  * [.parseDates()](#BaseDataFrame+parseDates)
  * [.toStrings()](#BaseDataFrame+toStrings)
  * [.detectTypes()](#BaseDataFrame+detectTypes)
  * [.truncateStrings(maxLength)](#BaseDataFrame+truncateStrings)

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

<a name="BaseDataFrame+take"></a>
### baseDataFrame.take(numRows)
Take a number of rows in the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

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

<a name="BaseDataFrame+setColumn"></a>
### baseDataFrame.setColumn(columnName, data)
Create a new data frame with and additional or replaced column.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | The name of the column to add or replace. |
| data | <code>array</code> &#124; <code>column</code> | Array of data or column that contains data. |

<a name="BaseDataFrame+getRowsSubset"></a>
### baseDataFrame.getRowsSubset(index, count)
Get a subset of rows from the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>int</code> | Index where the subset starts. |
| count | <code>int</code> | Number of rows to include in the subset. |

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
### baseDataFrame.parseInts()
Parse a column with string values to a column with int values.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+parseFloats"></a>
### baseDataFrame.parseFloats()
Parse a column with string values to a column with float values.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+parseDates"></a>
### baseDataFrame.parseDates()
Parse a column with string values to a column with date values.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+toStrings"></a>
### baseDataFrame.toStrings()
Convert a column of values of different types to a column of string values.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+detectTypes"></a>
### baseDataFrame.detectTypes()
Detect actual types and their frequencies contained within columns in the data frame.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  
<a name="BaseDataFrame+truncateStrings"></a>
### baseDataFrame.truncateStrings(maxLength)
Produces a new data frame with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[BaseDataFrame](#BaseDataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="BaseIndex"></a>
## BaseIndex()
Base class for indexes.Derives classes must implement:		getName - Get the name of theindex.		getValues - Get the array of values from the index.

**Kind**: global function  

* [BaseIndex()](#BaseIndex)
  * [.skip(numRows)](#BaseIndex+skip)
  * [.take(numRows)](#BaseIndex+take)
  * [.getRowsSubset(index, count)](#BaseIndex+getRowsSubset)

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
### baseIndex.getRowsSubset(index, count)
Get a subset of rows from the index.

**Kind**: instance method of <code>[BaseIndex](#BaseIndex)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>int</code> | Index where the subset starts. |
| count | <code>int</code> | Number of rows to include in the subset. |

<a name="Column"></a>
## Column()
Represents a column in a data frame.

**Kind**: global function  

* [Column()](#Column)
  * [.getName()](#Column+getName)
  * [.getValues()](#Column+getValues)
  * [.getIndex()](#Column+getIndex)

<a name="Column+getName"></a>
### column.getName()
Retreive the name of the column.

**Kind**: instance method of <code>[Column](#Column)</code>  
<a name="Column+getValues"></a>
### column.getValues()
Retreive the values of the column.

**Kind**: instance method of <code>[Column](#Column)</code>  
<a name="Column+getIndex"></a>
### column.getIndex()
Retreive the index of the column.

**Kind**: instance method of <code>[Column](#Column)</code>  
<a name="Index"></a>
## Index()
Implements an index for a data frame or column.

**Kind**: global function  

* [Index()](#Index)
  * [.getName()](#Index+getName)
  * [.getValues()](#Index+getValues)

<a name="Index+getName"></a>
### index.getName()
Get the name of the index.

**Kind**: instance method of <code>[Index](#Index)</code>  
<a name="Index+getValues"></a>
### index.getValues()
Get the array of values from the index.

**Kind**: instance method of <code>[Index](#Index)</code>  
<a name="LazyColumn"></a>
## LazyColumn()
Represents a lazy-evaluated column in a data frame.

**Kind**: global function  

* [LazyColumn()](#LazyColumn)
  * [.getName()](#LazyColumn+getName)
  * [.getValues()](#LazyColumn+getValues)

<a name="LazyColumn+getName"></a>
### lazyColumn.getName()
Retreive the name of the column.

**Kind**: instance method of <code>[LazyColumn](#LazyColumn)</code>  
<a name="LazyColumn+getValues"></a>
### lazyColumn.getValues()
Retreive the values of the column.

**Kind**: instance method of <code>[LazyColumn](#LazyColumn)</code>  
<a name="LazyIndex"></a>
## LazyIndex()
Implements an lazy-evaluated index for a data frame or column.

**Kind**: global function  

* [LazyIndex()](#LazyIndex)
  * [.getName()](#LazyIndex+getName)
  * [.getValues()](#LazyIndex+getValues)

<a name="LazyIndex+getName"></a>
### lazyIndex.getName()
Get the name of the index.

**Kind**: instance method of <code>[LazyIndex](#LazyIndex)</code>  
<a name="LazyIndex+getValues"></a>
### lazyIndex.getValues()
Get the array of values from the index.

**Kind**: instance method of <code>[LazyIndex](#LazyIndex)</code>  
