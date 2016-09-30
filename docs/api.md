<a name="data-forge"></a>

## data-forge : <code>object</code>
Main namespace for Data-Forge.

Nodejs:

		npm install --save data-forge
		
		var dataForge = require('data-forge');

Browser:

		bower install --save data-forge

		<script language="javascript" type="text/javascript" src="bower_components/data-forge/data-forge.js"></script>

**Kind**: global namespace  

* [data-forge](#data-forge) : <code>object</code>
    * [.DataFrame](#data-forge.DataFrame)
        * [new DataFrame(config|values)](#new_data-forge.DataFrame_new)
        * [.getColumnNames()](#data-forge.DataFrame+getColumnNames)
        * [.getColumnIndex(columnName)](#data-forge.DataFrame+getColumnIndex) ⇒ <code>Number</code>
        * [.getColumnName(columnIndex)](#data-forge.DataFrame+getColumnName) ⇒ <code>string</code>
        * [.getSeries(columnName)](#data-forge.DataFrame+getSeries)
        * [.hasSeries(columnName)](#data-forge.DataFrame+hasSeries)
        * [.expectSeries(columnName)](#data-forge.DataFrame+expectSeries)
        * [.getColumns()](#data-forge.DataFrame+getColumns)
        * [.subset(columnNames)](#data-forge.DataFrame+subset)
        * [.dropSeries(columnOrColumns)](#data-forge.DataFrame+dropSeries)
        * [.keepSeries(columnOrColumns)](#data-forge.DataFrame+keepSeries)
        * [.withSeries(columnName, series)](#data-forge.DataFrame+withSeries)
        * [.setIndex(columnName)](#data-forge.DataFrame+setIndex)
        * [.toString()](#data-forge.DataFrame+toString)
        * [.parseInts(columnNameOrNames)](#data-forge.DataFrame+parseInts)
        * [.parseFloats(columnNameOrNames)](#data-forge.DataFrame+parseFloats)
        * [.parseDates(columnNameOrNames, [formatString])](#data-forge.DataFrame+parseDates)
        * [.toStrings(columnNameOrNames, [formatString])](#data-forge.DataFrame+toStrings)
        * [.detectTypes()](#data-forge.DataFrame+detectTypes)
        * [.detectValues()](#data-forge.DataFrame+detectValues)
        * [.truncateStrings(maxLength)](#data-forge.DataFrame+truncateStrings)
        * [.remapColumns(columnNames)](#data-forge.DataFrame+remapColumns)
        * [.renameSeries(newColumnNames|columnsMap)](#data-forge.DataFrame+renameSeries)
        * [.toRows()](#data-forge.DataFrame+toRows)
        * [.toJSON()](#data-forge.DataFrame+toJSON)
        * [.toCSV()](#data-forge.DataFrame+toCSV)
        * [.transformSeries(columnSelectors)](#data-forge.DataFrame+transformSeries)
        * [.generateSeries(generator)](#data-forge.DataFrame+generateSeries)
        * [.deflate(selector)](#data-forge.DataFrame+deflate)
        * [.inflateColumn(columnNameOrIndex, [selector])](#data-forge.DataFrame+inflateColumn)
        * [.aggregate([seed], selector)](#data-forge.DataFrame+aggregate)
        * [.bringToFront(columnOrColumns)](#data-forge.DataFrame+bringToFront)
        * [.bringToBack(columnOrColumns)](#data-forge.DataFrame+bringToBack)
        * [.pivot(column, value)](#data-forge.DataFrame+pivot)
        * [.merge(otherDataFrame, [columnName])](#data-forge.DataFrame+merge)
        * [.contains(row)](#data-forge.DataFrame+contains)
        * [.concat(dataFrames)](#data-forge.DataFrame+concat)
        * [.toRows()](#data-forge.DataFrame+toRows)
    * [.Series](#data-forge.Series)
        * [new Series(config|values)](#new_data-forge.Series_new)
        * [.getIterator()](#data-forge.Series+getIterator) ⇒ <code>iterator</code>
        * [.getIndex()](#data-forge.Series+getIndex)
        * [.withIndex(newIndex)](#data-forge.Series+withIndex)
        * [.resetIndex()](#data-forge.Series+resetIndex)
        * [.skip(numRows)](#data-forge.Series+skip)
        * [.skipWhile(predicate)](#data-forge.Series+skipWhile)
        * [.skipUntil(predicate)](#data-forge.Series+skipUntil)
        * [.take(numRows)](#data-forge.Series+take)
        * [.takeWhile(predicate)](#data-forge.Series+takeWhile)
        * [.takeUntil(predicate)](#data-forge.Series+takeUntil)
        * [.where(predicate)](#data-forge.Series+where)
        * [.select(selector)](#data-forge.Series+select)
        * [.selectPairs(selector)](#data-forge.Series+selectPairs)
        * [.selectMany(selector)](#data-forge.Series+selectMany)
        * [.selectManyPairs(selector)](#data-forge.Series+selectManyPairs)
        * [.orderBy(sortSelector)](#data-forge.Series+orderBy)
        * [.orderByDescending(sortSelector)](#data-forge.Series+orderByDescending)
        * [.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])](#data-forge.Series+slice)
        * [.window(period)](#data-forge.Series+window)
        * [.rollingWindow(period)](#data-forge.Series+rollingWindow)
        * [.toString()](#data-forge.Series+toString)
        * [.percentChange()](#data-forge.Series+percentChange)
        * [.parseInts()](#data-forge.Series+parseInts)
        * [.parseFloats()](#data-forge.Series+parseFloats)
        * [.parseDates([formatString])](#data-forge.Series+parseDates)
        * [.toStrings([formatString])](#data-forge.Series+toStrings)
        * [.detectTypes()](#data-forge.Series+detectTypes)
        * [.detectValues()](#data-forge.Series+detectValues)
        * [.truncateStrings(maxLength)](#data-forge.Series+truncateStrings)
        * [.bake()](#data-forge.Series+bake)
        * [.toPairs()](#data-forge.Series+toPairs)
        * [.count()](#data-forge.Series+count)
        * [.first()](#data-forge.Series+first)
        * [.last()](#data-forge.Series+last)
        * [.firstPair()](#data-forge.Series+firstPair)
        * [.lastPair()](#data-forge.Series+lastPair)
        * [.firstIndex()](#data-forge.Series+firstIndex)
        * [.lastIndex()](#data-forge.Series+lastIndex)
        * [.reverse()](#data-forge.Series+reverse)
        * [.inflate([selector])](#data-forge.Series+inflate)
        * [.head(values)](#data-forge.Series+head)
        * [.tail(values)](#data-forge.Series+tail)
        * [.sum()](#data-forge.Series+sum)
        * [.average()](#data-forge.Series+average)
        * [.min()](#data-forge.Series+min)
        * [.max()](#data-forge.Series+max)
        * [.aggregate([seed], selector)](#data-forge.Series+aggregate)
        * [.toObject(keySelector, keySelector)](#data-forge.Series+toObject)
        * [.zip(series|dataframe, selector)](#data-forge.Series+zip)
        * [.forEach(callback)](#data-forge.Series+forEach)
        * [.all(predicate)](#data-forge.Series+all)
        * [.any([predicate])](#data-forge.Series+any)
        * [.none([predicate])](#data-forge.Series+none)
        * [.sequentialDistinct(selector)](#data-forge.Series+sequentialDistinct)
        * [.distinct(selector)](#data-forge.Series+distinct)
        * [.variableWindow(comparer)](#data-forge.Series+variableWindow)
        * [.insertPair(pair)](#data-forge.Series+insertPair)
        * [.appendPair(pair)](#data-forge.Series+appendPair)
        * [.fillGaps(predicate, generator)](#data-forge.Series+fillGaps)
        * [.groupBy(selector)](#data-forge.Series+groupBy)
        * [.groupSequentialBy(selector)](#data-forge.Series+groupSequentialBy)
        * [.at(index)](#data-forge.Series+at)
        * [.contains(value)](#data-forge.Series+contains)
        * [.concat(series)](#data-forge.Series+concat)
        * [.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)](#data-forge.Series+join)
        * [.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#data-forge.Series+joinOuter)
        * [.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#data-forge.Series+joinOuterLeft)
        * [.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#data-forge.Series+joinOuterRight)
        * [.defaultIfEmpty(defaultSequence)](#data-forge.Series+defaultIfEmpty)
        * [.union(other, [comparer])](#data-forge.Series+union)
        * [.intersection(other, [comparer])](#data-forge.Series+intersection)
        * [.except(other, [comparer])](#data-forge.Series+except)

<a name="data-forge.DataFrame"></a>

### data-forge.DataFrame
**Kind**: static class of <code>[data-forge](#data-forge)</code>  

* [.DataFrame](#data-forge.DataFrame)
    * [new DataFrame(config|values)](#new_data-forge.DataFrame_new)
    * [.getColumnNames()](#data-forge.DataFrame+getColumnNames)
    * [.getColumnIndex(columnName)](#data-forge.DataFrame+getColumnIndex) ⇒ <code>Number</code>
    * [.getColumnName(columnIndex)](#data-forge.DataFrame+getColumnName) ⇒ <code>string</code>
    * [.getSeries(columnName)](#data-forge.DataFrame+getSeries)
    * [.hasSeries(columnName)](#data-forge.DataFrame+hasSeries)
    * [.expectSeries(columnName)](#data-forge.DataFrame+expectSeries)
    * [.getColumns()](#data-forge.DataFrame+getColumns)
    * [.subset(columnNames)](#data-forge.DataFrame+subset)
    * [.dropSeries(columnOrColumns)](#data-forge.DataFrame+dropSeries)
    * [.keepSeries(columnOrColumns)](#data-forge.DataFrame+keepSeries)
    * [.withSeries(columnName, series)](#data-forge.DataFrame+withSeries)
    * [.setIndex(columnName)](#data-forge.DataFrame+setIndex)
    * [.toString()](#data-forge.DataFrame+toString)
    * [.parseInts(columnNameOrNames)](#data-forge.DataFrame+parseInts)
    * [.parseFloats(columnNameOrNames)](#data-forge.DataFrame+parseFloats)
    * [.parseDates(columnNameOrNames, [formatString])](#data-forge.DataFrame+parseDates)
    * [.toStrings(columnNameOrNames, [formatString])](#data-forge.DataFrame+toStrings)
    * [.detectTypes()](#data-forge.DataFrame+detectTypes)
    * [.detectValues()](#data-forge.DataFrame+detectValues)
    * [.truncateStrings(maxLength)](#data-forge.DataFrame+truncateStrings)
    * [.remapColumns(columnNames)](#data-forge.DataFrame+remapColumns)
    * [.renameSeries(newColumnNames|columnsMap)](#data-forge.DataFrame+renameSeries)
    * [.toRows()](#data-forge.DataFrame+toRows)
    * [.toJSON()](#data-forge.DataFrame+toJSON)
    * [.toCSV()](#data-forge.DataFrame+toCSV)
    * [.transformSeries(columnSelectors)](#data-forge.DataFrame+transformSeries)
    * [.generateSeries(generator)](#data-forge.DataFrame+generateSeries)
    * [.deflate(selector)](#data-forge.DataFrame+deflate)
    * [.inflateColumn(columnNameOrIndex, [selector])](#data-forge.DataFrame+inflateColumn)
    * [.aggregate([seed], selector)](#data-forge.DataFrame+aggregate)
    * [.bringToFront(columnOrColumns)](#data-forge.DataFrame+bringToFront)
    * [.bringToBack(columnOrColumns)](#data-forge.DataFrame+bringToBack)
    * [.pivot(column, value)](#data-forge.DataFrame+pivot)
    * [.merge(otherDataFrame, [columnName])](#data-forge.DataFrame+merge)
    * [.contains(row)](#data-forge.DataFrame+contains)
    * [.concat(dataFrames)](#data-forge.DataFrame+concat)
    * [.toRows()](#data-forge.DataFrame+toRows)

<a name="new_data-forge.DataFrame_new"></a>

#### new DataFrame(config|values)
Constructor for DataFrame.


| Param | Type | Description |
| --- | --- | --- |
| config|values | <code>object</code> &#124; <code>array</code> | Specifies content and configuration for the DataFrame. |

<a name="data-forge.DataFrame+getColumnNames"></a>

#### dataFrame.getColumnNames()
Get the names of the columns in the data frame.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  
<a name="data-forge.DataFrame+getColumnIndex"></a>

#### dataFrame.getColumnIndex(columnName) ⇒ <code>Number</code>
Gets a column index from a column name.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  
**Returns**: <code>Number</code> - Returns the index of the named column or -1 if the requested column was not found.  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | The name of the column to retrieve the column index for. |

<a name="data-forge.DataFrame+getColumnName"></a>

#### dataFrame.getColumnName(columnIndex) ⇒ <code>string</code>
Gets a column name from a column index.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  
**Returns**: <code>string</code> - Returns the name of the column or undefined if the requested column was not found.  

| Param | Type | Description |
| --- | --- | --- |
| columnIndex | <code>int</code> | The index of the column to retrieve the column name for. |

<a name="data-forge.DataFrame+getSeries"></a>

#### dataFrame.getSeries(columnName)
Retreive a time-series from a column of the data-frame.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Specifies the column to retreive. |

<a name="data-forge.DataFrame+hasSeries"></a>

#### dataFrame.hasSeries(columnName)
Returns true if the column with the requested name exists in the data frame.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name of the column to check. |

<a name="data-forge.DataFrame+expectSeries"></a>

#### dataFrame.expectSeries(columnName)
Verify the existance of a column and return it.Throws an exception if the column doesn't exist.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name or index of the column to retreive. |

<a name="data-forge.DataFrame+getColumns"></a>

#### dataFrame.getColumns()
Retreive a collection of all columns.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  
<a name="data-forge.DataFrame+subset"></a>

#### dataFrame.subset(columnNames)
Create a new data-frame from a subset of columns.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNames | <code>array</code> | Array of column names to include in the new data-frame. |

<a name="data-forge.DataFrame+dropSeries"></a>

#### dataFrame.dropSeries(columnOrColumns)
Create a new data frame with the requested column or columns dropped.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column name (a string) or columns (array of column names) to drop. |

<a name="data-forge.DataFrame+keepSeries"></a>

#### dataFrame.keepSeries(columnOrColumns)
Create a new data frame with only the requested column or columns dropped, other columns are dropped.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column name (a string) or columns (array of column names) to keep. |

<a name="data-forge.DataFrame+withSeries"></a>

#### dataFrame.withSeries(columnName, series)
Create a new data frame with an additional column specified by the passed-in series.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | The name of the column to add or replace. |
| series | <code>Series</code> | Series to add to the data-frame. |

<a name="data-forge.DataFrame+setIndex"></a>

#### dataFrame.setIndex(columnName)
Set a named column as the index of the data-frame.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name or index of the column to set as the index. |

<a name="data-forge.DataFrame+toString"></a>

#### dataFrame.toString()
Format the data frame for display as a string.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  
<a name="data-forge.DataFrame+parseInts"></a>

#### dataFrame.parseInts(columnNameOrNames)
Parse a column with string values to a column with int values.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrNames | <code>string</code> &#124; <code>array</code> | Specifies the column name or array of column names to parse. |

<a name="data-forge.DataFrame+parseFloats"></a>

#### dataFrame.parseFloats(columnNameOrNames)
Parse a column with string values to a column with float values.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrNames | <code>string</code> &#124; <code>array</code> | Specifies the column name or array of column names to parse. |

<a name="data-forge.DataFrame+parseDates"></a>

#### dataFrame.parseDates(columnNameOrNames, [formatString])
Parse a column with string values to a column with date values.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrNames | <code>string</code> &#124; <code>array</code> | Specifies the column name or array of column names to parse. |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="data-forge.DataFrame+toStrings"></a>

#### dataFrame.toStrings(columnNameOrNames, [formatString])
Convert a column of values of different types to a column of string values.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrNames | <code>string</code> &#124; <code>array</code> | Specifies the column name or array of column names to convert to strings. |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="data-forge.DataFrame+detectTypes"></a>

#### dataFrame.detectTypes()
Detect actual types and their frequencies contained within columns in the data frame.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  
<a name="data-forge.DataFrame+detectValues"></a>

#### dataFrame.detectValues()
Detect values and their frequencies contained within columns in the data frame.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  
<a name="data-forge.DataFrame+truncateStrings"></a>

#### dataFrame.truncateStrings(maxLength)
Produces a new data frame with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="data-forge.DataFrame+remapColumns"></a>

#### dataFrame.remapColumns(columnNames)
Create a new data frame with columns reordered.New column names create new columns (with undefined values), omitting existing column names causes those columns to be dropped.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNames | <code>array</code> | The new order for columns. |

<a name="data-forge.DataFrame+renameSeries"></a>

#### dataFrame.renameSeries(newColumnNames|columnsMap)
Create a new data-frame with renamed series.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| newColumnNames|columnsMap | <code>array</code> &#124; <code>object</code> | Array of strings, with an element for each existing column that specifies the new name of that column. Or, a hash that maps old column name to new column name. |

<a name="data-forge.DataFrame+toRows"></a>

#### dataFrame.toRows()
Bake the data frame to an array of rows.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  
<a name="data-forge.DataFrame+toJSON"></a>

#### dataFrame.toJSON()
Serialize the data frame to JSON.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  
<a name="data-forge.DataFrame+toCSV"></a>

#### dataFrame.toCSV()
Serialize the data frame to CSV.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  
<a name="data-forge.DataFrame+transformSeries"></a>

#### dataFrame.transformSeries(columnSelectors)
Transform one or more columns. This is equivalent to extracting a column, calling 'select' on it,then plugging it back in as the same column.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnSelectors | <code>object</code> | Object with field names for each column to be transformed. Each field you be a selector that transforms that column. |

<a name="data-forge.DataFrame+generateSeries"></a>

#### dataFrame.generateSeries(generator)
Generate new columns based on existing rows.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| generator | <code>function</code> &#124; <code>object</code> | Generator function that transforms each row to a new set of columns. |

<a name="data-forge.DataFrame+deflate"></a>

#### dataFrame.deflate(selector)
Deflate a data-frame to a series.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each row to a new sequence of values. |

<a name="data-forge.DataFrame+inflateColumn"></a>

#### dataFrame.inflateColumn(columnNameOrIndex, [selector])
Inflate a named column in the data-frame to 1 or more new columns.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Name or index of the column to retreive. |
| [selector] | <code>function</code> | Selector function that transforms each value in the column to new columns. |

<a name="data-forge.DataFrame+aggregate"></a>

#### dataFrame.aggregate([seed], selector)
Aggregate the rows of the data-frame.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [seed] | <code>object</code> | The seed value for producing the aggregation. |
| selector | <code>function</code> | Function that takes the seed and then each row in the data-frame and produces the aggregate value. |

<a name="data-forge.DataFrame+bringToFront"></a>

#### dataFrame.bringToFront(columnOrColumns)
Bring the name column to the front, making it the first column in the data-frame.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column or columns to bring to the front. |

<a name="data-forge.DataFrame+bringToBack"></a>

#### dataFrame.bringToBack(columnOrColumns)
Bring the name column to the back, making it the last column in the data-frame.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column or columns to bring to the back. |

<a name="data-forge.DataFrame+pivot"></a>

#### dataFrame.pivot(column, value)
Reshape (or pivot) a table based on column values.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| column | <code>string</code> | Column name whose values make the new DataFrame's columns. |
| value | <code>string</code> | Column name whose values populate the new DataFrame's values. |

<a name="data-forge.DataFrame+merge"></a>

#### dataFrame.merge(otherDataFrame, [columnName])
Merge this DataFrame with another.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| otherDataFrame | <code>DataFrame</code> | The other DataFrame to merge in. |
| [columnName] | <code>string</code> | Optional column name used to join the DataFrames. Omit to merge on index. |

<a name="data-forge.DataFrame+contains"></a>

#### dataFrame.contains(row)
Returns true if the DataFrame contains the specified row.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| row | <code>function</code> | The row to check for in the DataFrame. |

<a name="data-forge.DataFrame+concat"></a>

#### dataFrame.concat(dataFrames)
Concatenate multiple other dataframes onto this dataframe.

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| dataFrames | <code>array</code> &#124; <code>DataFrame</code> | Multiple arguments. Each can be either a dataframe or an array of dataframe. |

<a name="data-forge.DataFrame+toRows"></a>

#### dataFrame.toRows()
Retreive each row of the dataframe as an array (no column names included)

**Kind**: instance method of <code>[DataFrame](#data-forge.DataFrame)</code>  
<a name="data-forge.Series"></a>

### data-forge.Series
**Kind**: static class of <code>[data-forge](#data-forge)</code>  

* [.Series](#data-forge.Series)
    * [new Series(config|values)](#new_data-forge.Series_new)
    * [.getIterator()](#data-forge.Series+getIterator) ⇒ <code>iterator</code>
    * [.getIndex()](#data-forge.Series+getIndex)
    * [.withIndex(newIndex)](#data-forge.Series+withIndex)
    * [.resetIndex()](#data-forge.Series+resetIndex)
    * [.skip(numRows)](#data-forge.Series+skip)
    * [.skipWhile(predicate)](#data-forge.Series+skipWhile)
    * [.skipUntil(predicate)](#data-forge.Series+skipUntil)
    * [.take(numRows)](#data-forge.Series+take)
    * [.takeWhile(predicate)](#data-forge.Series+takeWhile)
    * [.takeUntil(predicate)](#data-forge.Series+takeUntil)
    * [.where(predicate)](#data-forge.Series+where)
    * [.select(selector)](#data-forge.Series+select)
    * [.selectPairs(selector)](#data-forge.Series+selectPairs)
    * [.selectMany(selector)](#data-forge.Series+selectMany)
    * [.selectManyPairs(selector)](#data-forge.Series+selectManyPairs)
    * [.orderBy(sortSelector)](#data-forge.Series+orderBy)
    * [.orderByDescending(sortSelector)](#data-forge.Series+orderByDescending)
    * [.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])](#data-forge.Series+slice)
    * [.window(period)](#data-forge.Series+window)
    * [.rollingWindow(period)](#data-forge.Series+rollingWindow)
    * [.toString()](#data-forge.Series+toString)
    * [.percentChange()](#data-forge.Series+percentChange)
    * [.parseInts()](#data-forge.Series+parseInts)
    * [.parseFloats()](#data-forge.Series+parseFloats)
    * [.parseDates([formatString])](#data-forge.Series+parseDates)
    * [.toStrings([formatString])](#data-forge.Series+toStrings)
    * [.detectTypes()](#data-forge.Series+detectTypes)
    * [.detectValues()](#data-forge.Series+detectValues)
    * [.truncateStrings(maxLength)](#data-forge.Series+truncateStrings)
    * [.bake()](#data-forge.Series+bake)
    * [.toPairs()](#data-forge.Series+toPairs)
    * [.count()](#data-forge.Series+count)
    * [.first()](#data-forge.Series+first)
    * [.last()](#data-forge.Series+last)
    * [.firstPair()](#data-forge.Series+firstPair)
    * [.lastPair()](#data-forge.Series+lastPair)
    * [.firstIndex()](#data-forge.Series+firstIndex)
    * [.lastIndex()](#data-forge.Series+lastIndex)
    * [.reverse()](#data-forge.Series+reverse)
    * [.inflate([selector])](#data-forge.Series+inflate)
    * [.head(values)](#data-forge.Series+head)
    * [.tail(values)](#data-forge.Series+tail)
    * [.sum()](#data-forge.Series+sum)
    * [.average()](#data-forge.Series+average)
    * [.min()](#data-forge.Series+min)
    * [.max()](#data-forge.Series+max)
    * [.aggregate([seed], selector)](#data-forge.Series+aggregate)
    * [.toObject(keySelector, keySelector)](#data-forge.Series+toObject)
    * [.zip(series|dataframe, selector)](#data-forge.Series+zip)
    * [.forEach(callback)](#data-forge.Series+forEach)
    * [.all(predicate)](#data-forge.Series+all)
    * [.any([predicate])](#data-forge.Series+any)
    * [.none([predicate])](#data-forge.Series+none)
    * [.sequentialDistinct(selector)](#data-forge.Series+sequentialDistinct)
    * [.distinct(selector)](#data-forge.Series+distinct)
    * [.variableWindow(comparer)](#data-forge.Series+variableWindow)
    * [.insertPair(pair)](#data-forge.Series+insertPair)
    * [.appendPair(pair)](#data-forge.Series+appendPair)
    * [.fillGaps(predicate, generator)](#data-forge.Series+fillGaps)
    * [.groupBy(selector)](#data-forge.Series+groupBy)
    * [.groupSequentialBy(selector)](#data-forge.Series+groupSequentialBy)
    * [.at(index)](#data-forge.Series+at)
    * [.contains(value)](#data-forge.Series+contains)
    * [.concat(series)](#data-forge.Series+concat)
    * [.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)](#data-forge.Series+join)
    * [.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#data-forge.Series+joinOuter)
    * [.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#data-forge.Series+joinOuterLeft)
    * [.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#data-forge.Series+joinOuterRight)
    * [.defaultIfEmpty(defaultSequence)](#data-forge.Series+defaultIfEmpty)
    * [.union(other, [comparer])](#data-forge.Series+union)
    * [.intersection(other, [comparer])](#data-forge.Series+intersection)
    * [.except(other, [comparer])](#data-forge.Series+except)

<a name="new_data-forge.Series_new"></a>

#### new Series(config|values)
Constructor for Series.


| Param | Type | Description |
| --- | --- | --- |
| config|values | <code>object</code> &#124; <code>array</code> | Specifies content and configuration for the Series. |

<a name="data-forge.Series+getIterator"></a>

#### series.getIterator() ⇒ <code>iterator</code>
Get an iterator for index & values of the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
**Returns**: <code>iterator</code> - Returns an iterator that can be used to enumerate and lazily evalute the contents of the series or dataframe.  
<a name="data-forge.Series+getIndex"></a>

#### series.getIndex()
Retreive the index of the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+withIndex"></a>

#### series.withIndex(newIndex)
Apply a new index to the Series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| newIndex | <code>array</code> &#124; <code>Series</code> | The new index to apply to the Series. |

<a name="data-forge.Series+resetIndex"></a>

#### series.resetIndex()
Reset the index of the data frame back to the default sequential integer index.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+skip"></a>

#### series.skip(numRows)
Skip a number of rows in the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to skip. |

<a name="data-forge.Series+skipWhile"></a>

#### series.skipWhile(predicate)
Skips values in the series while a condition is met.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="data-forge.Series+skipUntil"></a>

#### series.skipUntil(predicate)
Skips values in the series until a condition is met.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="data-forge.Series+take"></a>

#### series.take(numRows)
Take a number of rows in the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="data-forge.Series+takeWhile"></a>

#### series.takeWhile(predicate)
Take values from the series while a condition is met.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="data-forge.Series+takeUntil"></a>

#### series.takeUntil(predicate)
Take values from the series until a condition is met.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="data-forge.Series+where"></a>

#### series.where(predicate)
Filter a series by a predicate selector.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicte function to filter rows of the series. |

<a name="data-forge.Series+select"></a>

#### series.select(selector)
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value to create a new series. |

<a name="data-forge.Series+selectPairs"></a>

#### series.selectPairs(selector)
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each index/value to a create a new series. |

<a name="data-forge.Series+selectMany"></a>

#### series.selectMany(selector)
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value to a different data structure. |

<a name="data-forge.Series+selectManyPairs"></a>

#### series.selectManyPairs(selector)
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value to a different data structure. |

<a name="data-forge.Series+orderBy"></a>

#### series.orderBy(sortSelector)
Sorts the series by sort selector (ascending).

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | An function to select a value to sort by. |

<a name="data-forge.Series+orderByDescending"></a>

#### series.orderByDescending(sortSelector)
Sorts the series by sort selector (descending).

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | An function to select a value to sort by. |

<a name="data-forge.Series+slice"></a>

#### series.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])
Create a new series from a slice of rows.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| startIndexOrStartPredicate | <code>int</code> &#124; <code>function</code> | Index where the slice starts or a predicate function that determines where the slice starts. |
| endIndexOrEndPredicate | <code>int</code> &#124; <code>function</code> | Marks the end of the slice, one row past the last row to include. Or a predicate function that determines when the slice has ended. |
| [predicate] | <code>function</code> | Optional predicate to compare index against start/end index. Return true to start or stop the slice. |

<a name="data-forge.Series+window"></a>

#### series.window(period)
Segment a Series into 'windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original Series.
Use select or selectPairs to aggregate.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of values in the window. |

<a name="data-forge.Series+rollingWindow"></a>

#### series.rollingWindow(period)
Segment a Series into 'rolling windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original Series.
Use select or selectPairs to aggregate.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of values in the window. |

<a name="data-forge.Series+toString"></a>

#### series.toString()
Format the data frame for display as a string.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+percentChange"></a>

#### series.percentChange()
Compute the percent change for each row after the first.
Percentages are expressed as 0-1 values.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+parseInts"></a>

#### series.parseInts()
Parse a series with string values to a series with int values.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+parseFloats"></a>

#### series.parseFloats()
Parse a series with string values to a series with float values.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+parseDates"></a>

#### series.parseDates([formatString])
Parse a series with string values to a series with date values.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="data-forge.Series+toStrings"></a>

#### series.toStrings([formatString])
Convert a series of values of different types to a series of string values.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="data-forge.Series+detectTypes"></a>

#### series.detectTypes()
Detect the actual types of the values that comprised the series and their frequency.
Returns a new series containing the type information.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+detectValues"></a>

#### series.detectValues()
Detect the frequency of values in the series.
Returns a new series containing the information.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+truncateStrings"></a>

#### series.truncateStrings(maxLength)
Produces a new series with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="data-forge.Series+bake"></a>

#### series.bake()
Forces lazy evaluation to complete and 'bakes' the series into memory.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+toPairs"></a>

#### series.toPairs()
Retreive the data as pairs of [index, value].

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+count"></a>

#### series.count()
Count the number of rows in the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+first"></a>

#### series.first()
Get the first value of the Series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+last"></a>

#### series.last()
Get the last value of the Series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+firstPair"></a>

#### series.firstPair()
Get the first index/value pair of the Series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+lastPair"></a>

#### series.lastPair()
Get the last index/value pair of the Series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+firstIndex"></a>

#### series.firstIndex()
Get the first index of the Series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+lastIndex"></a>

#### series.lastIndex()
Get the last index of the Series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+reverse"></a>

#### series.reverse()
Reverse the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+inflate"></a>

#### series.inflate([selector])
Inflate a series to a data-frame.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [selector] | <code>function</code> | Optional selector function that transforms each value in the series to a row in the new data-frame. |

<a name="data-forge.Series+head"></a>

#### series.head(values)
Get X values from the head of the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="data-forge.Series+tail"></a>

#### series.tail(values)
Get X values from the tail of the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="data-forge.Series+sum"></a>

#### series.sum()
Sum the values in a series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+average"></a>

#### series.average()
Average the values in a series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+min"></a>

#### series.min()
Get the min value in the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+max"></a>

#### series.max()
Get the max value in the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
<a name="data-forge.Series+aggregate"></a>

#### series.aggregate([seed], selector)
Aggregate the values in the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [seed] | <code>object</code> | The seed value for producing the aggregation. |
| selector | <code>function</code> | Function that takes the seed and then each value in the series and produces the aggregate value. |

<a name="data-forge.Series+toObject"></a>

#### series.toObject(keySelector, keySelector)
Convert the series to a JavaScript object.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| keySelector | <code>function</code> | Function that selects keys for the resulting object. |
| keySelector | <code>valueSelector</code> | Function that selects values for the resulting object. |

<a name="data-forge.Series+zip"></a>

#### series.zip(series|dataframe, selector)
Zip together multiple series or dataframes to produce a new series or dataframe.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| series|dataframe | <code>series</code> &#124; <code>dataframe</code> | Each series or dataframe that is to be zipped. |
| selector | <code>function</code> | Selector function that produces a new series or dataframe based on the inputs. |

<a name="data-forge.Series+forEach"></a>

#### series.forEach(callback)
Invoke a callback function for each value in the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The calback to invoke for each value. |

<a name="data-forge.Series+all"></a>

#### series.all(predicate)
Determine if the predicate returns truthy for all values.
Returns false as soon as the predicate evaluates to falsy.
Returns true if the predicate returns truthy for all values in the Series.
Returns false if the series is empty.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="data-forge.Series+any"></a>

#### series.any([predicate])
Determine if the predicate returns truthy for any of the values.
Returns true as soon as the predicate returns truthy.
Returns false if the predicate never returns truthy.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [predicate] | <code>function</code> | Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="data-forge.Series+none"></a>

#### series.none([predicate])
Determine if the predicate returns truthy for none of the values.
Returns true for an empty Series.
Returns true if the predicate always returns falsy.
Otherwise returns false.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [predicate] | <code>function</code> | Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="data-forge.Series+sequentialDistinct"></a>

#### series.sequentialDistinct(selector)
Group sequential duplicate values into a Series of windows.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selects the value used to compare for duplicates. |

<a name="data-forge.Series+distinct"></a>

#### series.distinct(selector)
Group distinct values in the Series into a Series of windows.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selects the value used to compare for duplicates. |

<a name="data-forge.Series+variableWindow"></a>

#### series.variableWindow(comparer)
Groups sequential values into variable length 'windows'. The windows can then be transformed/transformed using selectPairs or selectManyPairs.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| comparer | <code>function</code> | Predicate that compares two values and returns true if they should be in the same window. |

<a name="data-forge.Series+insertPair"></a>

#### series.insertPair(pair)
Insert a pair at the start of a Series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pair | <code>pair</code> | The pair to insert. |

<a name="data-forge.Series+appendPair"></a>

#### series.appendPair(pair)
Append a pair to the end of a Series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pair | <code>pair</code> | The pair to append. |

<a name="data-forge.Series+fillGaps"></a>

#### series.fillGaps(predicate, generator)
Fill gaps in a series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicate that is passed pairA and pairB, two consecutive rows, return truthy if there is a gap between the rows, or falsey if there is no gap. |
| generator | <code>function</code> | Generator that is passed pairA and pairB, two consecutive rows, returns an array of pairs that fills the gap between the rows. |

<a name="data-forge.Series+groupBy"></a>

#### series.groupBy(selector)
Group the series according to the selector.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector that defines the value to group by. |

<a name="data-forge.Series+groupSequentialBy"></a>

#### series.groupSequentialBy(selector)
Group sequential duplicate values into a Series of windows.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector that defines the value to group by. |

<a name="data-forge.Series+at"></a>

#### series.at(index)
Get the value at a specified index.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>function</code> | Index to for which to retreive the value. |

<a name="data-forge.Series+contains"></a>

#### series.contains(value)
Returns true if the Series contains the specified value.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>function</code> | The value to check for in the Series. |

<a name="data-forge.Series+concat"></a>

#### series.concat(series)
Concatenate multiple other series onto this series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| series | <code>array</code> &#124; <code>Series</code> | Multiple arguments. Each can be either a series or an array of series. |

<a name="data-forge.Series+join"></a>

#### series.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)
Correlates the elements of two Series or DataFrames based on matching keys.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| resultSelector | <code>function</code> | Selector that defines how to merge outer and inner values. |

<a name="data-forge.Series+joinOuter"></a>

#### series.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)
Performs an outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes elements that have no correlation.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| outerResultSelector | <code>function</code> | Selector that defines how to extract the outer value before joining it with the inner value. |
| innerResultSelector | <code>function</code> | Selector that defines how to extract the inner value before joining it with the outer value. |
| mergeSelector | <code>function</code> | Selector that defines how to combine left and right. Implementation from here: 	http://blogs.geniuscode.net/RyanDHatch/?p=116 |

<a name="data-forge.Series+joinOuterLeft"></a>

#### series.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)
Performs a left outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes left elements that have no correlation.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| outerResultSelector | <code>function</code> | Selector that defines how to extract the outer value before joining it with the inner value. |
| innerResultSelector | <code>function</code> | Selector that defines how to extract the inner value before joining it with the outer value. |
| mergeSelector | <code>function</code> | Selector that defines how to combine left and right. Implementation from here: 	http://blogs.geniuscode.net/RyanDHatch/?p=116 |

<a name="data-forge.Series+joinOuterRight"></a>

#### series.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)
Performs a right outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes right elements that have no correlation.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| outerResultSelector | <code>function</code> | Selector that defines how to extract the outer value before joining it with the inner value. |
| innerResultSelector | <code>function</code> | Selector that defines how to extract the inner value before joining it with the outer value. |
| mergeSelector | <code>function</code> | Selector that defines how to combine left and right. Implementation from here: 	http://blogs.geniuscode.net/RyanDHatch/?p=116 |

<a name="data-forge.Series+defaultIfEmpty"></a>

#### series.defaultIfEmpty(defaultSequence)
Returns the specified default sequence if the Series or DataFrame is empty.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| defaultSequence | <code>array</code> &#124; <code>Series</code> &#124; <code>DataFrame</code> | Default sequence to return if the Series or DataFrame is empty. |

<a name="data-forge.Series+union"></a>

#### series.union(other, [comparer])
Returns the unique union of values between two Series or DataFrames.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="data-forge.Series+intersection"></a>

#### series.intersection(other, [comparer])
Returns the intersection of values between two Series or DataFrames.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="data-forge.Series+except"></a>

#### series.except(other, [comparer])
Returns the exception of values between two Series or DataFrames.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

