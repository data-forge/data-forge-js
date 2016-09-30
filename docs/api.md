<a name="dataForge"></a>

## dataForge : <code>object</code>
Main namespace for Data-Forge.

Nodejs:

		npm install --save data-forge
		
		var dataForge = require('data-forge');

Browser:

		bower install --save data-forge

		<script language="javascript" type="text/javascript" src="bower_components/data-forge/data-forge.js"></script>

**Kind**: global namespace  

* [dataForge](#dataForge) : <code>object</code>
    * [.DataFrame](#dataForge.DataFrame) ⇐ <code>[Series](#dataForge.Series)</code>
        * [new DataFrame(config|values)](#new_dataForge.DataFrame_new)
        * [.getColumnNames()](#dataForge.DataFrame+getColumnNames)
        * [.getColumnIndex(columnName)](#dataForge.DataFrame+getColumnIndex) ⇒ <code>Number</code>
        * [.getColumnName(columnIndex)](#dataForge.DataFrame+getColumnName) ⇒ <code>string</code>
        * [.getSeries(columnName)](#dataForge.DataFrame+getSeries)
        * [.hasSeries(columnName)](#dataForge.DataFrame+hasSeries)
        * [.expectSeries(columnName)](#dataForge.DataFrame+expectSeries)
        * [.getColumns()](#dataForge.DataFrame+getColumns)
        * [.subset(columnNames)](#dataForge.DataFrame+subset)
        * [.dropSeries(columnOrColumns)](#dataForge.DataFrame+dropSeries)
        * [.keepSeries(columnOrColumns)](#dataForge.DataFrame+keepSeries)
        * [.withSeries(columnName, series)](#dataForge.DataFrame+withSeries)
        * [.setIndex(columnName)](#dataForge.DataFrame+setIndex)
        * [.toString()](#dataForge.DataFrame+toString)
        * [.parseInts(columnNameOrNames)](#dataForge.DataFrame+parseInts)
        * [.parseFloats(columnNameOrNames)](#dataForge.DataFrame+parseFloats)
        * [.parseDates(columnNameOrNames, [formatString])](#dataForge.DataFrame+parseDates)
        * [.toStrings(columnNameOrNames, [formatString])](#dataForge.DataFrame+toStrings)
        * [.detectTypes()](#dataForge.DataFrame+detectTypes)
        * [.detectValues()](#dataForge.DataFrame+detectValues)
        * [.truncateStrings(maxLength)](#dataForge.DataFrame+truncateStrings)
        * [.remapColumns(columnNames)](#dataForge.DataFrame+remapColumns)
        * [.renameSeries(newColumnNames|columnsMap)](#dataForge.DataFrame+renameSeries)
        * [.toRows()](#dataForge.DataFrame+toRows)
        * [.toJSON()](#dataForge.DataFrame+toJSON)
        * [.toCSV()](#dataForge.DataFrame+toCSV)
        * [.transformSeries(columnSelectors)](#dataForge.DataFrame+transformSeries)
        * [.generateSeries(generator)](#dataForge.DataFrame+generateSeries)
        * [.deflate(selector)](#dataForge.DataFrame+deflate)
        * [.inflateColumn(columnNameOrIndex, [selector])](#dataForge.DataFrame+inflateColumn)
        * [.aggregate([seed], selector)](#dataForge.DataFrame+aggregate)
        * [.bringToFront(columnOrColumns)](#dataForge.DataFrame+bringToFront)
        * [.bringToBack(columnOrColumns)](#dataForge.DataFrame+bringToBack)
        * [.pivot(column, value)](#dataForge.DataFrame+pivot)
        * [.merge(otherDataFrame, [columnName])](#dataForge.DataFrame+merge)
        * [.contains(row)](#dataForge.DataFrame+contains)
        * [.concat(dataFrames)](#dataForge.DataFrame+concat)
        * [.toRows()](#dataForge.DataFrame+toRows)
        * [.getIterator()](#dataForge.Series+getIterator) ⇒ <code>iterator</code>
        * [.getIndex()](#dataForge.Series+getIndex) ⇒ <code>Series</code>
        * [.withIndex(newIndex)](#dataForge.Series+withIndex) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.resetIndex()](#dataForge.Series+resetIndex) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.skip(numRows)](#dataForge.Series+skip) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.skipWhile(predicate)](#dataForge.Series+skipWhile) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.skipUntil(predicate)](#dataForge.Series+skipUntil) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.take(numRows)](#dataForge.Series+take) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.takeWhile(predicate)](#dataForge.Series+takeWhile) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.takeUntil(predicate)](#dataForge.Series+takeUntil) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.where(predicate)](#dataForge.Series+where) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.select(selector)](#dataForge.Series+select) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.selectPairs(selector)](#dataForge.Series+selectPairs) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.selectMany(generator)](#dataForge.Series+selectMany) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.selectManyPairs(generator)](#dataForge.Series+selectManyPairs) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.thenBy(sortSelector)](#dataForge.Series+thenBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.thenByDescending(sortSelector)](#dataForge.Series+thenByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.orderBy(sortSelector)](#dataForge.Series+orderBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.orderByDescending(sortSelector)](#dataForge.Series+orderByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])](#dataForge.Series+slice)
        * [.window(period)](#dataForge.Series+window)
        * [.rollingWindow(period)](#dataForge.Series+rollingWindow)
        * [.percentChange()](#dataForge.Series+percentChange)
        * [.bake()](#dataForge.Series+bake)
        * [.toPairs()](#dataForge.Series+toPairs)
        * [.count()](#dataForge.Series+count)
        * [.first()](#dataForge.Series+first)
        * [.last()](#dataForge.Series+last)
        * [.firstPair()](#dataForge.Series+firstPair)
        * [.lastPair()](#dataForge.Series+lastPair)
        * [.firstIndex()](#dataForge.Series+firstIndex)
        * [.lastIndex()](#dataForge.Series+lastIndex)
        * [.reverse()](#dataForge.Series+reverse)
        * [.inflate([selector])](#dataForge.Series+inflate)
        * [.head(values)](#dataForge.Series+head)
        * [.tail(values)](#dataForge.Series+tail)
        * [.sum()](#dataForge.Series+sum)
        * [.average()](#dataForge.Series+average)
        * [.min()](#dataForge.Series+min)
        * [.max()](#dataForge.Series+max)
        * [.toObject(keySelector, keySelector)](#dataForge.Series+toObject)
        * [.zip(series|dataframe, selector)](#dataForge.Series+zip)
        * [.forEach(callback)](#dataForge.Series+forEach)
        * [.all(predicate)](#dataForge.Series+all)
        * [.any([predicate])](#dataForge.Series+any)
        * [.none([predicate])](#dataForge.Series+none)
        * [.sequentialDistinct(selector)](#dataForge.Series+sequentialDistinct)
        * [.distinct(selector)](#dataForge.Series+distinct)
        * [.variableWindow(comparer)](#dataForge.Series+variableWindow)
        * [.insertPair(pair)](#dataForge.Series+insertPair)
        * [.appendPair(pair)](#dataForge.Series+appendPair)
        * [.fillGaps(predicate, generator)](#dataForge.Series+fillGaps)
        * [.groupBy(selector)](#dataForge.Series+groupBy)
        * [.groupSequentialBy(selector)](#dataForge.Series+groupSequentialBy)
        * [.at(index)](#dataForge.Series+at)
        * [.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)](#dataForge.Series+join)
        * [.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuter)
        * [.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterLeft)
        * [.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterRight)
        * [.defaultIfEmpty(defaultSequence)](#dataForge.Series+defaultIfEmpty)
        * [.union(other, [comparer])](#dataForge.Series+union)
        * [.intersection(other, [comparer])](#dataForge.Series+intersection)
        * [.except(other, [comparer])](#dataForge.Series+except)
    * [.Series](#dataForge.Series)
        * [new Series(config|values)](#new_dataForge.Series_new)
        * [.getIterator()](#dataForge.Series+getIterator) ⇒ <code>iterator</code>
        * [.getIndex()](#dataForge.Series+getIndex) ⇒ <code>Series</code>
        * [.withIndex(newIndex)](#dataForge.Series+withIndex) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.resetIndex()](#dataForge.Series+resetIndex) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.skip(numRows)](#dataForge.Series+skip) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.skipWhile(predicate)](#dataForge.Series+skipWhile) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.skipUntil(predicate)](#dataForge.Series+skipUntil) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.take(numRows)](#dataForge.Series+take) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.takeWhile(predicate)](#dataForge.Series+takeWhile) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.takeUntil(predicate)](#dataForge.Series+takeUntil) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.where(predicate)](#dataForge.Series+where) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.select(selector)](#dataForge.Series+select) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.selectPairs(selector)](#dataForge.Series+selectPairs) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.selectMany(generator)](#dataForge.Series+selectMany) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.selectManyPairs(generator)](#dataForge.Series+selectManyPairs) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.thenBy(sortSelector)](#dataForge.Series+thenBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.thenByDescending(sortSelector)](#dataForge.Series+thenByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.orderBy(sortSelector)](#dataForge.Series+orderBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.orderByDescending(sortSelector)](#dataForge.Series+orderByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])](#dataForge.Series+slice)
        * [.window(period)](#dataForge.Series+window)
        * [.rollingWindow(period)](#dataForge.Series+rollingWindow)
        * [.toString()](#dataForge.Series+toString)
        * [.percentChange()](#dataForge.Series+percentChange)
        * [.parseInts()](#dataForge.Series+parseInts)
        * [.parseFloats()](#dataForge.Series+parseFloats)
        * [.parseDates([formatString])](#dataForge.Series+parseDates)
        * [.toStrings([formatString])](#dataForge.Series+toStrings)
        * [.detectTypes()](#dataForge.Series+detectTypes)
        * [.detectValues()](#dataForge.Series+detectValues)
        * [.truncateStrings(maxLength)](#dataForge.Series+truncateStrings)
        * [.bake()](#dataForge.Series+bake)
        * [.toPairs()](#dataForge.Series+toPairs)
        * [.count()](#dataForge.Series+count)
        * [.first()](#dataForge.Series+first)
        * [.last()](#dataForge.Series+last)
        * [.firstPair()](#dataForge.Series+firstPair)
        * [.lastPair()](#dataForge.Series+lastPair)
        * [.firstIndex()](#dataForge.Series+firstIndex)
        * [.lastIndex()](#dataForge.Series+lastIndex)
        * [.reverse()](#dataForge.Series+reverse)
        * [.inflate([selector])](#dataForge.Series+inflate)
        * [.head(values)](#dataForge.Series+head)
        * [.tail(values)](#dataForge.Series+tail)
        * [.sum()](#dataForge.Series+sum)
        * [.average()](#dataForge.Series+average)
        * [.min()](#dataForge.Series+min)
        * [.max()](#dataForge.Series+max)
        * [.aggregate([seed], selector)](#dataForge.Series+aggregate)
        * [.toObject(keySelector, keySelector)](#dataForge.Series+toObject)
        * [.zip(series|dataframe, selector)](#dataForge.Series+zip)
        * [.forEach(callback)](#dataForge.Series+forEach)
        * [.all(predicate)](#dataForge.Series+all)
        * [.any([predicate])](#dataForge.Series+any)
        * [.none([predicate])](#dataForge.Series+none)
        * [.sequentialDistinct(selector)](#dataForge.Series+sequentialDistinct)
        * [.distinct(selector)](#dataForge.Series+distinct)
        * [.variableWindow(comparer)](#dataForge.Series+variableWindow)
        * [.insertPair(pair)](#dataForge.Series+insertPair)
        * [.appendPair(pair)](#dataForge.Series+appendPair)
        * [.fillGaps(predicate, generator)](#dataForge.Series+fillGaps)
        * [.groupBy(selector)](#dataForge.Series+groupBy)
        * [.groupSequentialBy(selector)](#dataForge.Series+groupSequentialBy)
        * [.at(index)](#dataForge.Series+at)
        * [.contains(value)](#dataForge.Series+contains)
        * [.concat(series)](#dataForge.Series+concat)
        * [.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)](#dataForge.Series+join)
        * [.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuter)
        * [.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterLeft)
        * [.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterRight)
        * [.defaultIfEmpty(defaultSequence)](#dataForge.Series+defaultIfEmpty)
        * [.union(other, [comparer])](#dataForge.Series+union)
        * [.intersection(other, [comparer])](#dataForge.Series+intersection)
        * [.except(other, [comparer])](#dataForge.Series+except)
    * [.concatDataFrames](#dataForge.concatDataFrames)
    * [.concatSeries](#dataForge.concatSeries)
    * [.use()](#dataForge.use)
    * [.fromJSON(jsonTextString, [config])](#dataForge.fromJSON)
    * [.range(start, count)](#dataForge.range)
    * [.matrix(numColumns, numRows, start, increment)](#dataForge.matrix)
    * [.zipSeries(series, selector)](#dataForge.zipSeries)
    * [.zipDataFrames(dataFrames, selector)](#dataForge.zipDataFrames)

<a name="dataForge.DataFrame"></a>

### dataForge.DataFrame ⇐ <code>[Series](#dataForge.Series)</code>
**Kind**: static class of <code>[dataForge](#dataForge)</code>  
**Extends:** <code>[Series](#dataForge.Series)</code>  

* [.DataFrame](#dataForge.DataFrame) ⇐ <code>[Series](#dataForge.Series)</code>
    * [new DataFrame(config|values)](#new_dataForge.DataFrame_new)
    * [.getColumnNames()](#dataForge.DataFrame+getColumnNames)
    * [.getColumnIndex(columnName)](#dataForge.DataFrame+getColumnIndex) ⇒ <code>Number</code>
    * [.getColumnName(columnIndex)](#dataForge.DataFrame+getColumnName) ⇒ <code>string</code>
    * [.getSeries(columnName)](#dataForge.DataFrame+getSeries)
    * [.hasSeries(columnName)](#dataForge.DataFrame+hasSeries)
    * [.expectSeries(columnName)](#dataForge.DataFrame+expectSeries)
    * [.getColumns()](#dataForge.DataFrame+getColumns)
    * [.subset(columnNames)](#dataForge.DataFrame+subset)
    * [.dropSeries(columnOrColumns)](#dataForge.DataFrame+dropSeries)
    * [.keepSeries(columnOrColumns)](#dataForge.DataFrame+keepSeries)
    * [.withSeries(columnName, series)](#dataForge.DataFrame+withSeries)
    * [.setIndex(columnName)](#dataForge.DataFrame+setIndex)
    * [.toString()](#dataForge.DataFrame+toString)
    * [.parseInts(columnNameOrNames)](#dataForge.DataFrame+parseInts)
    * [.parseFloats(columnNameOrNames)](#dataForge.DataFrame+parseFloats)
    * [.parseDates(columnNameOrNames, [formatString])](#dataForge.DataFrame+parseDates)
    * [.toStrings(columnNameOrNames, [formatString])](#dataForge.DataFrame+toStrings)
    * [.detectTypes()](#dataForge.DataFrame+detectTypes)
    * [.detectValues()](#dataForge.DataFrame+detectValues)
    * [.truncateStrings(maxLength)](#dataForge.DataFrame+truncateStrings)
    * [.remapColumns(columnNames)](#dataForge.DataFrame+remapColumns)
    * [.renameSeries(newColumnNames|columnsMap)](#dataForge.DataFrame+renameSeries)
    * [.toRows()](#dataForge.DataFrame+toRows)
    * [.toJSON()](#dataForge.DataFrame+toJSON)
    * [.toCSV()](#dataForge.DataFrame+toCSV)
    * [.transformSeries(columnSelectors)](#dataForge.DataFrame+transformSeries)
    * [.generateSeries(generator)](#dataForge.DataFrame+generateSeries)
    * [.deflate(selector)](#dataForge.DataFrame+deflate)
    * [.inflateColumn(columnNameOrIndex, [selector])](#dataForge.DataFrame+inflateColumn)
    * [.aggregate([seed], selector)](#dataForge.DataFrame+aggregate)
    * [.bringToFront(columnOrColumns)](#dataForge.DataFrame+bringToFront)
    * [.bringToBack(columnOrColumns)](#dataForge.DataFrame+bringToBack)
    * [.pivot(column, value)](#dataForge.DataFrame+pivot)
    * [.merge(otherDataFrame, [columnName])](#dataForge.DataFrame+merge)
    * [.contains(row)](#dataForge.DataFrame+contains)
    * [.concat(dataFrames)](#dataForge.DataFrame+concat)
    * [.toRows()](#dataForge.DataFrame+toRows)
    * [.getIterator()](#dataForge.Series+getIterator) ⇒ <code>iterator</code>
    * [.getIndex()](#dataForge.Series+getIndex) ⇒ <code>Series</code>
    * [.withIndex(newIndex)](#dataForge.Series+withIndex) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.resetIndex()](#dataForge.Series+resetIndex) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.skip(numRows)](#dataForge.Series+skip) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.skipWhile(predicate)](#dataForge.Series+skipWhile) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.skipUntil(predicate)](#dataForge.Series+skipUntil) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.take(numRows)](#dataForge.Series+take) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.takeWhile(predicate)](#dataForge.Series+takeWhile) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.takeUntil(predicate)](#dataForge.Series+takeUntil) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.where(predicate)](#dataForge.Series+where) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.select(selector)](#dataForge.Series+select) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.selectPairs(selector)](#dataForge.Series+selectPairs) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.selectMany(generator)](#dataForge.Series+selectMany) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.selectManyPairs(generator)](#dataForge.Series+selectManyPairs) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.thenBy(sortSelector)](#dataForge.Series+thenBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.thenByDescending(sortSelector)](#dataForge.Series+thenByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.orderBy(sortSelector)](#dataForge.Series+orderBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.orderByDescending(sortSelector)](#dataForge.Series+orderByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])](#dataForge.Series+slice)
    * [.window(period)](#dataForge.Series+window)
    * [.rollingWindow(period)](#dataForge.Series+rollingWindow)
    * [.percentChange()](#dataForge.Series+percentChange)
    * [.bake()](#dataForge.Series+bake)
    * [.toPairs()](#dataForge.Series+toPairs)
    * [.count()](#dataForge.Series+count)
    * [.first()](#dataForge.Series+first)
    * [.last()](#dataForge.Series+last)
    * [.firstPair()](#dataForge.Series+firstPair)
    * [.lastPair()](#dataForge.Series+lastPair)
    * [.firstIndex()](#dataForge.Series+firstIndex)
    * [.lastIndex()](#dataForge.Series+lastIndex)
    * [.reverse()](#dataForge.Series+reverse)
    * [.inflate([selector])](#dataForge.Series+inflate)
    * [.head(values)](#dataForge.Series+head)
    * [.tail(values)](#dataForge.Series+tail)
    * [.sum()](#dataForge.Series+sum)
    * [.average()](#dataForge.Series+average)
    * [.min()](#dataForge.Series+min)
    * [.max()](#dataForge.Series+max)
    * [.toObject(keySelector, keySelector)](#dataForge.Series+toObject)
    * [.zip(series|dataframe, selector)](#dataForge.Series+zip)
    * [.forEach(callback)](#dataForge.Series+forEach)
    * [.all(predicate)](#dataForge.Series+all)
    * [.any([predicate])](#dataForge.Series+any)
    * [.none([predicate])](#dataForge.Series+none)
    * [.sequentialDistinct(selector)](#dataForge.Series+sequentialDistinct)
    * [.distinct(selector)](#dataForge.Series+distinct)
    * [.variableWindow(comparer)](#dataForge.Series+variableWindow)
    * [.insertPair(pair)](#dataForge.Series+insertPair)
    * [.appendPair(pair)](#dataForge.Series+appendPair)
    * [.fillGaps(predicate, generator)](#dataForge.Series+fillGaps)
    * [.groupBy(selector)](#dataForge.Series+groupBy)
    * [.groupSequentialBy(selector)](#dataForge.Series+groupSequentialBy)
    * [.at(index)](#dataForge.Series+at)
    * [.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)](#dataForge.Series+join)
    * [.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuter)
    * [.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterLeft)
    * [.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterRight)
    * [.defaultIfEmpty(defaultSequence)](#dataForge.Series+defaultIfEmpty)
    * [.union(other, [comparer])](#dataForge.Series+union)
    * [.intersection(other, [comparer])](#dataForge.Series+intersection)
    * [.except(other, [comparer])](#dataForge.Series+except)

<a name="new_dataForge.DataFrame_new"></a>

#### new DataFrame(config|values)
Constructor for DataFrame.


| Param | Type | Description |
| --- | --- | --- |
| config|values | <code>object</code> &#124; <code>array</code> | Specifies content and configuration for the DataFrame. |

<a name="dataForge.DataFrame+getColumnNames"></a>

#### dataFrame.getColumnNames()
Get the names of the columns in the data frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.DataFrame+getColumnIndex"></a>

#### dataFrame.getColumnIndex(columnName) ⇒ <code>Number</code>
Gets a column index from a column name.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Number</code> - Returns the index of the named column or -1 if the requested column was not found.  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | The name of the column to retrieve the column index for. |

<a name="dataForge.DataFrame+getColumnName"></a>

#### dataFrame.getColumnName(columnIndex) ⇒ <code>string</code>
Gets a column name from a column index.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>string</code> - Returns the name of the column or undefined if the requested column was not found.  

| Param | Type | Description |
| --- | --- | --- |
| columnIndex | <code>int</code> | The index of the column to retrieve the column name for. |

<a name="dataForge.DataFrame+getSeries"></a>

#### dataFrame.getSeries(columnName)
Retreive a time-series from a column of the data-frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Specifies the column to retreive. |

<a name="dataForge.DataFrame+hasSeries"></a>

#### dataFrame.hasSeries(columnName)
Returns true if the column with the requested name exists in the data frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name of the column to check. |

<a name="dataForge.DataFrame+expectSeries"></a>

#### dataFrame.expectSeries(columnName)
Verify the existance of a column and return it.Throws an exception if the column doesn't exist.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name or index of the column to retreive. |

<a name="dataForge.DataFrame+getColumns"></a>

#### dataFrame.getColumns()
Retreive a collection of all columns.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.DataFrame+subset"></a>

#### dataFrame.subset(columnNames)
Create a new data-frame from a subset of columns.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNames | <code>array</code> | Array of column names to include in the new data-frame. |

<a name="dataForge.DataFrame+dropSeries"></a>

#### dataFrame.dropSeries(columnOrColumns)
Create a new data frame with the requested column or columns dropped.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column name (a string) or columns (array of column names) to drop. |

<a name="dataForge.DataFrame+keepSeries"></a>

#### dataFrame.keepSeries(columnOrColumns)
Create a new data frame with only the requested column or columns dropped, other columns are dropped.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column name (a string) or columns (array of column names) to keep. |

<a name="dataForge.DataFrame+withSeries"></a>

#### dataFrame.withSeries(columnName, series)
Create a new data frame with an additional column specified by the passed-in series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | The name of the column to add or replace. |
| series | <code>Series</code> | Series to add to the data-frame. |

<a name="dataForge.DataFrame+setIndex"></a>

#### dataFrame.setIndex(columnName)
Set a named column as the index of the data-frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name or index of the column to set as the index. |

<a name="dataForge.DataFrame+toString"></a>

#### dataFrame.toString()
Format the data frame for display as a string.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[toString](#dataForge.Series+toString)</code>  
<a name="dataForge.DataFrame+parseInts"></a>

#### dataFrame.parseInts(columnNameOrNames)
Parse a column with string values to a column with int values.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[parseInts](#dataForge.Series+parseInts)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrNames | <code>string</code> &#124; <code>array</code> | Specifies the column name or array of column names to parse. |

<a name="dataForge.DataFrame+parseFloats"></a>

#### dataFrame.parseFloats(columnNameOrNames)
Parse a column with string values to a column with float values.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[parseFloats](#dataForge.Series+parseFloats)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrNames | <code>string</code> &#124; <code>array</code> | Specifies the column name or array of column names to parse. |

<a name="dataForge.DataFrame+parseDates"></a>

#### dataFrame.parseDates(columnNameOrNames, [formatString])
Parse a column with string values to a column with date values.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[parseDates](#dataForge.Series+parseDates)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrNames | <code>string</code> &#124; <code>array</code> | Specifies the column name or array of column names to parse. |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="dataForge.DataFrame+toStrings"></a>

#### dataFrame.toStrings(columnNameOrNames, [formatString])
Convert a column of values of different types to a column of string values.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[toStrings](#dataForge.Series+toStrings)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrNames | <code>string</code> &#124; <code>array</code> | Specifies the column name or array of column names to convert to strings. |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="dataForge.DataFrame+detectTypes"></a>

#### dataFrame.detectTypes()
Detect actual types and their frequencies contained within columns in the data frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[detectTypes](#dataForge.Series+detectTypes)</code>  
<a name="dataForge.DataFrame+detectValues"></a>

#### dataFrame.detectValues()
Detect values and their frequencies contained within columns in the data frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[detectValues](#dataForge.Series+detectValues)</code>  
<a name="dataForge.DataFrame+truncateStrings"></a>

#### dataFrame.truncateStrings(maxLength)
Produces a new data frame with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[truncateStrings](#dataForge.Series+truncateStrings)</code>  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="dataForge.DataFrame+remapColumns"></a>

#### dataFrame.remapColumns(columnNames)
Create a new data frame with columns reordered.New column names create new columns (with undefined values), omitting existing column names causes those columns to be dropped.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNames | <code>array</code> | The new order for columns. |

<a name="dataForge.DataFrame+renameSeries"></a>

#### dataFrame.renameSeries(newColumnNames|columnsMap)
Create a new data-frame with renamed series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| newColumnNames|columnsMap | <code>array</code> &#124; <code>object</code> | Array of strings, with an element for each existing column that specifies the new name of that column. Or, a hash that maps old column name to new column name. |

<a name="dataForge.DataFrame+toRows"></a>

#### dataFrame.toRows()
Bake the data frame to an array of rows.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.DataFrame+toJSON"></a>

#### dataFrame.toJSON()
Serialize the data frame to JSON.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.DataFrame+toCSV"></a>

#### dataFrame.toCSV()
Serialize the data frame to CSV.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.DataFrame+transformSeries"></a>

#### dataFrame.transformSeries(columnSelectors)
Transform one or more columns. This is equivalent to extracting a column, calling 'select' on it,then plugging it back in as the same column.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnSelectors | <code>object</code> | Object with field names for each column to be transformed. Each field you be a selector that transforms that column. |

<a name="dataForge.DataFrame+generateSeries"></a>

#### dataFrame.generateSeries(generator)
Generate new columns based on existing rows.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| generator | <code>function</code> &#124; <code>object</code> | Generator function that transforms each row to a new set of columns. |

<a name="dataForge.DataFrame+deflate"></a>

#### dataFrame.deflate(selector)
Deflate a data-frame to a series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each row to a new sequence of values. |

<a name="dataForge.DataFrame+inflateColumn"></a>

#### dataFrame.inflateColumn(columnNameOrIndex, [selector])
Inflate a named column in the data-frame to 1 or more new columns.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrIndex | <code>string</code> &#124; <code>int</code> | Name or index of the column to retreive. |
| [selector] | <code>function</code> | Selector function that transforms each value in the column to new columns. |

<a name="dataForge.DataFrame+aggregate"></a>

#### dataFrame.aggregate([seed], selector)
Aggregate the rows of the data-frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[aggregate](#dataForge.Series+aggregate)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [seed] | <code>object</code> | The seed value for producing the aggregation. |
| selector | <code>function</code> | Function that takes the seed and then each row in the data-frame and produces the aggregate value. |

<a name="dataForge.DataFrame+bringToFront"></a>

#### dataFrame.bringToFront(columnOrColumns)
Bring the name column to the front, making it the first column in the data-frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column or columns to bring to the front. |

<a name="dataForge.DataFrame+bringToBack"></a>

#### dataFrame.bringToBack(columnOrColumns)
Bring the name column to the back, making it the last column in the data-frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column or columns to bring to the back. |

<a name="dataForge.DataFrame+pivot"></a>

#### dataFrame.pivot(column, value)
Reshape (or pivot) a table based on column values.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| column | <code>string</code> | Column name whose values make the new DataFrame's columns. |
| value | <code>string</code> | Column name whose values populate the new DataFrame's values. |

<a name="dataForge.DataFrame+merge"></a>

#### dataFrame.merge(otherDataFrame, [columnName])
Merge this DataFrame with another.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| otherDataFrame | <code>DataFrame</code> | The other DataFrame to merge in. |
| [columnName] | <code>string</code> | Optional column name used to join the DataFrames. Omit to merge on index. |

<a name="dataForge.DataFrame+contains"></a>

#### dataFrame.contains(row)
Returns true if the DataFrame contains the specified row.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[contains](#dataForge.Series+contains)</code>  

| Param | Type | Description |
| --- | --- | --- |
| row | <code>function</code> | The row to check for in the DataFrame. |

<a name="dataForge.DataFrame+concat"></a>

#### dataFrame.concat(dataFrames)
Concatenate multiple other dataframes onto this dataframe.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[concat](#dataForge.Series+concat)</code>  

| Param | Type | Description |
| --- | --- | --- |
| dataFrames | <code>array</code> &#124; <code>DataFrame</code> | Multiple arguments. Each can be either a dataframe or an array of dataframe. |

<a name="dataForge.DataFrame+toRows"></a>

#### dataFrame.toRows()
Retreive each row of the dataframe as an array (no column names included)

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+getIterator"></a>

#### dataFrame.getIterator() ⇒ <code>iterator</code>
Get an iterator for index & values of the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>iterator</code> - Returns an iterator that can be used to enumerate and lazily evalute the contents of the series or dataframe.  
<a name="dataForge.Series+getIndex"></a>

#### dataFrame.getIndex() ⇒ <code>Series</code>
Retreive the index of the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> - Returns a new series that contains the values of the index for this series.  
<a name="dataForge.Series+withIndex"></a>

#### dataFrame.withIndex(newIndex) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Apply a new index to the Series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - - Returns a new series or dataframe with the specified index attached.  

| Param | Type | Description |
| --- | --- | --- |
| newIndex | <code>array</code> &#124; <code>Series</code> | The new index to apply to the Series. |

<a name="dataForge.Series+resetIndex"></a>

#### dataFrame.resetIndex() ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Reset the index of the data frame back to the default sequential integer index.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - - Returns a new series or dataframe with the index reset to the default zero-based index.  
<a name="dataForge.Series+skip"></a>

#### dataFrame.skip(numRows) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Skip a number of rows in the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the specified number of values skipped.  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to skip. |

<a name="dataForge.Series+skipWhile"></a>

#### dataFrame.skipWhile(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Skips values in the series while a condition is met.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all initial sequential values removed that match the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="dataForge.Series+skipUntil"></a>

#### dataFrame.skipUntil(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Skips values in the series until a condition is met.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all initial sequential values removed that don't match the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="dataForge.Series+take"></a>

#### dataFrame.take(numRows) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Take a number of rows in the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with up to the specified number of values included.  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="dataForge.Series+takeWhile"></a>

#### dataFrame.takeWhile(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Take values from the series while a condition is met.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that only includes the initial sequential values that have matched the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="dataForge.Series+takeUntil"></a>

#### dataFrame.takeUntil(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Take values from the series until a condition is met.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that only includes the initial sequential values that have not matched the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="dataForge.Series+where"></a>

#### dataFrame.where(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Filter a series by a predicate selector.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe containing only the values that match the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicte function to filter rows of the series. |

<a name="dataForge.Series+select"></a>

#### dataFrame.select(selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been transformed by the selector function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value to create a new series or dataframe. |

<a name="dataForge.Series+selectPairs"></a>

#### dataFrame.selectPairs(selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with index/value pairs that have been transformed by the selector function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each index/value to a create a new series. |

<a name="dataForge.Series+selectMany"></a>

#### dataFrame.selectMany(generator) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with values that have been produced by the generator function.  

| Param | Type | Description |
| --- | --- | --- |
| generator | <code>function</code> | Generator function that may generator 0 or more new values from value in the series or dataframe. |

<a name="dataForge.Series+selectManyPairs"></a>

#### dataFrame.selectManyPairs(generator) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Generate a new series based on the results of the generator function.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with index/value pairs that have been produced by the generator function.  

| Param | Type | Description |
| --- | --- | --- |
| generator | <code>function</code> | Generator function that may generator 0 or more new index/value pairs from each pair in the series or dataframe. |

<a name="dataForge.Series+thenBy"></a>

#### dataFrame.thenBy(sortSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs additional sorting (ascending).

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+thenByDescending"></a>

#### dataFrame.thenByDescending(sortSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs additional sorting (descending).

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+orderBy"></a>

#### dataFrame.orderBy(sortSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Sorts the series or dataframe (ascending).

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+orderByDescending"></a>

#### dataFrame.orderByDescending(sortSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Sorts the series or dataframe (descending).

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+slice"></a>

#### dataFrame.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])
Create a new series from a slice of rows.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| startIndexOrStartPredicate | <code>int</code> &#124; <code>function</code> | Index where the slice starts or a predicate function that determines where the slice starts. |
| endIndexOrEndPredicate | <code>int</code> &#124; <code>function</code> | Marks the end of the slice, one row past the last row to include. Or a predicate function that determines when the slice has ended. |
| [predicate] | <code>function</code> | Optional predicate to compare index against start/end index. Return true to start or stop the slice. |

<a name="dataForge.Series+window"></a>

#### dataFrame.window(period)
Segment a Series into 'windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original Series.
Use select or selectPairs to aggregate.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of values in the window. |

<a name="dataForge.Series+rollingWindow"></a>

#### dataFrame.rollingWindow(period)
Segment a Series into 'rolling windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original Series.
Use select or selectPairs to aggregate.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of values in the window. |

<a name="dataForge.Series+percentChange"></a>

#### dataFrame.percentChange()
Compute the percent change for each row after the first.
Percentages are expressed as 0-1 values.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+bake"></a>

#### dataFrame.bake()
Forces lazy evaluation to complete and 'bakes' the series into memory.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+toPairs"></a>

#### dataFrame.toPairs()
Retreive the data as pairs of [index, value].

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+count"></a>

#### dataFrame.count()
Count the number of rows in the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+first"></a>

#### dataFrame.first()
Get the first value of the Series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+last"></a>

#### dataFrame.last()
Get the last value of the Series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+firstPair"></a>

#### dataFrame.firstPair()
Get the first index/value pair of the Series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+lastPair"></a>

#### dataFrame.lastPair()
Get the last index/value pair of the Series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+firstIndex"></a>

#### dataFrame.firstIndex()
Get the first index of the Series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+lastIndex"></a>

#### dataFrame.lastIndex()
Get the last index of the Series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+reverse"></a>

#### dataFrame.reverse()
Reverse the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+inflate"></a>

#### dataFrame.inflate([selector])
Inflate a series to a data-frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [selector] | <code>function</code> | Optional selector function that transforms each value in the series to a row in the new data-frame. |

<a name="dataForge.Series+head"></a>

#### dataFrame.head(values)
Get X values from the head of the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="dataForge.Series+tail"></a>

#### dataFrame.tail(values)
Get X values from the tail of the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="dataForge.Series+sum"></a>

#### dataFrame.sum()
Sum the values in a series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+average"></a>

#### dataFrame.average()
Average the values in a series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+min"></a>

#### dataFrame.min()
Get the min value in the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+max"></a>

#### dataFrame.max()
Get the max value in the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
<a name="dataForge.Series+toObject"></a>

#### dataFrame.toObject(keySelector, keySelector)
Convert the series to a JavaScript object.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| keySelector | <code>function</code> | Function that selects keys for the resulting object. |
| keySelector | <code>valueSelector</code> | Function that selects values for the resulting object. |

<a name="dataForge.Series+zip"></a>

#### dataFrame.zip(series|dataframe, selector)
Zip together multiple series or dataframes to produce a new series or dataframe.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| series|dataframe | <code>series</code> &#124; <code>dataframe</code> | Each series or dataframe that is to be zipped. |
| selector | <code>function</code> | Selector function that produces a new series or dataframe based on the inputs. |

<a name="dataForge.Series+forEach"></a>

#### dataFrame.forEach(callback)
Invoke a callback function for each value in the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The calback to invoke for each value. |

<a name="dataForge.Series+all"></a>

#### dataFrame.all(predicate)
Determine if the predicate returns truthy for all values.
Returns false as soon as the predicate evaluates to falsy.
Returns true if the predicate returns truthy for all values in the Series.
Returns false if the series is empty.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+any"></a>

#### dataFrame.any([predicate])
Determine if the predicate returns truthy for any of the values.
Returns true as soon as the predicate returns truthy.
Returns false if the predicate never returns truthy.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [predicate] | <code>function</code> | Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+none"></a>

#### dataFrame.none([predicate])
Determine if the predicate returns truthy for none of the values.
Returns true for an empty Series.
Returns true if the predicate always returns falsy.
Otherwise returns false.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [predicate] | <code>function</code> | Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+sequentialDistinct"></a>

#### dataFrame.sequentialDistinct(selector)
Group sequential duplicate values into a Series of windows.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selects the value used to compare for duplicates. |

<a name="dataForge.Series+distinct"></a>

#### dataFrame.distinct(selector)
Group distinct values in the Series into a Series of windows.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selects the value used to compare for duplicates. |

<a name="dataForge.Series+variableWindow"></a>

#### dataFrame.variableWindow(comparer)
Groups sequential values into variable length 'windows'. The windows can then be transformed/transformed using selectPairs or selectManyPairs.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| comparer | <code>function</code> | Predicate that compares two values and returns true if they should be in the same window. |

<a name="dataForge.Series+insertPair"></a>

#### dataFrame.insertPair(pair)
Insert a pair at the start of a Series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pair | <code>pair</code> | The pair to insert. |

<a name="dataForge.Series+appendPair"></a>

#### dataFrame.appendPair(pair)
Append a pair to the end of a Series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pair | <code>pair</code> | The pair to append. |

<a name="dataForge.Series+fillGaps"></a>

#### dataFrame.fillGaps(predicate, generator)
Fill gaps in a series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicate that is passed pairA and pairB, two consecutive rows, return truthy if there is a gap between the rows, or falsey if there is no gap. |
| generator | <code>function</code> | Generator that is passed pairA and pairB, two consecutive rows, returns an array of pairs that fills the gap between the rows. |

<a name="dataForge.Series+groupBy"></a>

#### dataFrame.groupBy(selector)
Group the series according to the selector.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector that defines the value to group by. |

<a name="dataForge.Series+groupSequentialBy"></a>

#### dataFrame.groupSequentialBy(selector)
Group sequential duplicate values into a Series of windows.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector that defines the value to group by. |

<a name="dataForge.Series+at"></a>

#### dataFrame.at(index)
Get the value at a specified index.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>function</code> | Index to for which to retreive the value. |

<a name="dataForge.Series+join"></a>

#### dataFrame.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)
Correlates the elements of two Series or DataFrames based on matching keys.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| resultSelector | <code>function</code> | Selector that defines how to merge outer and inner values. |

<a name="dataForge.Series+joinOuter"></a>

#### dataFrame.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)
Performs an outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes elements that have no correlation.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| outerResultSelector | <code>function</code> | Selector that defines how to extract the outer value before joining it with the inner value. |
| innerResultSelector | <code>function</code> | Selector that defines how to extract the inner value before joining it with the outer value. |
| mergeSelector | <code>function</code> | Selector that defines how to combine left and right. Implementation from here: 	http://blogs.geniuscode.net/RyanDHatch/?p=116 |

<a name="dataForge.Series+joinOuterLeft"></a>

#### dataFrame.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)
Performs a left outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes left elements that have no correlation.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| outerResultSelector | <code>function</code> | Selector that defines how to extract the outer value before joining it with the inner value. |
| innerResultSelector | <code>function</code> | Selector that defines how to extract the inner value before joining it with the outer value. |
| mergeSelector | <code>function</code> | Selector that defines how to combine left and right. Implementation from here: 	http://blogs.geniuscode.net/RyanDHatch/?p=116 |

<a name="dataForge.Series+joinOuterRight"></a>

#### dataFrame.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)
Performs a right outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes right elements that have no correlation.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| outerResultSelector | <code>function</code> | Selector that defines how to extract the outer value before joining it with the inner value. |
| innerResultSelector | <code>function</code> | Selector that defines how to extract the inner value before joining it with the outer value. |
| mergeSelector | <code>function</code> | Selector that defines how to combine left and right. Implementation from here: 	http://blogs.geniuscode.net/RyanDHatch/?p=116 |

<a name="dataForge.Series+defaultIfEmpty"></a>

#### dataFrame.defaultIfEmpty(defaultSequence)
Returns the specified default sequence if the Series or DataFrame is empty.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| defaultSequence | <code>array</code> &#124; <code>Series</code> &#124; <code>DataFrame</code> | Default sequence to return if the Series or DataFrame is empty. |

<a name="dataForge.Series+union"></a>

#### dataFrame.union(other, [comparer])
Returns the unique union of values between two Series or DataFrames.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+intersection"></a>

#### dataFrame.intersection(other, [comparer])
Returns the intersection of values between two Series or DataFrames.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+except"></a>

#### dataFrame.except(other, [comparer])
Returns the exception of values between two Series or DataFrames.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series"></a>

### dataForge.Series
**Kind**: static class of <code>[dataForge](#dataForge)</code>  

* [.Series](#dataForge.Series)
    * [new Series(config|values)](#new_dataForge.Series_new)
    * [.getIterator()](#dataForge.Series+getIterator) ⇒ <code>iterator</code>
    * [.getIndex()](#dataForge.Series+getIndex) ⇒ <code>Series</code>
    * [.withIndex(newIndex)](#dataForge.Series+withIndex) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.resetIndex()](#dataForge.Series+resetIndex) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.skip(numRows)](#dataForge.Series+skip) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.skipWhile(predicate)](#dataForge.Series+skipWhile) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.skipUntil(predicate)](#dataForge.Series+skipUntil) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.take(numRows)](#dataForge.Series+take) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.takeWhile(predicate)](#dataForge.Series+takeWhile) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.takeUntil(predicate)](#dataForge.Series+takeUntil) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.where(predicate)](#dataForge.Series+where) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.select(selector)](#dataForge.Series+select) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.selectPairs(selector)](#dataForge.Series+selectPairs) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.selectMany(generator)](#dataForge.Series+selectMany) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.selectManyPairs(generator)](#dataForge.Series+selectManyPairs) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.thenBy(sortSelector)](#dataForge.Series+thenBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.thenByDescending(sortSelector)](#dataForge.Series+thenByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.orderBy(sortSelector)](#dataForge.Series+orderBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.orderByDescending(sortSelector)](#dataForge.Series+orderByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])](#dataForge.Series+slice)
    * [.window(period)](#dataForge.Series+window)
    * [.rollingWindow(period)](#dataForge.Series+rollingWindow)
    * [.toString()](#dataForge.Series+toString)
    * [.percentChange()](#dataForge.Series+percentChange)
    * [.parseInts()](#dataForge.Series+parseInts)
    * [.parseFloats()](#dataForge.Series+parseFloats)
    * [.parseDates([formatString])](#dataForge.Series+parseDates)
    * [.toStrings([formatString])](#dataForge.Series+toStrings)
    * [.detectTypes()](#dataForge.Series+detectTypes)
    * [.detectValues()](#dataForge.Series+detectValues)
    * [.truncateStrings(maxLength)](#dataForge.Series+truncateStrings)
    * [.bake()](#dataForge.Series+bake)
    * [.toPairs()](#dataForge.Series+toPairs)
    * [.count()](#dataForge.Series+count)
    * [.first()](#dataForge.Series+first)
    * [.last()](#dataForge.Series+last)
    * [.firstPair()](#dataForge.Series+firstPair)
    * [.lastPair()](#dataForge.Series+lastPair)
    * [.firstIndex()](#dataForge.Series+firstIndex)
    * [.lastIndex()](#dataForge.Series+lastIndex)
    * [.reverse()](#dataForge.Series+reverse)
    * [.inflate([selector])](#dataForge.Series+inflate)
    * [.head(values)](#dataForge.Series+head)
    * [.tail(values)](#dataForge.Series+tail)
    * [.sum()](#dataForge.Series+sum)
    * [.average()](#dataForge.Series+average)
    * [.min()](#dataForge.Series+min)
    * [.max()](#dataForge.Series+max)
    * [.aggregate([seed], selector)](#dataForge.Series+aggregate)
    * [.toObject(keySelector, keySelector)](#dataForge.Series+toObject)
    * [.zip(series|dataframe, selector)](#dataForge.Series+zip)
    * [.forEach(callback)](#dataForge.Series+forEach)
    * [.all(predicate)](#dataForge.Series+all)
    * [.any([predicate])](#dataForge.Series+any)
    * [.none([predicate])](#dataForge.Series+none)
    * [.sequentialDistinct(selector)](#dataForge.Series+sequentialDistinct)
    * [.distinct(selector)](#dataForge.Series+distinct)
    * [.variableWindow(comparer)](#dataForge.Series+variableWindow)
    * [.insertPair(pair)](#dataForge.Series+insertPair)
    * [.appendPair(pair)](#dataForge.Series+appendPair)
    * [.fillGaps(predicate, generator)](#dataForge.Series+fillGaps)
    * [.groupBy(selector)](#dataForge.Series+groupBy)
    * [.groupSequentialBy(selector)](#dataForge.Series+groupSequentialBy)
    * [.at(index)](#dataForge.Series+at)
    * [.contains(value)](#dataForge.Series+contains)
    * [.concat(series)](#dataForge.Series+concat)
    * [.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)](#dataForge.Series+join)
    * [.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuter)
    * [.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterLeft)
    * [.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterRight)
    * [.defaultIfEmpty(defaultSequence)](#dataForge.Series+defaultIfEmpty)
    * [.union(other, [comparer])](#dataForge.Series+union)
    * [.intersection(other, [comparer])](#dataForge.Series+intersection)
    * [.except(other, [comparer])](#dataForge.Series+except)

<a name="new_dataForge.Series_new"></a>

#### new Series(config|values)
Constructor for Series.


| Param | Type | Description |
| --- | --- | --- |
| config|values | <code>object</code> &#124; <code>array</code> | Specifies content and configuration for the Series. |

<a name="dataForge.Series+getIterator"></a>

#### series.getIterator() ⇒ <code>iterator</code>
Get an iterator for index & values of the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>iterator</code> - Returns an iterator that can be used to enumerate and lazily evalute the contents of the series or dataframe.  
<a name="dataForge.Series+getIndex"></a>

#### series.getIndex() ⇒ <code>Series</code>
Retreive the index of the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a new series that contains the values of the index for this series.  
<a name="dataForge.Series+withIndex"></a>

#### series.withIndex(newIndex) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Apply a new index to the Series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - - Returns a new series or dataframe with the specified index attached.  

| Param | Type | Description |
| --- | --- | --- |
| newIndex | <code>array</code> &#124; <code>Series</code> | The new index to apply to the Series. |

<a name="dataForge.Series+resetIndex"></a>

#### series.resetIndex() ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Reset the index of the data frame back to the default sequential integer index.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - - Returns a new series or dataframe with the index reset to the default zero-based index.  
<a name="dataForge.Series+skip"></a>

#### series.skip(numRows) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Skip a number of rows in the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the specified number of values skipped.  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to skip. |

<a name="dataForge.Series+skipWhile"></a>

#### series.skipWhile(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Skips values in the series while a condition is met.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all initial sequential values removed that match the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="dataForge.Series+skipUntil"></a>

#### series.skipUntil(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Skips values in the series until a condition is met.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all initial sequential values removed that don't match the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="dataForge.Series+take"></a>

#### series.take(numRows) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Take a number of rows in the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with up to the specified number of values included.  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="dataForge.Series+takeWhile"></a>

#### series.takeWhile(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Take values from the series while a condition is met.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that only includes the initial sequential values that have matched the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="dataForge.Series+takeUntil"></a>

#### series.takeUntil(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Take values from the series until a condition is met.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that only includes the initial sequential values that have not matched the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="dataForge.Series+where"></a>

#### series.where(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Filter a series by a predicate selector.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe containing only the values that match the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicte function to filter rows of the series. |

<a name="dataForge.Series+select"></a>

#### series.select(selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been transformed by the selector function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value to create a new series or dataframe. |

<a name="dataForge.Series+selectPairs"></a>

#### series.selectPairs(selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with index/value pairs that have been transformed by the selector function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each index/value to a create a new series. |

<a name="dataForge.Series+selectMany"></a>

#### series.selectMany(generator) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with values that have been produced by the generator function.  

| Param | Type | Description |
| --- | --- | --- |
| generator | <code>function</code> | Generator function that may generator 0 or more new values from value in the series or dataframe. |

<a name="dataForge.Series+selectManyPairs"></a>

#### series.selectManyPairs(generator) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Generate a new series based on the results of the generator function.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with index/value pairs that have been produced by the generator function.  

| Param | Type | Description |
| --- | --- | --- |
| generator | <code>function</code> | Generator function that may generator 0 or more new index/value pairs from each pair in the series or dataframe. |

<a name="dataForge.Series+thenBy"></a>

#### series.thenBy(sortSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs additional sorting (ascending).

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+thenByDescending"></a>

#### series.thenByDescending(sortSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs additional sorting (descending).

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+orderBy"></a>

#### series.orderBy(sortSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Sorts the series or dataframe (ascending).

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+orderByDescending"></a>

#### series.orderByDescending(sortSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Sorts the series or dataframe (descending).

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+slice"></a>

#### series.slice(startIndexOrStartPredicate, endIndexOrEndPredicate, [predicate])
Create a new series from a slice of rows.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| startIndexOrStartPredicate | <code>int</code> &#124; <code>function</code> | Index where the slice starts or a predicate function that determines where the slice starts. |
| endIndexOrEndPredicate | <code>int</code> &#124; <code>function</code> | Marks the end of the slice, one row past the last row to include. Or a predicate function that determines when the slice has ended. |
| [predicate] | <code>function</code> | Optional predicate to compare index against start/end index. Return true to start or stop the slice. |

<a name="dataForge.Series+window"></a>

#### series.window(period)
Segment a Series into 'windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original Series.
Use select or selectPairs to aggregate.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of values in the window. |

<a name="dataForge.Series+rollingWindow"></a>

#### series.rollingWindow(period)
Segment a Series into 'rolling windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original Series.
Use select or selectPairs to aggregate.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of values in the window. |

<a name="dataForge.Series+toString"></a>

#### series.toString()
Format the data frame for display as a string.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+percentChange"></a>

#### series.percentChange()
Compute the percent change for each row after the first.
Percentages are expressed as 0-1 values.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+parseInts"></a>

#### series.parseInts()
Parse a series with string values to a series with int values.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+parseFloats"></a>

#### series.parseFloats()
Parse a series with string values to a series with float values.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+parseDates"></a>

#### series.parseDates([formatString])
Parse a series with string values to a series with date values.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="dataForge.Series+toStrings"></a>

#### series.toStrings([formatString])
Convert a series of values of different types to a series of string values.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="dataForge.Series+detectTypes"></a>

#### series.detectTypes()
Detect the actual types of the values that comprised the series and their frequency.
Returns a new series containing the type information.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+detectValues"></a>

#### series.detectValues()
Detect the frequency of values in the series.
Returns a new series containing the information.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+truncateStrings"></a>

#### series.truncateStrings(maxLength)
Produces a new series with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="dataForge.Series+bake"></a>

#### series.bake()
Forces lazy evaluation to complete and 'bakes' the series into memory.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+toPairs"></a>

#### series.toPairs()
Retreive the data as pairs of [index, value].

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+count"></a>

#### series.count()
Count the number of rows in the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+first"></a>

#### series.first()
Get the first value of the Series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+last"></a>

#### series.last()
Get the last value of the Series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+firstPair"></a>

#### series.firstPair()
Get the first index/value pair of the Series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+lastPair"></a>

#### series.lastPair()
Get the last index/value pair of the Series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+firstIndex"></a>

#### series.firstIndex()
Get the first index of the Series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+lastIndex"></a>

#### series.lastIndex()
Get the last index of the Series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+reverse"></a>

#### series.reverse()
Reverse the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+inflate"></a>

#### series.inflate([selector])
Inflate a series to a data-frame.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [selector] | <code>function</code> | Optional selector function that transforms each value in the series to a row in the new data-frame. |

<a name="dataForge.Series+head"></a>

#### series.head(values)
Get X values from the head of the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="dataForge.Series+tail"></a>

#### series.tail(values)
Get X values from the tail of the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="dataForge.Series+sum"></a>

#### series.sum()
Sum the values in a series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+average"></a>

#### series.average()
Average the values in a series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+min"></a>

#### series.min()
Get the min value in the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+max"></a>

#### series.max()
Get the max value in the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
<a name="dataForge.Series+aggregate"></a>

#### series.aggregate([seed], selector)
Aggregate the values in the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [seed] | <code>object</code> | The seed value for producing the aggregation. |
| selector | <code>function</code> | Function that takes the seed and then each value in the series and produces the aggregate value. |

<a name="dataForge.Series+toObject"></a>

#### series.toObject(keySelector, keySelector)
Convert the series to a JavaScript object.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| keySelector | <code>function</code> | Function that selects keys for the resulting object. |
| keySelector | <code>valueSelector</code> | Function that selects values for the resulting object. |

<a name="dataForge.Series+zip"></a>

#### series.zip(series|dataframe, selector)
Zip together multiple series or dataframes to produce a new series or dataframe.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| series|dataframe | <code>series</code> &#124; <code>dataframe</code> | Each series or dataframe that is to be zipped. |
| selector | <code>function</code> | Selector function that produces a new series or dataframe based on the inputs. |

<a name="dataForge.Series+forEach"></a>

#### series.forEach(callback)
Invoke a callback function for each value in the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The calback to invoke for each value. |

<a name="dataForge.Series+all"></a>

#### series.all(predicate)
Determine if the predicate returns truthy for all values.
Returns false as soon as the predicate evaluates to falsy.
Returns true if the predicate returns truthy for all values in the Series.
Returns false if the series is empty.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+any"></a>

#### series.any([predicate])
Determine if the predicate returns truthy for any of the values.
Returns true as soon as the predicate returns truthy.
Returns false if the predicate never returns truthy.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [predicate] | <code>function</code> | Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+none"></a>

#### series.none([predicate])
Determine if the predicate returns truthy for none of the values.
Returns true for an empty Series.
Returns true if the predicate always returns falsy.
Otherwise returns false.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [predicate] | <code>function</code> | Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+sequentialDistinct"></a>

#### series.sequentialDistinct(selector)
Group sequential duplicate values into a Series of windows.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selects the value used to compare for duplicates. |

<a name="dataForge.Series+distinct"></a>

#### series.distinct(selector)
Group distinct values in the Series into a Series of windows.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selects the value used to compare for duplicates. |

<a name="dataForge.Series+variableWindow"></a>

#### series.variableWindow(comparer)
Groups sequential values into variable length 'windows'. The windows can then be transformed/transformed using selectPairs or selectManyPairs.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| comparer | <code>function</code> | Predicate that compares two values and returns true if they should be in the same window. |

<a name="dataForge.Series+insertPair"></a>

#### series.insertPair(pair)
Insert a pair at the start of a Series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pair | <code>pair</code> | The pair to insert. |

<a name="dataForge.Series+appendPair"></a>

#### series.appendPair(pair)
Append a pair to the end of a Series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pair | <code>pair</code> | The pair to append. |

<a name="dataForge.Series+fillGaps"></a>

#### series.fillGaps(predicate, generator)
Fill gaps in a series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicate that is passed pairA and pairB, two consecutive rows, return truthy if there is a gap between the rows, or falsey if there is no gap. |
| generator | <code>function</code> | Generator that is passed pairA and pairB, two consecutive rows, returns an array of pairs that fills the gap between the rows. |

<a name="dataForge.Series+groupBy"></a>

#### series.groupBy(selector)
Group the series according to the selector.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector that defines the value to group by. |

<a name="dataForge.Series+groupSequentialBy"></a>

#### series.groupSequentialBy(selector)
Group sequential duplicate values into a Series of windows.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector that defines the value to group by. |

<a name="dataForge.Series+at"></a>

#### series.at(index)
Get the value at a specified index.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>function</code> | Index to for which to retreive the value. |

<a name="dataForge.Series+contains"></a>

#### series.contains(value)
Returns true if the Series contains the specified value.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>function</code> | The value to check for in the Series. |

<a name="dataForge.Series+concat"></a>

#### series.concat(series)
Concatenate multiple other series onto this series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| series | <code>array</code> &#124; <code>Series</code> | Multiple arguments. Each can be either a series or an array of series. |

<a name="dataForge.Series+join"></a>

#### series.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)
Correlates the elements of two Series or DataFrames based on matching keys.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| resultSelector | <code>function</code> | Selector that defines how to merge outer and inner values. |

<a name="dataForge.Series+joinOuter"></a>

#### series.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)
Performs an outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes elements that have no correlation.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| outerResultSelector | <code>function</code> | Selector that defines how to extract the outer value before joining it with the inner value. |
| innerResultSelector | <code>function</code> | Selector that defines how to extract the inner value before joining it with the outer value. |
| mergeSelector | <code>function</code> | Selector that defines how to combine left and right. Implementation from here: 	http://blogs.geniuscode.net/RyanDHatch/?p=116 |

<a name="dataForge.Series+joinOuterLeft"></a>

#### series.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)
Performs a left outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes left elements that have no correlation.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| outerResultSelector | <code>function</code> | Selector that defines how to extract the outer value before joining it with the inner value. |
| innerResultSelector | <code>function</code> | Selector that defines how to extract the inner value before joining it with the outer value. |
| mergeSelector | <code>function</code> | Selector that defines how to combine left and right. Implementation from here: 	http://blogs.geniuscode.net/RyanDHatch/?p=116 |

<a name="dataForge.Series+joinOuterRight"></a>

#### series.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)
Performs a right outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes right elements that have no correlation.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| outerResultSelector | <code>function</code> | Selector that defines how to extract the outer value before joining it with the inner value. |
| innerResultSelector | <code>function</code> | Selector that defines how to extract the inner value before joining it with the outer value. |
| mergeSelector | <code>function</code> | Selector that defines how to combine left and right. Implementation from here: 	http://blogs.geniuscode.net/RyanDHatch/?p=116 |

<a name="dataForge.Series+defaultIfEmpty"></a>

#### series.defaultIfEmpty(defaultSequence)
Returns the specified default sequence if the Series or DataFrame is empty.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| defaultSequence | <code>array</code> &#124; <code>Series</code> &#124; <code>DataFrame</code> | Default sequence to return if the Series or DataFrame is empty. |

<a name="dataForge.Series+union"></a>

#### series.union(other, [comparer])
Returns the unique union of values between two Series or DataFrames.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+intersection"></a>

#### series.intersection(other, [comparer])
Returns the intersection of values between two Series or DataFrames.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+except"></a>

#### series.except(other, [comparer])
Returns the exception of values between two Series or DataFrames.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.concatDataFrames"></a>

### dataForge.concatDataFrames
Concatenate multiple dataframes into a single dataframe.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| dataFrames | <code>array</code> | Array of dataframes to concatenate. |

<a name="dataForge.concatSeries"></a>

### dataForge.concatSeries
Concatenate multiple series into a single series.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| series | <code>array</code> | Array of series to concatenate. |

<a name="dataForge.use"></a>

### dataForge.use()
Install a plugin in the dataForge namespace.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
<a name="dataForge.fromJSON"></a>

### dataForge.fromJSON(jsonTextString, [config])
Deserialize a DataFrame from a JSON text string.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| jsonTextString | <code>string</code> | The JSON text to deserialize. |
| [config] | <code>config</code> | Optional configuration option to pass to the DataFrame. |

<a name="dataForge.range"></a>

### dataForge.range(start, count)
Generate a series from a range of numbers.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>int</code> | The value of the first number in the range. |
| count | <code>int</code> | The number of sequential values in the range. |

<a name="dataForge.matrix"></a>

### dataForge.matrix(numColumns, numRows, start, increment)
Generate a data-frame containing a matrix of values.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numColumns | <code>int</code> | The number of columns in the data-frame. |
| numRows | <code>int</code> | The number of rows in the data-frame. |
| start | <code>number</code> | The starting value. |
| increment | <code>number</code> | The value to increment by for each new value. |

<a name="dataForge.zipSeries"></a>

### dataForge.zipSeries(series, selector)
Zip together multiple series to create a new series.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| series | <code>array</code> | Array of series to zip together. |
| selector | <code>function</code> | Selector function that produces a new series based on the input series. |

<a name="dataForge.zipDataFrames"></a>

### dataForge.zipDataFrames(dataFrames, selector)
Zip together multiple data-frames to create a new data-frame.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| dataFrames | <code>array</code> | Array of data-frames to zip together. |
| selector | <code>function</code> | Selector function that produces a new data-frame based on the input data-frames. |

