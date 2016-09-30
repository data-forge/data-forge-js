## Modules

<dl>
<dt><a href="#module_data-forge">data-forge</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#data-forge">data-forge</a> : <code>object</code></dt>
<dd><p>Main namespace for Data-Forge.</p>
<p>Nodejs:</p>
<pre><code>    npm install --save data-forge

    var dataForge = require(&#39;data-forge&#39;);
</code></pre><p>Browser:</p>
<pre><code>    bower install --save data-forge

    &lt;script language=&quot;javascript&quot; type=&quot;text/javascript&quot; src=&quot;bower_components/data-forge/data-forge.js&quot;&gt;&lt;/script&gt;
</code></pre></dd>
</dl>

<a name="module_data-forge"></a>

## data-forge
<a name="module_data-forge..data-forge"></a>

### data-forge~data-forge : <code>object</code>
Constructor for DataFrame.

**Kind**: inner namespace of <code>[data-forge](#module_data-forge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config|values | <code>object</code> &#124; <code>array</code> | Specifies content and configuration for the DataFrame. |

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
    * [.Series](#data-forge.Series)
        * [new Series(config|values)](#new_data-forge.Series_new)
        * [.getIterator()](#data-forge.Series+getIterator)
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

<a name="data-forge.Series"></a>

### data-forge.Series
**Kind**: static class of <code>[data-forge](#data-forge)</code>  

* [.Series](#data-forge.Series)
    * [new Series(config|values)](#new_data-forge.Series_new)
    * [.getIterator()](#data-forge.Series+getIterator)
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

#### series.getIterator()
Get an iterator for index & values of the series.

**Kind**: instance method of <code>[Series](#data-forge.Series)</code>  
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

