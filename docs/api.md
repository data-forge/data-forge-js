## Objects

<dl>
<dt><a href="#dataForge">dataForge</a> : <code>object</code></dt>
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
<dt><a href="#parseCSV">parseCSV([config])</a> ⇒ <code>Promise.&lt;DataFrame&gt;</code></dt>
<dd><p>Deserialize a CSV file to a DataFrame.
Returns a promise that later resolves to a DataFrame.</p>
</dd>
<dt><a href="#parseJSON">parseJSON([config])</a> ⇒ <code>Promise.&lt;DataFrame&gt;</code></dt>
<dd><p>Deserialize a JSON file to a DataFrame.
Returns a promise that later resolves to a DataFrame.</p>
</dd>
<dt><a href="#parseCSV">parseCSV([config])</a> ⇒ <code>DataFrame</code></dt>
<dd><p>Deserialize a CSV file to a DataFrame.</p>
</dd>
<dt><a href="#parseJSON">parseJSON([config])</a> ⇒ <code>DataFrame</code></dt>
<dd><p>Deserialize a JSON file to a DataFrame.</p>
</dd>
<dt><a href="#parseCSV">parseCSV([config])</a> ⇒ <code>Promise.&lt;DataFrame&gt;</code></dt>
<dd><p>Deserialize a CSV data to a DataFrame.</p>
</dd>
<dt><a href="#parseJSON">parseJSON([config])</a> ⇒ <code>Promise.&lt;DataFrame&gt;</code></dt>
<dd><p>Deserialize JSON data to a DataFrame.</p>
</dd>
<dt><a href="#writeFile">writeFile(filePath)</a> ⇒ <code>Promise</code></dt>
<dd><p>Serialize the dataframe to a CSV file in the local file system.
Asynchronous version.</p>
</dd>
<dt><a href="#writeFileSync">writeFileSync(filePath)</a></dt>
<dd><p>Serialize the dataframe to a CSV file in the local file system.
Synchronous version.</p>
</dd>
<dt><a href="#httpPost">httpPost(url)</a> ⇒ <code>Promise</code></dt>
<dd><p>Serialize the dataframe to CSV and HTTP POST it to the specified REST API.</p>
</dd>
<dt><a href="#writeFile">writeFile(filePath)</a> ⇒ <code>Promise</code></dt>
<dd><p>Serialize the dataframe to a JSON file in the local file system.
Asynchronous version.</p>
</dd>
<dt><a href="#writeFileSync">writeFileSync(filePath)</a></dt>
<dd><p>Serialize the dataframe to a JSON file in the local file system.
Synchronous version.</p>
</dd>
<dt><a href="#httpPost">httpPost(url)</a> ⇒ <code>Promise</code></dt>
<dd><p>Serialize the dataframe to JSON and HTTP POST it to the specified REST API.</p>
</dd>
</dl>

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
        * [.thenBy](#dataForge.Series+thenBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.thenByDescending](#dataForge.Series+thenByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.getColumnNames()](#dataForge.DataFrame+getColumnNames) ⇒ <code>array</code>
        * [.getColumnIndex(columnName)](#dataForge.DataFrame+getColumnIndex) ⇒ <code>int</code>
        * [.getColumnName(columnIndex)](#dataForge.DataFrame+getColumnName) ⇒ <code>string</code>
        * [.getSeries(columnName)](#dataForge.DataFrame+getSeries)
        * [.hasSeries(columnName)](#dataForge.DataFrame+hasSeries)
        * [.expectSeries(columnName)](#dataForge.DataFrame+expectSeries)
        * [.ensureSeries(columnNameOrSpec, seriesOrFn)](#dataForge.DataFrame+ensureSeries) ⇒ <code>DataFrame</code>
        * [.getColumns()](#dataForge.DataFrame+getColumns) ⇒ <code>array</code>
        * [.subset(columnNames)](#dataForge.DataFrame+subset) ⇒ <code>DataFrame</code>
        * [.dropSeries(columnOrColumns)](#dataForge.DataFrame+dropSeries) ⇒ <code>DataFrame</code>
        * [.withSeries(columnNameOrSpec, [seriesOrFn])](#dataForge.DataFrame+withSeries) ⇒ <code>DataFrame</code>
        * [.setIndex(columnName)](#dataForge.DataFrame+setIndex) ⇒ <code>DataFrame</code>
        * [.toString()](#dataForge.DataFrame+toString) ⇒ <code>string</code>
        * [.parseInts(columnNameOrNames)](#dataForge.DataFrame+parseInts) ⇒ <code>DataFrame</code>
        * [.parseFloats(columnNameOrNames)](#dataForge.DataFrame+parseFloats) ⇒ <code>DataFrame</code>
        * [.parseDates(columnNameOrNames, [formatString])](#dataForge.DataFrame+parseDates) ⇒ <code>DataFrame</code>
        * [.toStrings(columnNameOrNames, [formatString])](#dataForge.DataFrame+toStrings) ⇒ <code>DataFrame</code>
        * [.detectTypes()](#dataForge.DataFrame+detectTypes) ⇒ <code>DataFrame</code>
        * [.detectValues()](#dataForge.DataFrame+detectValues) ⇒ <code>DataFrame</code>
        * [.truncateStrings(maxLength)](#dataForge.DataFrame+truncateStrings) ⇒ <code>DataFrame</code>
        * [.reorderSeries(columnNames)](#dataForge.DataFrame+reorderSeries) ⇒ <code>DataFrame</code>
        * [.renameSeries(newColumnNames|columnsMap)](#dataForge.DataFrame+renameSeries) ⇒ <code>DataFrame</code>
        * [.toJSON()](#dataForge.DataFrame+toJSON) ⇒ <code>string</code>
        * [.toCSV()](#dataForge.DataFrame+toCSV) ⇒ <code>string</code>
        * [.asCSV()](#dataForge.DataFrame+asCSV) ⇒ <code>object</code>
        * [.asJSON()](#dataForge.DataFrame+asJSON) ⇒ <code>object</code>
        * [.toHTML()](#dataForge.DataFrame+toHTML) ⇒ <code>string</code>
        * [.transformSeries(columnSelectors)](#dataForge.DataFrame+transformSeries) ⇒ <code>DataFrame</code>
        * [.generateSeries(generator)](#dataForge.DataFrame+generateSeries) ⇒ <code>DataFrame</code>
        * [.deflate(selector)](#dataForge.DataFrame+deflate) ⇒ <code>Series</code>
        * [.inflateSeries(columnName, [selector])](#dataForge.DataFrame+inflateSeries) ⇒ <code>DataFrame</code>
        * [.aggregate([seed], selector)](#dataForge.DataFrame+aggregate) ⇒ <code>DataFrame</code>
        * [.bringToFront(columnOrColumns)](#dataForge.DataFrame+bringToFront) ⇒ <code>DataFrame</code>
        * [.bringToBack(columnOrColumns)](#dataForge.DataFrame+bringToBack) ⇒ <code>DataFrame</code>
        * [.pivot(column, value)](#dataForge.DataFrame+pivot) ⇒ <code>DataFrame</code>
        * [.concat(dataFrames)](#dataForge.DataFrame+concat) ⇒ <code>DataFrame</code>
        * [.toRows()](#dataForge.DataFrame+toRows) ⇒ <code>array</code>
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
        * [.selectMany(generator)](#dataForge.Series+selectMany) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.orderBy(sortSelector)](#dataForge.Series+orderBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.orderByDescending(sortSelector)](#dataForge.Series+orderByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.window(period)](#dataForge.Series+window) ⇒ <code>Series</code>
        * [.rollingWindow(period)](#dataForge.Series+rollingWindow) ⇒ <code>Series</code>
        * [.percentChange()](#dataForge.Series+percentChange) ⇒ <code>Series</code>
        * [.bake()](#dataForge.Series+bake) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.toPairs()](#dataForge.Series+toPairs) ⇒ <code>array</code>
        * [.count()](#dataForge.Series+count) ⇒ <code>array</code>
        * [.first()](#dataForge.Series+first) ⇒ <code>value</code>
        * [.last()](#dataForge.Series+last) ⇒ <code>value</code>
        * [.reverse()](#dataForge.Series+reverse) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.inflate([selector])](#dataForge.Series+inflate) ⇒ <code>DataFrame</code>
        * [.head(values)](#dataForge.Series+head) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.tail(values)](#dataForge.Series+tail) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.sum()](#dataForge.Series+sum) ⇒ <code>number</code>
        * [.average()](#dataForge.Series+average) ⇒ <code>number</code>
        * [.median()](#dataForge.Series+median) ⇒ <code>Number</code>
        * [.min()](#dataForge.Series+min) ⇒ <code>number</code>
        * [.max()](#dataForge.Series+max) ⇒ <code>number</code>
        * [.toObject(keySelector, keySelector)](#dataForge.Series+toObject) ⇒ <code>object</code>
        * [.zip(sequence, selector)](#dataForge.Series+zip) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.forEach(callback)](#dataForge.Series+forEach) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.all(predicate)](#dataForge.Series+all) ⇒ <code>boolean</code>
        * [.any([predicate])](#dataForge.Series+any) ⇒ <code>boolean</code>
        * [.none([predicate])](#dataForge.Series+none) ⇒ <code>boolean</code>
        * [.sequentialDistinct(selector)](#dataForge.Series+sequentialDistinct) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.distinct(selector)](#dataForge.Series+distinct) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.variableWindow(comparer)](#dataForge.Series+variableWindow) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.insertPair(pair)](#dataForge.Series+insertPair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.appendPair(pair)](#dataForge.Series+appendPair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.fillGaps(predicate, generator)](#dataForge.Series+fillGaps) ⇒ <code>Series</code>
        * [.groupBy(selector)](#dataForge.Series+groupBy) ⇒ <code>Series</code>
        * [.groupSequentialBy(selector)](#dataForge.Series+groupSequentialBy) ⇒ <code>Series</code>
        * [.at(index)](#dataForge.Series+at) ⇒ <code>value</code>
        * [.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)](#dataForge.Series+join) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuter) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterLeft) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterRight) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.defaultIfEmpty(defaultSequence)](#dataForge.Series+defaultIfEmpty) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.union(other, [comparer])](#dataForge.Series+union) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.intersection(other, [comparer])](#dataForge.Series+intersection) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.except(other, [comparer])](#dataForge.Series+except) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.asPairs()](#dataForge.Series+asPairs) ⇒ <code>Pairs</code>
        * [.startAt(indexValue)](#dataForge.Series+startAt) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.endAt(indexValue)](#dataForge.Series+endAt) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.before(indexValue)](#dataForge.Series+before) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.after(indexValue)](#dataForge.Series+after) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.between(startIndexValue, endIndexValue)](#dataForge.Series+between) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.Index](#dataForge.Index) ⇐ <code>[Series](#dataForge.Series)</code>
        * [new Index(config|values)](#new_dataForge.Index_new)
        * [.thenBy](#dataForge.Series+thenBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.thenByDescending](#dataForge.Series+thenByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.getType()](#dataForge.Index+getType) ⇒ <code>string</code>
        * [.getLessThan()](#dataForge.Index+getLessThan) ⇒ <code>function</code>
        * [.getGreaterThan()](#dataForge.Index+getGreaterThan) ⇒ <code>function</code>
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
        * [.selectMany(generator)](#dataForge.Series+selectMany) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.orderBy(sortSelector)](#dataForge.Series+orderBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.orderByDescending(sortSelector)](#dataForge.Series+orderByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.window(period)](#dataForge.Series+window) ⇒ <code>Series</code>
        * [.rollingWindow(period)](#dataForge.Series+rollingWindow) ⇒ <code>Series</code>
        * [.toString()](#dataForge.Series+toString) ⇒ <code>string</code>
        * [.percentChange()](#dataForge.Series+percentChange) ⇒ <code>Series</code>
        * [.parseInts()](#dataForge.Series+parseInts) ⇒ <code>Series</code>
        * [.parseFloats()](#dataForge.Series+parseFloats) ⇒ <code>Series</code>
        * [.parseDates([formatString])](#dataForge.Series+parseDates) ⇒ <code>Series</code>
        * [.toStrings([formatString])](#dataForge.Series+toStrings) ⇒ <code>Series</code>
        * [.detectTypes()](#dataForge.Series+detectTypes) ⇒ <code>DataFrame</code>
        * [.detectValues()](#dataForge.Series+detectValues) ⇒ <code>DataFrame</code>
        * [.truncateStrings(maxLength)](#dataForge.Series+truncateStrings) ⇒ <code>Series</code>
        * [.bake()](#dataForge.Series+bake) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.toPairs()](#dataForge.Series+toPairs) ⇒ <code>array</code>
        * [.count()](#dataForge.Series+count) ⇒ <code>array</code>
        * [.first()](#dataForge.Series+first) ⇒ <code>value</code>
        * [.last()](#dataForge.Series+last) ⇒ <code>value</code>
        * [.reverse()](#dataForge.Series+reverse) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.inflate([selector])](#dataForge.Series+inflate) ⇒ <code>DataFrame</code>
        * [.head(values)](#dataForge.Series+head) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.tail(values)](#dataForge.Series+tail) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.sum()](#dataForge.Series+sum) ⇒ <code>number</code>
        * [.average()](#dataForge.Series+average) ⇒ <code>number</code>
        * [.median()](#dataForge.Series+median) ⇒ <code>Number</code>
        * [.min()](#dataForge.Series+min) ⇒ <code>number</code>
        * [.max()](#dataForge.Series+max) ⇒ <code>number</code>
        * [.aggregate([seed], selector)](#dataForge.Series+aggregate) ⇒ <code>value</code>
        * [.toObject(keySelector, keySelector)](#dataForge.Series+toObject) ⇒ <code>object</code>
        * [.zip(sequence, selector)](#dataForge.Series+zip) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.forEach(callback)](#dataForge.Series+forEach) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.all(predicate)](#dataForge.Series+all) ⇒ <code>boolean</code>
        * [.any([predicate])](#dataForge.Series+any) ⇒ <code>boolean</code>
        * [.none([predicate])](#dataForge.Series+none) ⇒ <code>boolean</code>
        * [.sequentialDistinct(selector)](#dataForge.Series+sequentialDistinct) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.distinct(selector)](#dataForge.Series+distinct) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.variableWindow(comparer)](#dataForge.Series+variableWindow) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.insertPair(pair)](#dataForge.Series+insertPair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.appendPair(pair)](#dataForge.Series+appendPair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.fillGaps(predicate, generator)](#dataForge.Series+fillGaps) ⇒ <code>Series</code>
        * [.groupBy(selector)](#dataForge.Series+groupBy) ⇒ <code>Series</code>
        * [.groupSequentialBy(selector)](#dataForge.Series+groupSequentialBy) ⇒ <code>Series</code>
        * [.at(index)](#dataForge.Series+at) ⇒ <code>value</code>
        * [.concat(series)](#dataForge.Series+concat) ⇒ <code>Series</code>
        * [.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)](#dataForge.Series+join) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuter) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterLeft) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterRight) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.defaultIfEmpty(defaultSequence)](#dataForge.Series+defaultIfEmpty) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.union(other, [comparer])](#dataForge.Series+union) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.intersection(other, [comparer])](#dataForge.Series+intersection) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.except(other, [comparer])](#dataForge.Series+except) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.asPairs()](#dataForge.Series+asPairs) ⇒ <code>Pairs</code>
        * [.startAt(indexValue)](#dataForge.Series+startAt) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.endAt(indexValue)](#dataForge.Series+endAt) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.before(indexValue)](#dataForge.Series+before) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.after(indexValue)](#dataForge.Series+after) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.between(startIndexValue, endIndexValue)](#dataForge.Series+between) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.Series](#dataForge.Series)
        * [new Series(config|values)](#new_dataForge.Series_new)
        * [.thenBy](#dataForge.Series+thenBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.thenByDescending](#dataForge.Series+thenByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
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
        * [.selectMany(generator)](#dataForge.Series+selectMany) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.orderBy(sortSelector)](#dataForge.Series+orderBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.orderByDescending(sortSelector)](#dataForge.Series+orderByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.window(period)](#dataForge.Series+window) ⇒ <code>Series</code>
        * [.rollingWindow(period)](#dataForge.Series+rollingWindow) ⇒ <code>Series</code>
        * [.toString()](#dataForge.Series+toString) ⇒ <code>string</code>
        * [.percentChange()](#dataForge.Series+percentChange) ⇒ <code>Series</code>
        * [.parseInts()](#dataForge.Series+parseInts) ⇒ <code>Series</code>
        * [.parseFloats()](#dataForge.Series+parseFloats) ⇒ <code>Series</code>
        * [.parseDates([formatString])](#dataForge.Series+parseDates) ⇒ <code>Series</code>
        * [.toStrings([formatString])](#dataForge.Series+toStrings) ⇒ <code>Series</code>
        * [.detectTypes()](#dataForge.Series+detectTypes) ⇒ <code>DataFrame</code>
        * [.detectValues()](#dataForge.Series+detectValues) ⇒ <code>DataFrame</code>
        * [.truncateStrings(maxLength)](#dataForge.Series+truncateStrings) ⇒ <code>Series</code>
        * [.bake()](#dataForge.Series+bake) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.toPairs()](#dataForge.Series+toPairs) ⇒ <code>array</code>
        * [.count()](#dataForge.Series+count) ⇒ <code>array</code>
        * [.first()](#dataForge.Series+first) ⇒ <code>value</code>
        * [.last()](#dataForge.Series+last) ⇒ <code>value</code>
        * [.reverse()](#dataForge.Series+reverse) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.inflate([selector])](#dataForge.Series+inflate) ⇒ <code>DataFrame</code>
        * [.head(values)](#dataForge.Series+head) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.tail(values)](#dataForge.Series+tail) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.sum()](#dataForge.Series+sum) ⇒ <code>number</code>
        * [.average()](#dataForge.Series+average) ⇒ <code>number</code>
        * [.median()](#dataForge.Series+median) ⇒ <code>Number</code>
        * [.min()](#dataForge.Series+min) ⇒ <code>number</code>
        * [.max()](#dataForge.Series+max) ⇒ <code>number</code>
        * [.aggregate([seed], selector)](#dataForge.Series+aggregate) ⇒ <code>value</code>
        * [.toObject(keySelector, keySelector)](#dataForge.Series+toObject) ⇒ <code>object</code>
        * [.zip(sequence, selector)](#dataForge.Series+zip) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.forEach(callback)](#dataForge.Series+forEach) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.all(predicate)](#dataForge.Series+all) ⇒ <code>boolean</code>
        * [.any([predicate])](#dataForge.Series+any) ⇒ <code>boolean</code>
        * [.none([predicate])](#dataForge.Series+none) ⇒ <code>boolean</code>
        * [.sequentialDistinct(selector)](#dataForge.Series+sequentialDistinct) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.distinct(selector)](#dataForge.Series+distinct) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.variableWindow(comparer)](#dataForge.Series+variableWindow) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.insertPair(pair)](#dataForge.Series+insertPair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.appendPair(pair)](#dataForge.Series+appendPair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.fillGaps(predicate, generator)](#dataForge.Series+fillGaps) ⇒ <code>Series</code>
        * [.groupBy(selector)](#dataForge.Series+groupBy) ⇒ <code>Series</code>
        * [.groupSequentialBy(selector)](#dataForge.Series+groupSequentialBy) ⇒ <code>Series</code>
        * [.at(index)](#dataForge.Series+at) ⇒ <code>value</code>
        * [.concat(series)](#dataForge.Series+concat) ⇒ <code>Series</code>
        * [.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)](#dataForge.Series+join) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuter) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterLeft) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterRight) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.defaultIfEmpty(defaultSequence)](#dataForge.Series+defaultIfEmpty) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.union(other, [comparer])](#dataForge.Series+union) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.intersection(other, [comparer])](#dataForge.Series+intersection) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.except(other, [comparer])](#dataForge.Series+except) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.asPairs()](#dataForge.Series+asPairs) ⇒ <code>Pairs</code>
        * [.startAt(indexValue)](#dataForge.Series+startAt) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.endAt(indexValue)](#dataForge.Series+endAt) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.before(indexValue)](#dataForge.Series+before) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.after(indexValue)](#dataForge.Series+after) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
        * [.between(startIndexValue, endIndexValue)](#dataForge.Series+between) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.concatDataFrames](#dataForge.concatDataFrames) ⇒ <code>DataFrame</code>
    * [.concatSeries](#dataForge.concatSeries) ⇒ <code>Series</code>
    * [.use(plugin)](#dataForge.use) ⇒ <code>[dataForge](#dataForge)</code>
    * [.fromJSON(jsonTextString, [config])](#dataForge.fromJSON) ⇒ <code>DataFrame</code>
    * [.fromCSV(csvTextString, [config])](#dataForge.fromCSV) ⇒ <code>DataFrame</code>
    * [.readFile(filePath)](#dataForge.readFile) ⇒ <code>object</code>
    * [.readFileSync(filePath)](#dataForge.readFileSync) ⇒ <code>object</code>
    * [.httpGet(url)](#dataForge.httpGet) ⇒ <code>object</code>
    * [.range(start, count)](#dataForge.range) ⇒ <code>Series</code>
    * [.matrix(numColumns, numRows, start, increment)](#dataForge.matrix) ⇒ <code>DataFrame</code>
    * [.zipSeries(series, selector)](#dataForge.zipSeries) ⇒ <code>Series</code>
    * [.zipDataFrames(dataFrames, selector)](#dataForge.zipDataFrames) ⇒ <code>DataFrame</code>

<a name="dataForge.DataFrame"></a>

### dataForge.DataFrame ⇐ <code>[Series](#dataForge.Series)</code>
**Kind**: static class of <code>[dataForge](#dataForge)</code>  
**Extends:** <code>[Series](#dataForge.Series)</code>  

* [.DataFrame](#dataForge.DataFrame) ⇐ <code>[Series](#dataForge.Series)</code>
    * [new DataFrame(config|values)](#new_dataForge.DataFrame_new)
    * [.thenBy](#dataForge.Series+thenBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.thenByDescending](#dataForge.Series+thenByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.getColumnNames()](#dataForge.DataFrame+getColumnNames) ⇒ <code>array</code>
    * [.getColumnIndex(columnName)](#dataForge.DataFrame+getColumnIndex) ⇒ <code>int</code>
    * [.getColumnName(columnIndex)](#dataForge.DataFrame+getColumnName) ⇒ <code>string</code>
    * [.getSeries(columnName)](#dataForge.DataFrame+getSeries)
    * [.hasSeries(columnName)](#dataForge.DataFrame+hasSeries)
    * [.expectSeries(columnName)](#dataForge.DataFrame+expectSeries)
    * [.ensureSeries(columnNameOrSpec, seriesOrFn)](#dataForge.DataFrame+ensureSeries) ⇒ <code>DataFrame</code>
    * [.getColumns()](#dataForge.DataFrame+getColumns) ⇒ <code>array</code>
    * [.subset(columnNames)](#dataForge.DataFrame+subset) ⇒ <code>DataFrame</code>
    * [.dropSeries(columnOrColumns)](#dataForge.DataFrame+dropSeries) ⇒ <code>DataFrame</code>
    * [.withSeries(columnNameOrSpec, [seriesOrFn])](#dataForge.DataFrame+withSeries) ⇒ <code>DataFrame</code>
    * [.setIndex(columnName)](#dataForge.DataFrame+setIndex) ⇒ <code>DataFrame</code>
    * [.toString()](#dataForge.DataFrame+toString) ⇒ <code>string</code>
    * [.parseInts(columnNameOrNames)](#dataForge.DataFrame+parseInts) ⇒ <code>DataFrame</code>
    * [.parseFloats(columnNameOrNames)](#dataForge.DataFrame+parseFloats) ⇒ <code>DataFrame</code>
    * [.parseDates(columnNameOrNames, [formatString])](#dataForge.DataFrame+parseDates) ⇒ <code>DataFrame</code>
    * [.toStrings(columnNameOrNames, [formatString])](#dataForge.DataFrame+toStrings) ⇒ <code>DataFrame</code>
    * [.detectTypes()](#dataForge.DataFrame+detectTypes) ⇒ <code>DataFrame</code>
    * [.detectValues()](#dataForge.DataFrame+detectValues) ⇒ <code>DataFrame</code>
    * [.truncateStrings(maxLength)](#dataForge.DataFrame+truncateStrings) ⇒ <code>DataFrame</code>
    * [.reorderSeries(columnNames)](#dataForge.DataFrame+reorderSeries) ⇒ <code>DataFrame</code>
    * [.renameSeries(newColumnNames|columnsMap)](#dataForge.DataFrame+renameSeries) ⇒ <code>DataFrame</code>
    * [.toJSON()](#dataForge.DataFrame+toJSON) ⇒ <code>string</code>
    * [.toCSV()](#dataForge.DataFrame+toCSV) ⇒ <code>string</code>
    * [.asCSV()](#dataForge.DataFrame+asCSV) ⇒ <code>object</code>
    * [.asJSON()](#dataForge.DataFrame+asJSON) ⇒ <code>object</code>
    * [.toHTML()](#dataForge.DataFrame+toHTML) ⇒ <code>string</code>
    * [.transformSeries(columnSelectors)](#dataForge.DataFrame+transformSeries) ⇒ <code>DataFrame</code>
    * [.generateSeries(generator)](#dataForge.DataFrame+generateSeries) ⇒ <code>DataFrame</code>
    * [.deflate(selector)](#dataForge.DataFrame+deflate) ⇒ <code>Series</code>
    * [.inflateSeries(columnName, [selector])](#dataForge.DataFrame+inflateSeries) ⇒ <code>DataFrame</code>
    * [.aggregate([seed], selector)](#dataForge.DataFrame+aggregate) ⇒ <code>DataFrame</code>
    * [.bringToFront(columnOrColumns)](#dataForge.DataFrame+bringToFront) ⇒ <code>DataFrame</code>
    * [.bringToBack(columnOrColumns)](#dataForge.DataFrame+bringToBack) ⇒ <code>DataFrame</code>
    * [.pivot(column, value)](#dataForge.DataFrame+pivot) ⇒ <code>DataFrame</code>
    * [.concat(dataFrames)](#dataForge.DataFrame+concat) ⇒ <code>DataFrame</code>
    * [.toRows()](#dataForge.DataFrame+toRows) ⇒ <code>array</code>
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
    * [.selectMany(generator)](#dataForge.Series+selectMany) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.orderBy(sortSelector)](#dataForge.Series+orderBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.orderByDescending(sortSelector)](#dataForge.Series+orderByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.window(period)](#dataForge.Series+window) ⇒ <code>Series</code>
    * [.rollingWindow(period)](#dataForge.Series+rollingWindow) ⇒ <code>Series</code>
    * [.percentChange()](#dataForge.Series+percentChange) ⇒ <code>Series</code>
    * [.bake()](#dataForge.Series+bake) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.toPairs()](#dataForge.Series+toPairs) ⇒ <code>array</code>
    * [.count()](#dataForge.Series+count) ⇒ <code>array</code>
    * [.first()](#dataForge.Series+first) ⇒ <code>value</code>
    * [.last()](#dataForge.Series+last) ⇒ <code>value</code>
    * [.reverse()](#dataForge.Series+reverse) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.inflate([selector])](#dataForge.Series+inflate) ⇒ <code>DataFrame</code>
    * [.head(values)](#dataForge.Series+head) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.tail(values)](#dataForge.Series+tail) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.sum()](#dataForge.Series+sum) ⇒ <code>number</code>
    * [.average()](#dataForge.Series+average) ⇒ <code>number</code>
    * [.median()](#dataForge.Series+median) ⇒ <code>Number</code>
    * [.min()](#dataForge.Series+min) ⇒ <code>number</code>
    * [.max()](#dataForge.Series+max) ⇒ <code>number</code>
    * [.toObject(keySelector, keySelector)](#dataForge.Series+toObject) ⇒ <code>object</code>
    * [.zip(sequence, selector)](#dataForge.Series+zip) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.forEach(callback)](#dataForge.Series+forEach) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.all(predicate)](#dataForge.Series+all) ⇒ <code>boolean</code>
    * [.any([predicate])](#dataForge.Series+any) ⇒ <code>boolean</code>
    * [.none([predicate])](#dataForge.Series+none) ⇒ <code>boolean</code>
    * [.sequentialDistinct(selector)](#dataForge.Series+sequentialDistinct) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.distinct(selector)](#dataForge.Series+distinct) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.variableWindow(comparer)](#dataForge.Series+variableWindow) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.insertPair(pair)](#dataForge.Series+insertPair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.appendPair(pair)](#dataForge.Series+appendPair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.fillGaps(predicate, generator)](#dataForge.Series+fillGaps) ⇒ <code>Series</code>
    * [.groupBy(selector)](#dataForge.Series+groupBy) ⇒ <code>Series</code>
    * [.groupSequentialBy(selector)](#dataForge.Series+groupSequentialBy) ⇒ <code>Series</code>
    * [.at(index)](#dataForge.Series+at) ⇒ <code>value</code>
    * [.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)](#dataForge.Series+join) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuter) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterLeft) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterRight) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.defaultIfEmpty(defaultSequence)](#dataForge.Series+defaultIfEmpty) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.union(other, [comparer])](#dataForge.Series+union) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.intersection(other, [comparer])](#dataForge.Series+intersection) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.except(other, [comparer])](#dataForge.Series+except) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.asPairs()](#dataForge.Series+asPairs) ⇒ <code>Pairs</code>
    * [.startAt(indexValue)](#dataForge.Series+startAt) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.endAt(indexValue)](#dataForge.Series+endAt) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.before(indexValue)](#dataForge.Series+before) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.after(indexValue)](#dataForge.Series+after) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.between(startIndexValue, endIndexValue)](#dataForge.Series+between) ⇒ <code>Series</code> &#124; <code>DataFrame</code>

<a name="new_dataForge.DataFrame_new"></a>

#### new DataFrame(config|values)
Constructor for DataFrame.


| Param | Type | Description |
| --- | --- | --- |
| config|values | <code>object</code> &#124; <code>array</code> | Specifies content and configuration for the DataFrame. |

<a name="dataForge.Series+thenBy"></a>

#### dataFrame.thenBy ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs additional sorting (ascending).

**Kind**: instance property of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+thenByDescending"></a>

#### dataFrame.thenByDescending ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs additional sorting (descending).

**Kind**: instance property of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.DataFrame+getColumnNames"></a>

#### dataFrame.getColumnNames() ⇒ <code>array</code>
Get the names of the columns in the data frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>array</code> - Returns an array of the column names in the dataframe.  
<a name="dataForge.DataFrame+getColumnIndex"></a>

#### dataFrame.getColumnIndex(columnName) ⇒ <code>int</code>
Gets a column index from a column name.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>int</code> - Returns the index of the named column or -1 if the requested column was not found.  

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

<a name="dataForge.DataFrame+ensureSeries"></a>

#### dataFrame.ensureSeries(columnNameOrSpec, seriesOrFn) ⇒ <code>DataFrame</code>
Add a series if it doesn't already exist.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with the specified series added, if the series didn't already exist. Otherwise if the requested series already exists the same dataframe is returned.  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrSpec | <code>string</code> &#124; <code>object</code> | The name of the series to add or a column spec that defines the new column. |
| seriesOrFn | <code>function</code> | The series to add or a function that returns the series. |

<a name="dataForge.DataFrame+getColumns"></a>

#### dataFrame.getColumns() ⇒ <code>array</code>
Retreive a collection of all columns.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>array</code> - Returns an array of the columns in the dataframe.  
<a name="dataForge.DataFrame+subset"></a>

#### dataFrame.subset(columnNames) ⇒ <code>DataFrame</code>
Create a new data-frame from a subset of columns.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a dataframe with a subset of columns from the input dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| columnNames | <code>array</code> | Array of column names to include in the new data-frame. |

<a name="dataForge.DataFrame+dropSeries"></a>

#### dataFrame.dropSeries(columnOrColumns) ⇒ <code>DataFrame</code>
Create a new data frame with the requested column or columns dropped.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with a particular name column or columns removed.  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column name (a string) or columns (array of column names) to drop. |

<a name="dataForge.DataFrame+withSeries"></a>

#### dataFrame.withSeries(columnNameOrSpec, [seriesOrFn]) ⇒ <code>DataFrame</code>
Create a new data frame with an additional column specified by the passed-in series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe replacing or adding a particular named column.  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrSpec | <code>string</code> &#124; <code>object</code> | The name of the column to add or replace. |
| [seriesOrFn] | <code>Series</code> &#124; <code>function</code> | When columnNameOrSpec is a string that identifies the column to add, this specifies the Series to add to the data-frame or a function that produces a series (given a dataframe). |

<a name="dataForge.DataFrame+setIndex"></a>

#### dataFrame.setIndex(columnName) ⇒ <code>DataFrame</code>
Set a named column as the index of the data-frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with the values of a particular named column as the index.  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name or index of the column to set as the index. |

<a name="dataForge.DataFrame+toString"></a>

#### dataFrame.toString() ⇒ <code>string</code>
Format the data frame for display as a string.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[toString](#dataForge.Series+toString)</code>  
**Returns**: <code>string</code> - Returns a string representation of the dataframe for logging.  
<a name="dataForge.DataFrame+parseInts"></a>

#### dataFrame.parseInts(columnNameOrNames) ⇒ <code>DataFrame</code>
Parse a column with string values to a column with int values.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[parseInts](#dataForge.Series+parseInts)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with a particular named column parsed as ints.  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrNames | <code>string</code> &#124; <code>array</code> | Specifies the column name or array of column names to parse. |

<a name="dataForge.DataFrame+parseFloats"></a>

#### dataFrame.parseFloats(columnNameOrNames) ⇒ <code>DataFrame</code>
Parse a column with string values to a column with float values.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[parseFloats](#dataForge.Series+parseFloats)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with a particular named column parsed as floats.  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrNames | <code>string</code> &#124; <code>array</code> | Specifies the column name or array of column names to parse. |

<a name="dataForge.DataFrame+parseDates"></a>

#### dataFrame.parseDates(columnNameOrNames, [formatString]) ⇒ <code>DataFrame</code>
Parse a column with string values to a column with date values.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[parseDates](#dataForge.Series+parseDates)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with a particular named column parsed as dates.  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrNames | <code>string</code> &#124; <code>array</code> | Specifies the column name or array of column names to parse. |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="dataForge.DataFrame+toStrings"></a>

#### dataFrame.toStrings(columnNameOrNames, [formatString]) ⇒ <code>DataFrame</code>
Convert a column of values of different types to a column of string values.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[toStrings](#dataForge.Series+toStrings)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with a particular named column convert to strings.  

| Param | Type | Description |
| --- | --- | --- |
| columnNameOrNames | <code>string</code> &#124; <code>array</code> | Specifies the column name or array of column names to convert to strings. |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="dataForge.DataFrame+detectTypes"></a>

#### dataFrame.detectTypes() ⇒ <code>DataFrame</code>
Detect the types of the values in the sequence.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[detectTypes](#dataForge.Series+detectTypes)</code>  
**Returns**: <code>DataFrame</code> - Returns a dataframe that describes the data types contained in the input series or dataframe.  
<a name="dataForge.DataFrame+detectValues"></a>

#### dataFrame.detectValues() ⇒ <code>DataFrame</code>
Detect values and their frequencies contained within columns in the data frame.Detect the frequency of values in the sequence.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[detectValues](#dataForge.Series+detectValues)</code>  
**Returns**: <code>DataFrame</code> - Returns a dataframe that describes the values contained in the input sequence.  
<a name="dataForge.DataFrame+truncateStrings"></a>

#### dataFrame.truncateStrings(maxLength) ⇒ <code>DataFrame</code>
Produces a new data frame with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[truncateStrings](#dataForge.Series+truncateStrings)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with all strings truncated to the specified maximum length.  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="dataForge.DataFrame+reorderSeries"></a>

#### dataFrame.reorderSeries(columnNames) ⇒ <code>DataFrame</code>
Create a new data frame with columns reordered.New column names create new columns (with undefined values), omitting existing column names causes those columns to be dropped.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with columns remapped according to the specified column layout.  

| Param | Type | Description |
| --- | --- | --- |
| columnNames | <code>array</code> | The new order for columns. |

<a name="dataForge.DataFrame+renameSeries"></a>

#### dataFrame.renameSeries(newColumnNames|columnsMap) ⇒ <code>DataFrame</code>
Create a new data-frame with renamed series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with columns renamed.  

| Param | Type | Description |
| --- | --- | --- |
| newColumnNames|columnsMap | <code>array</code> &#124; <code>object</code> | Array of strings, with an element for each existing column that specifies the new name of that column. Or, a hash that maps old column name to new column name. |

<a name="dataForge.DataFrame+toJSON"></a>

#### dataFrame.toJSON() ⇒ <code>string</code>
Serialize the data frame to JSON.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>string</code> - Returns a JSON format string representing the dataframe.  
<a name="dataForge.DataFrame+toCSV"></a>

#### dataFrame.toCSV() ⇒ <code>string</code>
Serialize the data frame to CSV.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>string</code> - Returns a CSV format string representing the dataframe.  
<a name="dataForge.DataFrame+asCSV"></a>

#### dataFrame.asCSV() ⇒ <code>object</code>
Treat the dataframe as CSV data for purposes of serialization.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>object</code> - Returns an object that represents the dataframe for serialization in the CSV format. Call `writeFile`, `writeFileSync` or `httpPost` to output the dataframe via different media.  
<a name="dataForge.DataFrame+asJSON"></a>

#### dataFrame.asJSON() ⇒ <code>object</code>
Treat the dataframe as JSON data for purposes of serialization.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>object</code> - Returns an object that represents the dataframe for serialization in the JSON format. Call `writeFile`, `writeFileSync` or `httpPost` to output the dataframe via different media.  
<a name="dataForge.DataFrame+toHTML"></a>

#### dataFrame.toHTML() ⇒ <code>string</code>
Serialize the data frame to HTML.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>string</code> - Returns a HTML format string representing the dataframe.  
<a name="dataForge.DataFrame+transformSeries"></a>

#### dataFrame.transformSeries(columnSelectors) ⇒ <code>DataFrame</code>
Transform one or more columns. This is equivalent to extracting a column, calling 'select' on it,then plugging it back in as the same column.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with 1 or more columns transformed.  

| Param | Type | Description |
| --- | --- | --- |
| columnSelectors | <code>object</code> | Object with field names for each column to be transformed. Each field you be a selector that transforms that column. |

<a name="dataForge.DataFrame+generateSeries"></a>

#### dataFrame.generateSeries(generator) ⇒ <code>DataFrame</code>
Generate new columns based on existing rows.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with 1 or more new columns.  

| Param | Type | Description |
| --- | --- | --- |
| generator | <code>function</code> &#124; <code>object</code> | Generator function that transforms each row to a new set of columns. |

<a name="dataForge.DataFrame+deflate"></a>

#### dataFrame.deflate(selector) ⇒ <code>Series</code>
Deflate a data-frame to a series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> - Returns a series that was created from the input dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each row to a new sequence of values. |

<a name="dataForge.DataFrame+inflateSeries"></a>

#### dataFrame.inflateSeries(columnName, [selector]) ⇒ <code>DataFrame</code>
Inflate a named series in the data-frame to 1 or more new series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with a column inflated to 1 or more new columns.  

| Param | Type | Description |
| --- | --- | --- |
| columnName | <code>string</code> | Name or index of the column to retreive. |
| [selector] | <code>function</code> | Optional selector function that transforms each value in the column to new columns. If not specified it is expected that each value in the column is an object whose fields define the new column names. |

<a name="dataForge.DataFrame+aggregate"></a>

#### dataFrame.aggregate([seed], selector) ⇒ <code>DataFrame</code>
Aggregate the rows of the data-frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[aggregate](#dataForge.Series+aggregate)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with a column inflated to 1 or more new columns.  

| Param | Type | Description |
| --- | --- | --- |
| [seed] | <code>object</code> | The seed value for producing the aggregation. |
| selector | <code>function</code> | Function that takes the seed and then each row in the data-frame and produces the aggregate value. |

<a name="dataForge.DataFrame+bringToFront"></a>

#### dataFrame.bringToFront(columnOrColumns) ⇒ <code>DataFrame</code>
Bring the name column to the front, making it the first column in the data-frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with 1 or more columns bought to the front of the column ordering.  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column or columns to bring to the front. |

<a name="dataForge.DataFrame+bringToBack"></a>

#### dataFrame.bringToBack(columnOrColumns) ⇒ <code>DataFrame</code>
Bring the name column to the back, making it the last column in the data-frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe with 1 or more columns bought to the back of the column ordering.  

| Param | Type | Description |
| --- | --- | --- |
| columnOrColumns | <code>string</code> &#124; <code>array</code> | Specifies the column or columns to bring to the back. |

<a name="dataForge.DataFrame+pivot"></a>

#### dataFrame.pivot(column, value) ⇒ <code>DataFrame</code>
Reshape (or pivot) a table based on column values.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe that has been pivoted based on a particular column's values.  

| Param | Type | Description |
| --- | --- | --- |
| column | <code>string</code> | Column name whose values make the new DataFrame's columns. |
| value | <code>string</code> | Column name whose values populate the new DataFrame's values. |

<a name="dataForge.DataFrame+concat"></a>

#### dataFrame.concat(dataFrames) ⇒ <code>DataFrame</code>
Concatenate multiple other dataframes onto this dataframe.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Overrides:** <code>[concat](#dataForge.Series+concat)</code>  
**Returns**: <code>DataFrame</code> - Returns a single dataframe concatenated from multiple input dataframes.  

| Param | Type | Description |
| --- | --- | --- |
| dataFrames | <code>array</code> &#124; <code>DataFrame</code> | Multiple arguments. Each can be either a dataframe or an array of dataframe. |

<a name="dataForge.DataFrame+toRows"></a>

#### dataFrame.toRows() ⇒ <code>array</code>
Bake the data frame to an array of rows.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>array</code> - Returns an array of rows. Each row is an array of values in column order.  
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
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the specified index attached.  

| Param | Type | Description |
| --- | --- | --- |
| newIndex | <code>array</code> &#124; <code>Series</code> | The new index to apply to the Series. |

<a name="dataForge.Series+resetIndex"></a>

#### dataFrame.resetIndex() ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Reset the index of the data frame back to the default sequential integer index.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the index reset to the default zero-based index.  
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

<a name="dataForge.Series+selectMany"></a>

#### dataFrame.selectMany(generator) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with values that have been produced by the generator function.  

| Param | Type | Description |
| --- | --- | --- |
| generator | <code>function</code> | Generator function that may generator 0 or more new values from value in the series or dataframe. |

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

<a name="dataForge.Series+window"></a>

#### dataFrame.window(period) ⇒ <code>Series</code>
Segment a Series into 'windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original series or dataframe.
Use select or selectPairs to aggregate.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> - Returns a new series, each value of which is a 'window' (or segment) of the original series or dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of values in the window. |

<a name="dataForge.Series+rollingWindow"></a>

#### dataFrame.rollingWindow(period) ⇒ <code>Series</code>
Segment a Series into 'rolling windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original Series.
Use select or selectPairs to aggregate.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> - Returns a new series, each value of which is a 'window' (or segment) of the original series or dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of values in the window. |

<a name="dataForge.Series+percentChange"></a>

#### dataFrame.percentChange() ⇒ <code>Series</code>
Compute the percent change for each row after the first.
Percentages are expressed as 0-1 values.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> - Returns a new series where each value indicates the percent change from the previous number value in the original series.  
<a name="dataForge.Series+bake"></a>

#### dataFrame.bake() ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Forces lazy evaluation to complete and 'bakes' the series into memory.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a series or dataframe that has been 'baked', all lazy evaluation has completed.  
<a name="dataForge.Series+toPairs"></a>

#### dataFrame.toPairs() ⇒ <code>array</code>
Retreive the data as pairs of [index, value].

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>array</code> - Returns an array of pairs for the content of the series or dataframe. Each pair is a two element array that contains an index and a value.  
<a name="dataForge.Series+count"></a>

#### dataFrame.count() ⇒ <code>array</code>
Count the number of rows in the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>array</code> - Returns the count of all values in the series or dataframes.  
<a name="dataForge.Series+first"></a>

#### dataFrame.first() ⇒ <code>value</code>
Get the first value of the series or dataframe.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>value</code> - Returns the first value of the series or dataframe.  
<a name="dataForge.Series+last"></a>

#### dataFrame.last() ⇒ <code>value</code>
Get the last value of the series or dataframe.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>value</code> - Returns the last value of the series or dataframe.  
<a name="dataForge.Series+reverse"></a>

#### dataFrame.reverse() ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Reverse the series or dataframe.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that is the reverse of the input.  
<a name="dataForge.Series+inflate"></a>

#### dataFrame.inflate([selector]) ⇒ <code>DataFrame</code>
Inflate a series to a data-frame.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe that has been created from the input series via the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| [selector] | <code>function</code> | Optional selector function that transforms each value in the series to a row in the new data-frame. |

<a name="dataForge.Series+head"></a>

#### dataFrame.head(values) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get X values from the start of the series or dataframe.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has only the specified number of values taken from the start of the input sequence.  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="dataForge.Series+tail"></a>

#### dataFrame.tail(values) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get X values from the end of the series or dataframe.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has only the specified number of values taken from the end of the input sequence.  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="dataForge.Series+sum"></a>

#### dataFrame.sum() ⇒ <code>number</code>
Sum the values in a series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>number</code> - Returns the sum of the number values in the series.  
<a name="dataForge.Series+average"></a>

#### dataFrame.average() ⇒ <code>number</code>
Average the values in a series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>number</code> - Returns the average of the number values in the series.  
<a name="dataForge.Series+median"></a>

#### dataFrame.median() ⇒ <code>Number</code>
Get the median value in the series. Not this sorts the series, so can be expensive.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Number</code> - Returns the median of the values in the series.  
<a name="dataForge.Series+min"></a>

#### dataFrame.min() ⇒ <code>number</code>
Get the min value in the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>number</code> - Returns the minimum of the number values in the series.  
<a name="dataForge.Series+max"></a>

#### dataFrame.max() ⇒ <code>number</code>
Get the max value in the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>number</code> - Returns the maximum of the number values in the series.  
<a name="dataForge.Series+toObject"></a>

#### dataFrame.toObject(keySelector, keySelector) ⇒ <code>object</code>
Convert the series to a JavaScript object.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>object</code> - Returns a JavaScript object generated from the input sequence by the key and value selector funtions.  

| Param | Type | Description |
| --- | --- | --- |
| keySelector | <code>function</code> | Function that selects keys for the resulting object. |
| keySelector | <code>valueSelector</code> | Function that selects values for the resulting object. |

<a name="dataForge.Series+zip"></a>

#### dataFrame.zip(sequence, selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Zip together multiple series or dataframes to produce a new series or dataframe.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a single series or dataframe that is the combination of multiple input sequences that have been 'zipped' together by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| sequence | <code>Series</code> &#124; <code>DataFrame</code> | Multiple parameters, one for each sequence to be zipped. |
| selector | <code>function</code> | Selector function that produces a new series or dataframe based on the inputs. |

<a name="dataForge.Series+forEach"></a>

#### dataFrame.forEach(callback) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Invoke a callback function for each value in the series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the input sequence with no modifications.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The calback to invoke for each value. |

<a name="dataForge.Series+all"></a>

#### dataFrame.all(predicate) ⇒ <code>boolean</code>
Determine if the predicate returns truthy for all values in the sequence.
Returns false as soon as the predicate evaluates to falsy.
Returns true if the predicate returns truthy for all values in the Series.
Returns false if the series is empty.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>boolean</code> - Returns true if the predicate has returned truthy for every value in the sequence, otherwise returns false.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+any"></a>

#### dataFrame.any([predicate]) ⇒ <code>boolean</code>
Determine if the predicate returns truthy for any of the values in the sequence.
Returns true as soon as the predicate returns truthy.
Returns false if the predicate never returns truthy.
If no predicate is specified the value itself is checked.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>boolean</code> - Returns true if the predicate has returned truthy for any value in the sequence, otherwise returns false.  

| Param | Type | Description |
| --- | --- | --- |
| [predicate] | <code>function</code> | Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+none"></a>

#### dataFrame.none([predicate]) ⇒ <code>boolean</code>
Determine if the predicate returns truthy for none of the values in the sequence.
Returns true for an empty Series.
Returns true if the predicate always returns falsy.
Otherwise returns false.
If no predicate is specified the value itself is checked.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>boolean</code> - Returns true if the predicate has returned truthy for no values in the sequence, otherwise returns false.  

| Param | Type | Description |
| --- | --- | --- |
| [predicate] | <code>function</code> | Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+sequentialDistinct"></a>

#### dataFrame.sequentialDistinct(selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Group sequential duplicate values into a Series of windows.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a series of groups. Each group is itself a series or dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selects the value used to compare for duplicates. |

<a name="dataForge.Series+distinct"></a>

#### dataFrame.distinct(selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Group distinct values in the Series into a Series of windows.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a series or dataframe containing only unique values as determined by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selects the value used to compare for duplicates. |

<a name="dataForge.Series+variableWindow"></a>

#### dataFrame.variableWindow(comparer) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Groups sequential values into variable length 'windows'. The windows can then be transformed/transformed using selectPairs or selectManyPairs.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a series of groups. Each group is itself a series or dataframe that contains the values in the 'window'.  

| Param | Type | Description |
| --- | --- | --- |
| comparer | <code>function</code> | Predicate that compares two values and returns true if they should be in the same window. |

<a name="dataForge.Series+insertPair"></a>

#### dataFrame.insertPair(pair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Insert a pair at the start of a Series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the specified pair inserted.  

| Param | Type | Description |
| --- | --- | --- |
| pair | <code>pair</code> | The pair to insert. |

<a name="dataForge.Series+appendPair"></a>

#### dataFrame.appendPair(pair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Append a pair to the end of a Series.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the specified pair appended.  

| Param | Type | Description |
| --- | --- | --- |
| pair | <code>pair</code> | The pair to append. |

<a name="dataForge.Series+fillGaps"></a>

#### dataFrame.fillGaps(predicate, generator) ⇒ <code>Series</code>
Fill gaps in a series or dataframe.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> - Returns a new series with gaps filled in.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicate that is passed pairA and pairB, two consecutive rows, return truthy if there is a gap between the rows, or falsey if there is no gap. |
| generator | <code>function</code> | Generator that is passed pairA and pairB, two consecutive rows, returns an array of pairs that fills the gap between the rows. |

<a name="dataForge.Series+groupBy"></a>

#### dataFrame.groupBy(selector) ⇒ <code>Series</code>
Group the series according to the selector.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> - Returns a series of groups. Each group is a series with values that have been grouped by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector that defines the value to group by. |

<a name="dataForge.Series+groupSequentialBy"></a>

#### dataFrame.groupSequentialBy(selector) ⇒ <code>Series</code>
Group sequential values into a Series of windows.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> - Returns a series of groups. Each group is a series with values that have been grouped by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector that defines the value to group by. |

<a name="dataForge.Series+at"></a>

#### dataFrame.at(index) ⇒ <code>value</code>
Get the value at a specified index.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>value</code> - Returns the value from the specified index in the sequence.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>function</code> | Index to for which to retreive the value. |

<a name="dataForge.Series+join"></a>

#### dataFrame.join(self, inner, outerKeySelector, innerKeySelector, resultSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Correlates the elements of two Series or DataFrames based on matching keys.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the joined series or dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| resultSelector | <code>function</code> | Selector that defines how to merge outer and inner values. |

<a name="dataForge.Series+joinOuter"></a>

#### dataFrame.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs an outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes elements that have no correlation.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the joined series or dataframe.  

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

#### dataFrame.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs a left outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes left elements that have no correlation.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the joined series or dataframe.  

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

#### dataFrame.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs a right outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes right elements that have no correlation.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the joined series or dataframe.  

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

#### dataFrame.defaultIfEmpty(defaultSequence) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Returns the specified default sequence if the Series or DataFrame is empty.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns 'defaultSequence' if the input sequence is empty.  

| Param | Type | Description |
| --- | --- | --- |
| defaultSequence | <code>array</code> &#124; <code>Series</code> &#124; <code>DataFrame</code> | Default sequence to return if the Series or DataFrame is empty. |

<a name="dataForge.Series+union"></a>

#### dataFrame.union(other, [comparer]) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Returns the unique union of values between two Series or DataFrames.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the union of two sequences.  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+intersection"></a>

#### dataFrame.intersection(other, [comparer]) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Returns the intersection of values between two Series or DataFrames.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the intersection of two sequences.  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+except"></a>

#### dataFrame.except(other, [comparer]) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Returns the exception of values between two Series or DataFrames.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the difference of one sequence to another.  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+asPairs"></a>

#### dataFrame.asPairs() ⇒ <code>Pairs</code>
Convert a series or a dataframe to a series of pairs in the form [pair1, pair2, pair3, ...] where each pair is [index, value].

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Pairs</code> - Returns a series of pairs for each index and value pair in the input sequence.  
<a name="dataForge.Series+startAt"></a>

#### dataFrame.startAt(indexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe starting at the specified index value.

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all values after the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| indexValue | <code>value</code> | The value to search for before starting the new Series or DataFrame. |

<a name="dataForge.Series+endAt"></a>

#### dataFrame.endAt(indexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe ending at the specified index value (inclusive).

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with values up to and including the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| indexValue | <code>value</code> | The value to search for before ending the new Series or DataFrame. |

<a name="dataForge.Series+before"></a>

#### dataFrame.before(indexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe with all values before the specified index value (exclusive).

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all values before the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| indexValue | <code>value</code> | The value to search for while taking values. |

<a name="dataForge.Series+after"></a>

#### dataFrame.after(indexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe with all values after the specified index value (exclusive).

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all values before the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| indexValue | <code>value</code> | The value to search for while taking values. |

<a name="dataForge.Series+between"></a>

#### dataFrame.between(startIndexValue, endIndexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe with all values between the specified index values (inclusive).

**Kind**: instance method of <code>[DataFrame](#dataForge.DataFrame)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all values before the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| startIndexValue | <code>value</code> | The index where the new sequence starts. |
| endIndexValue | <code>value</code> | The index where the new sequence ends. |

<a name="dataForge.Index"></a>

### dataForge.Index ⇐ <code>[Series](#dataForge.Series)</code>
**Kind**: static class of <code>[dataForge](#dataForge)</code>  
**Extends:** <code>[Series](#dataForge.Series)</code>  

* [.Index](#dataForge.Index) ⇐ <code>[Series](#dataForge.Series)</code>
    * [new Index(config|values)](#new_dataForge.Index_new)
    * [.thenBy](#dataForge.Series+thenBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.thenByDescending](#dataForge.Series+thenByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.getType()](#dataForge.Index+getType) ⇒ <code>string</code>
    * [.getLessThan()](#dataForge.Index+getLessThan) ⇒ <code>function</code>
    * [.getGreaterThan()](#dataForge.Index+getGreaterThan) ⇒ <code>function</code>
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
    * [.selectMany(generator)](#dataForge.Series+selectMany) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.orderBy(sortSelector)](#dataForge.Series+orderBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.orderByDescending(sortSelector)](#dataForge.Series+orderByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.window(period)](#dataForge.Series+window) ⇒ <code>Series</code>
    * [.rollingWindow(period)](#dataForge.Series+rollingWindow) ⇒ <code>Series</code>
    * [.toString()](#dataForge.Series+toString) ⇒ <code>string</code>
    * [.percentChange()](#dataForge.Series+percentChange) ⇒ <code>Series</code>
    * [.parseInts()](#dataForge.Series+parseInts) ⇒ <code>Series</code>
    * [.parseFloats()](#dataForge.Series+parseFloats) ⇒ <code>Series</code>
    * [.parseDates([formatString])](#dataForge.Series+parseDates) ⇒ <code>Series</code>
    * [.toStrings([formatString])](#dataForge.Series+toStrings) ⇒ <code>Series</code>
    * [.detectTypes()](#dataForge.Series+detectTypes) ⇒ <code>DataFrame</code>
    * [.detectValues()](#dataForge.Series+detectValues) ⇒ <code>DataFrame</code>
    * [.truncateStrings(maxLength)](#dataForge.Series+truncateStrings) ⇒ <code>Series</code>
    * [.bake()](#dataForge.Series+bake) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.toPairs()](#dataForge.Series+toPairs) ⇒ <code>array</code>
    * [.count()](#dataForge.Series+count) ⇒ <code>array</code>
    * [.first()](#dataForge.Series+first) ⇒ <code>value</code>
    * [.last()](#dataForge.Series+last) ⇒ <code>value</code>
    * [.reverse()](#dataForge.Series+reverse) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.inflate([selector])](#dataForge.Series+inflate) ⇒ <code>DataFrame</code>
    * [.head(values)](#dataForge.Series+head) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.tail(values)](#dataForge.Series+tail) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.sum()](#dataForge.Series+sum) ⇒ <code>number</code>
    * [.average()](#dataForge.Series+average) ⇒ <code>number</code>
    * [.median()](#dataForge.Series+median) ⇒ <code>Number</code>
    * [.min()](#dataForge.Series+min) ⇒ <code>number</code>
    * [.max()](#dataForge.Series+max) ⇒ <code>number</code>
    * [.aggregate([seed], selector)](#dataForge.Series+aggregate) ⇒ <code>value</code>
    * [.toObject(keySelector, keySelector)](#dataForge.Series+toObject) ⇒ <code>object</code>
    * [.zip(sequence, selector)](#dataForge.Series+zip) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.forEach(callback)](#dataForge.Series+forEach) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.all(predicate)](#dataForge.Series+all) ⇒ <code>boolean</code>
    * [.any([predicate])](#dataForge.Series+any) ⇒ <code>boolean</code>
    * [.none([predicate])](#dataForge.Series+none) ⇒ <code>boolean</code>
    * [.sequentialDistinct(selector)](#dataForge.Series+sequentialDistinct) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.distinct(selector)](#dataForge.Series+distinct) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.variableWindow(comparer)](#dataForge.Series+variableWindow) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.insertPair(pair)](#dataForge.Series+insertPair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.appendPair(pair)](#dataForge.Series+appendPair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.fillGaps(predicate, generator)](#dataForge.Series+fillGaps) ⇒ <code>Series</code>
    * [.groupBy(selector)](#dataForge.Series+groupBy) ⇒ <code>Series</code>
    * [.groupSequentialBy(selector)](#dataForge.Series+groupSequentialBy) ⇒ <code>Series</code>
    * [.at(index)](#dataForge.Series+at) ⇒ <code>value</code>
    * [.concat(series)](#dataForge.Series+concat) ⇒ <code>Series</code>
    * [.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)](#dataForge.Series+join) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuter) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterLeft) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterRight) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.defaultIfEmpty(defaultSequence)](#dataForge.Series+defaultIfEmpty) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.union(other, [comparer])](#dataForge.Series+union) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.intersection(other, [comparer])](#dataForge.Series+intersection) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.except(other, [comparer])](#dataForge.Series+except) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.asPairs()](#dataForge.Series+asPairs) ⇒ <code>Pairs</code>
    * [.startAt(indexValue)](#dataForge.Series+startAt) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.endAt(indexValue)](#dataForge.Series+endAt) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.before(indexValue)](#dataForge.Series+before) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.after(indexValue)](#dataForge.Series+after) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.between(startIndexValue, endIndexValue)](#dataForge.Series+between) ⇒ <code>Series</code> &#124; <code>DataFrame</code>

<a name="new_dataForge.Index_new"></a>

#### new Index(config|values)
Constructor for Index.


| Param | Type | Description |
| --- | --- | --- |
| config|values | <code>object</code> &#124; <code>array</code> | Specifies content and configuration for the Index. |

<a name="dataForge.Series+thenBy"></a>

#### index.thenBy ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs additional sorting (ascending).

**Kind**: instance property of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+thenByDescending"></a>

#### index.thenByDescending ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs additional sorting (descending).

**Kind**: instance property of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Index+getType"></a>

#### index.getType() ⇒ <code>string</code>
Get the type of the index.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>string</code> - Returns a string that specifies the type of the index.  
<a name="dataForge.Index+getLessThan"></a>

#### index.getLessThan() ⇒ <code>function</code>
Get the less than operation for the index.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>function</code> - Returns a function that can be used to compare a value against an index value.  
<a name="dataForge.Index+getGreaterThan"></a>

#### index.getGreaterThan() ⇒ <code>function</code>
Get the greater than operation for the index.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>function</code> - Returns a function that can be used to compare a value against an index value.  
<a name="dataForge.Series+getIterator"></a>

#### index.getIterator() ⇒ <code>iterator</code>
Get an iterator for index & values of the series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>iterator</code> - Returns an iterator that can be used to enumerate and lazily evalute the contents of the series or dataframe.  
<a name="dataForge.Series+getIndex"></a>

#### index.getIndex() ⇒ <code>Series</code>
Retreive the index of the series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a new series that contains the values of the index for this series.  
<a name="dataForge.Series+withIndex"></a>

#### index.withIndex(newIndex) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Apply a new index to the Series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the specified index attached.  

| Param | Type | Description |
| --- | --- | --- |
| newIndex | <code>array</code> &#124; <code>Series</code> | The new index to apply to the Series. |

<a name="dataForge.Series+resetIndex"></a>

#### index.resetIndex() ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Reset the index of the data frame back to the default sequential integer index.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the index reset to the default zero-based index.  
<a name="dataForge.Series+skip"></a>

#### index.skip(numRows) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Skip a number of rows in the series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the specified number of values skipped.  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to skip. |

<a name="dataForge.Series+skipWhile"></a>

#### index.skipWhile(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Skips values in the series while a condition is met.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all initial sequential values removed that match the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="dataForge.Series+skipUntil"></a>

#### index.skipUntil(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Skips values in the series until a condition is met.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all initial sequential values removed that don't match the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="dataForge.Series+take"></a>

#### index.take(numRows) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Take a number of rows in the series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with up to the specified number of values included.  

| Param | Type | Description |
| --- | --- | --- |
| numRows | <code>int</code> | Number of rows to take. |

<a name="dataForge.Series+takeWhile"></a>

#### index.takeWhile(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Take values from the series while a condition is met.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that only includes the initial sequential values that have matched the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="dataForge.Series+takeUntil"></a>

#### index.takeUntil(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Take values from the series until a condition is met.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that only includes the initial sequential values that have not matched the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Return true to indicate the condition met. |

<a name="dataForge.Series+where"></a>

#### index.where(predicate) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Filter a series by a predicate selector.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe containing only the values that match the predicate.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicte function to filter rows of the series. |

<a name="dataForge.Series+select"></a>

#### index.select(selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been transformed by the selector function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector function that transforms each value to create a new series or dataframe. |

<a name="dataForge.Series+selectMany"></a>

#### index.selectMany(generator) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with values that have been produced by the generator function.  

| Param | Type | Description |
| --- | --- | --- |
| generator | <code>function</code> | Generator function that may generator 0 or more new values from value in the series or dataframe. |

<a name="dataForge.Series+orderBy"></a>

#### index.orderBy(sortSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Sorts the series or dataframe (ascending).

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+orderByDescending"></a>

#### index.orderByDescending(sortSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Sorts the series or dataframe (descending).

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+window"></a>

#### index.window(period) ⇒ <code>Series</code>
Segment a Series into 'windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original series or dataframe.
Use select or selectPairs to aggregate.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a new series, each value of which is a 'window' (or segment) of the original series or dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of values in the window. |

<a name="dataForge.Series+rollingWindow"></a>

#### index.rollingWindow(period) ⇒ <code>Series</code>
Segment a Series into 'rolling windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original Series.
Use select or selectPairs to aggregate.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a new series, each value of which is a 'window' (or segment) of the original series or dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of values in the window. |

<a name="dataForge.Series+toString"></a>

#### index.toString() ⇒ <code>string</code>
Format the data frame for display as a string.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>string</code> - Generates and returns a string representation of the series or dataframe.  
<a name="dataForge.Series+percentChange"></a>

#### index.percentChange() ⇒ <code>Series</code>
Compute the percent change for each row after the first.
Percentages are expressed as 0-1 values.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a new series where each value indicates the percent change from the previous number value in the original series.  
<a name="dataForge.Series+parseInts"></a>

#### index.parseInts() ⇒ <code>Series</code>
Parse a series with string values to a series with int values.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a new series where string values from the original series have been parsed to integer values.  
<a name="dataForge.Series+parseFloats"></a>

#### index.parseFloats() ⇒ <code>Series</code>
Parse a series with string values to a series with float values.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a new series where string values from the original series have been parsed to floating-point values.  
<a name="dataForge.Series+parseDates"></a>

#### index.parseDates([formatString]) ⇒ <code>Series</code>
Parse a series with string values to a series with date values.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a new series where string values from the original series have been parsed to Date values.  

| Param | Type | Description |
| --- | --- | --- |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="dataForge.Series+toStrings"></a>

#### index.toStrings([formatString]) ⇒ <code>Series</code>
Convert a series of values of different types to a series of string values.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a new series where the values from the original series have been stringified.  

| Param | Type | Description |
| --- | --- | --- |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="dataForge.Series+detectTypes"></a>

#### index.detectTypes() ⇒ <code>DataFrame</code>
Detect the types of the values in the sequence.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>DataFrame</code> - Returns a dataframe that describes the data types contained in the input series or dataframe.  
<a name="dataForge.Series+detectValues"></a>

#### index.detectValues() ⇒ <code>DataFrame</code>
Detect the frequency of values in the sequence.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>DataFrame</code> - Returns a dataframe that describes the values contained in the input sequence.  
<a name="dataForge.Series+truncateStrings"></a>

#### index.truncateStrings(maxLength) ⇒ <code>Series</code>
Produces a new series with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a new series with strings that are truncated to the specified maximum length.  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="dataForge.Series+bake"></a>

#### index.bake() ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Forces lazy evaluation to complete and 'bakes' the series into memory.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a series or dataframe that has been 'baked', all lazy evaluation has completed.  
<a name="dataForge.Series+toPairs"></a>

#### index.toPairs() ⇒ <code>array</code>
Retreive the data as pairs of [index, value].

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>array</code> - Returns an array of pairs for the content of the series or dataframe. Each pair is a two element array that contains an index and a value.  
<a name="dataForge.Series+count"></a>

#### index.count() ⇒ <code>array</code>
Count the number of rows in the series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>array</code> - Returns the count of all values in the series or dataframes.  
<a name="dataForge.Series+first"></a>

#### index.first() ⇒ <code>value</code>
Get the first value of the series or dataframe.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>value</code> - Returns the first value of the series or dataframe.  
<a name="dataForge.Series+last"></a>

#### index.last() ⇒ <code>value</code>
Get the last value of the series or dataframe.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>value</code> - Returns the last value of the series or dataframe.  
<a name="dataForge.Series+reverse"></a>

#### index.reverse() ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Reverse the series or dataframe.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that is the reverse of the input.  
<a name="dataForge.Series+inflate"></a>

#### index.inflate([selector]) ⇒ <code>DataFrame</code>
Inflate a series to a data-frame.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe that has been created from the input series via the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| [selector] | <code>function</code> | Optional selector function that transforms each value in the series to a row in the new data-frame. |

<a name="dataForge.Series+head"></a>

#### index.head(values) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get X values from the start of the series or dataframe.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has only the specified number of values taken from the start of the input sequence.  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="dataForge.Series+tail"></a>

#### index.tail(values) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get X values from the end of the series or dataframe.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has only the specified number of values taken from the end of the input sequence.  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="dataForge.Series+sum"></a>

#### index.sum() ⇒ <code>number</code>
Sum the values in a series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>number</code> - Returns the sum of the number values in the series.  
<a name="dataForge.Series+average"></a>

#### index.average() ⇒ <code>number</code>
Average the values in a series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>number</code> - Returns the average of the number values in the series.  
<a name="dataForge.Series+median"></a>

#### index.median() ⇒ <code>Number</code>
Get the median value in the series. Not this sorts the series, so can be expensive.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Number</code> - Returns the median of the values in the series.  
<a name="dataForge.Series+min"></a>

#### index.min() ⇒ <code>number</code>
Get the min value in the series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>number</code> - Returns the minimum of the number values in the series.  
<a name="dataForge.Series+max"></a>

#### index.max() ⇒ <code>number</code>
Get the max value in the series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>number</code> - Returns the maximum of the number values in the series.  
<a name="dataForge.Series+aggregate"></a>

#### index.aggregate([seed], selector) ⇒ <code>value</code>
Aggregate the values in the series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>value</code> - Returns a new value that has been aggregated from the input sequence by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| [seed] | <code>object</code> | The seed value for producing the aggregation. |
| selector | <code>function</code> | Function that takes the seed and then each value in the series and produces the aggregate value. |

<a name="dataForge.Series+toObject"></a>

#### index.toObject(keySelector, keySelector) ⇒ <code>object</code>
Convert the series to a JavaScript object.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>object</code> - Returns a JavaScript object generated from the input sequence by the key and value selector funtions.  

| Param | Type | Description |
| --- | --- | --- |
| keySelector | <code>function</code> | Function that selects keys for the resulting object. |
| keySelector | <code>valueSelector</code> | Function that selects values for the resulting object. |

<a name="dataForge.Series+zip"></a>

#### index.zip(sequence, selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Zip together multiple series or dataframes to produce a new series or dataframe.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a single series or dataframe that is the combination of multiple input sequences that have been 'zipped' together by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| sequence | <code>Series</code> &#124; <code>DataFrame</code> | Multiple parameters, one for each sequence to be zipped. |
| selector | <code>function</code> | Selector function that produces a new series or dataframe based on the inputs. |

<a name="dataForge.Series+forEach"></a>

#### index.forEach(callback) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Invoke a callback function for each value in the series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the input sequence with no modifications.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The calback to invoke for each value. |

<a name="dataForge.Series+all"></a>

#### index.all(predicate) ⇒ <code>boolean</code>
Determine if the predicate returns truthy for all values in the sequence.
Returns false as soon as the predicate evaluates to falsy.
Returns true if the predicate returns truthy for all values in the Series.
Returns false if the series is empty.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>boolean</code> - Returns true if the predicate has returned truthy for every value in the sequence, otherwise returns false.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+any"></a>

#### index.any([predicate]) ⇒ <code>boolean</code>
Determine if the predicate returns truthy for any of the values in the sequence.
Returns true as soon as the predicate returns truthy.
Returns false if the predicate never returns truthy.
If no predicate is specified the value itself is checked.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>boolean</code> - Returns true if the predicate has returned truthy for any value in the sequence, otherwise returns false.  

| Param | Type | Description |
| --- | --- | --- |
| [predicate] | <code>function</code> | Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+none"></a>

#### index.none([predicate]) ⇒ <code>boolean</code>
Determine if the predicate returns truthy for none of the values in the sequence.
Returns true for an empty Series.
Returns true if the predicate always returns falsy.
Otherwise returns false.
If no predicate is specified the value itself is checked.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>boolean</code> - Returns true if the predicate has returned truthy for no values in the sequence, otherwise returns false.  

| Param | Type | Description |
| --- | --- | --- |
| [predicate] | <code>function</code> | Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+sequentialDistinct"></a>

#### index.sequentialDistinct(selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Group sequential duplicate values into a Series of windows.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a series of groups. Each group is itself a series or dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selects the value used to compare for duplicates. |

<a name="dataForge.Series+distinct"></a>

#### index.distinct(selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Group distinct values in the Series into a Series of windows.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a series or dataframe containing only unique values as determined by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selects the value used to compare for duplicates. |

<a name="dataForge.Series+variableWindow"></a>

#### index.variableWindow(comparer) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Groups sequential values into variable length 'windows'. The windows can then be transformed/transformed using selectPairs or selectManyPairs.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a series of groups. Each group is itself a series or dataframe that contains the values in the 'window'.  

| Param | Type | Description |
| --- | --- | --- |
| comparer | <code>function</code> | Predicate that compares two values and returns true if they should be in the same window. |

<a name="dataForge.Series+insertPair"></a>

#### index.insertPair(pair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Insert a pair at the start of a Series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the specified pair inserted.  

| Param | Type | Description |
| --- | --- | --- |
| pair | <code>pair</code> | The pair to insert. |

<a name="dataForge.Series+appendPair"></a>

#### index.appendPair(pair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Append a pair to the end of a Series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the specified pair appended.  

| Param | Type | Description |
| --- | --- | --- |
| pair | <code>pair</code> | The pair to append. |

<a name="dataForge.Series+fillGaps"></a>

#### index.fillGaps(predicate, generator) ⇒ <code>Series</code>
Fill gaps in a series or dataframe.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a new series with gaps filled in.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicate that is passed pairA and pairB, two consecutive rows, return truthy if there is a gap between the rows, or falsey if there is no gap. |
| generator | <code>function</code> | Generator that is passed pairA and pairB, two consecutive rows, returns an array of pairs that fills the gap between the rows. |

<a name="dataForge.Series+groupBy"></a>

#### index.groupBy(selector) ⇒ <code>Series</code>
Group the series according to the selector.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a series of groups. Each group is a series with values that have been grouped by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector that defines the value to group by. |

<a name="dataForge.Series+groupSequentialBy"></a>

#### index.groupSequentialBy(selector) ⇒ <code>Series</code>
Group sequential values into a Series of windows.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a series of groups. Each group is a series with values that have been grouped by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector that defines the value to group by. |

<a name="dataForge.Series+at"></a>

#### index.at(index) ⇒ <code>value</code>
Get the value at a specified index.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>value</code> - Returns the value from the specified index in the sequence.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>function</code> | Index to for which to retreive the value. |

<a name="dataForge.Series+concat"></a>

#### index.concat(series) ⇒ <code>Series</code>
Concatenate multiple other series onto this series.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> - Returns a single series concatenated from multiple input series.  

| Param | Type | Description |
| --- | --- | --- |
| series | <code>array</code> &#124; <code>Series</code> | Multiple arguments. Each can be either a series or an array of series. |

<a name="dataForge.Series+join"></a>

#### index.join(self, inner, outerKeySelector, innerKeySelector, resultSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Correlates the elements of two Series or DataFrames based on matching keys.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the joined series or dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| resultSelector | <code>function</code> | Selector that defines how to merge outer and inner values. |

<a name="dataForge.Series+joinOuter"></a>

#### index.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs an outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes elements that have no correlation.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the joined series or dataframe.  

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

#### index.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs a left outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes left elements that have no correlation.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the joined series or dataframe.  

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

#### index.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs a right outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes right elements that have no correlation.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the joined series or dataframe.  

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

#### index.defaultIfEmpty(defaultSequence) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Returns the specified default sequence if the Series or DataFrame is empty.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns 'defaultSequence' if the input sequence is empty.  

| Param | Type | Description |
| --- | --- | --- |
| defaultSequence | <code>array</code> &#124; <code>Series</code> &#124; <code>DataFrame</code> | Default sequence to return if the Series or DataFrame is empty. |

<a name="dataForge.Series+union"></a>

#### index.union(other, [comparer]) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Returns the unique union of values between two Series or DataFrames.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the union of two sequences.  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+intersection"></a>

#### index.intersection(other, [comparer]) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Returns the intersection of values between two Series or DataFrames.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the intersection of two sequences.  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+except"></a>

#### index.except(other, [comparer]) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Returns the exception of values between two Series or DataFrames.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the difference of one sequence to another.  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+asPairs"></a>

#### index.asPairs() ⇒ <code>Pairs</code>
Convert a series or a dataframe to a series of pairs in the form [pair1, pair2, pair3, ...] where each pair is [index, value].

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Pairs</code> - Returns a series of pairs for each index and value pair in the input sequence.  
<a name="dataForge.Series+startAt"></a>

#### index.startAt(indexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe starting at the specified index value.

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all values after the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| indexValue | <code>value</code> | The value to search for before starting the new Series or DataFrame. |

<a name="dataForge.Series+endAt"></a>

#### index.endAt(indexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe ending at the specified index value (inclusive).

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with values up to and including the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| indexValue | <code>value</code> | The value to search for before ending the new Series or DataFrame. |

<a name="dataForge.Series+before"></a>

#### index.before(indexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe with all values before the specified index value (exclusive).

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all values before the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| indexValue | <code>value</code> | The value to search for while taking values. |

<a name="dataForge.Series+after"></a>

#### index.after(indexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe with all values after the specified index value (exclusive).

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all values before the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| indexValue | <code>value</code> | The value to search for while taking values. |

<a name="dataForge.Series+between"></a>

#### index.between(startIndexValue, endIndexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe with all values between the specified index values (inclusive).

**Kind**: instance method of <code>[Index](#dataForge.Index)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all values before the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| startIndexValue | <code>value</code> | The index where the new sequence starts. |
| endIndexValue | <code>value</code> | The index where the new sequence ends. |

<a name="dataForge.Series"></a>

### dataForge.Series
**Kind**: static class of <code>[dataForge](#dataForge)</code>  

* [.Series](#dataForge.Series)
    * [new Series(config|values)](#new_dataForge.Series_new)
    * [.thenBy](#dataForge.Series+thenBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.thenByDescending](#dataForge.Series+thenByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
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
    * [.selectMany(generator)](#dataForge.Series+selectMany) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.orderBy(sortSelector)](#dataForge.Series+orderBy) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.orderByDescending(sortSelector)](#dataForge.Series+orderByDescending) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.window(period)](#dataForge.Series+window) ⇒ <code>Series</code>
    * [.rollingWindow(period)](#dataForge.Series+rollingWindow) ⇒ <code>Series</code>
    * [.toString()](#dataForge.Series+toString) ⇒ <code>string</code>
    * [.percentChange()](#dataForge.Series+percentChange) ⇒ <code>Series</code>
    * [.parseInts()](#dataForge.Series+parseInts) ⇒ <code>Series</code>
    * [.parseFloats()](#dataForge.Series+parseFloats) ⇒ <code>Series</code>
    * [.parseDates([formatString])](#dataForge.Series+parseDates) ⇒ <code>Series</code>
    * [.toStrings([formatString])](#dataForge.Series+toStrings) ⇒ <code>Series</code>
    * [.detectTypes()](#dataForge.Series+detectTypes) ⇒ <code>DataFrame</code>
    * [.detectValues()](#dataForge.Series+detectValues) ⇒ <code>DataFrame</code>
    * [.truncateStrings(maxLength)](#dataForge.Series+truncateStrings) ⇒ <code>Series</code>
    * [.bake()](#dataForge.Series+bake) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.toPairs()](#dataForge.Series+toPairs) ⇒ <code>array</code>
    * [.count()](#dataForge.Series+count) ⇒ <code>array</code>
    * [.first()](#dataForge.Series+first) ⇒ <code>value</code>
    * [.last()](#dataForge.Series+last) ⇒ <code>value</code>
    * [.reverse()](#dataForge.Series+reverse) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.inflate([selector])](#dataForge.Series+inflate) ⇒ <code>DataFrame</code>
    * [.head(values)](#dataForge.Series+head) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.tail(values)](#dataForge.Series+tail) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.sum()](#dataForge.Series+sum) ⇒ <code>number</code>
    * [.average()](#dataForge.Series+average) ⇒ <code>number</code>
    * [.median()](#dataForge.Series+median) ⇒ <code>Number</code>
    * [.min()](#dataForge.Series+min) ⇒ <code>number</code>
    * [.max()](#dataForge.Series+max) ⇒ <code>number</code>
    * [.aggregate([seed], selector)](#dataForge.Series+aggregate) ⇒ <code>value</code>
    * [.toObject(keySelector, keySelector)](#dataForge.Series+toObject) ⇒ <code>object</code>
    * [.zip(sequence, selector)](#dataForge.Series+zip) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.forEach(callback)](#dataForge.Series+forEach) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.all(predicate)](#dataForge.Series+all) ⇒ <code>boolean</code>
    * [.any([predicate])](#dataForge.Series+any) ⇒ <code>boolean</code>
    * [.none([predicate])](#dataForge.Series+none) ⇒ <code>boolean</code>
    * [.sequentialDistinct(selector)](#dataForge.Series+sequentialDistinct) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.distinct(selector)](#dataForge.Series+distinct) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.variableWindow(comparer)](#dataForge.Series+variableWindow) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.insertPair(pair)](#dataForge.Series+insertPair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.appendPair(pair)](#dataForge.Series+appendPair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.fillGaps(predicate, generator)](#dataForge.Series+fillGaps) ⇒ <code>Series</code>
    * [.groupBy(selector)](#dataForge.Series+groupBy) ⇒ <code>Series</code>
    * [.groupSequentialBy(selector)](#dataForge.Series+groupSequentialBy) ⇒ <code>Series</code>
    * [.at(index)](#dataForge.Series+at) ⇒ <code>value</code>
    * [.concat(series)](#dataForge.Series+concat) ⇒ <code>Series</code>
    * [.join(self, inner, outerKeySelector, innerKeySelector, resultSelector)](#dataForge.Series+join) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuter) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterLeft) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector)](#dataForge.Series+joinOuterRight) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.defaultIfEmpty(defaultSequence)](#dataForge.Series+defaultIfEmpty) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.union(other, [comparer])](#dataForge.Series+union) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.intersection(other, [comparer])](#dataForge.Series+intersection) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.except(other, [comparer])](#dataForge.Series+except) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.asPairs()](#dataForge.Series+asPairs) ⇒ <code>Pairs</code>
    * [.startAt(indexValue)](#dataForge.Series+startAt) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.endAt(indexValue)](#dataForge.Series+endAt) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.before(indexValue)](#dataForge.Series+before) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.after(indexValue)](#dataForge.Series+after) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
    * [.between(startIndexValue, endIndexValue)](#dataForge.Series+between) ⇒ <code>Series</code> &#124; <code>DataFrame</code>

<a name="new_dataForge.Series_new"></a>

#### new Series(config|values)
Constructor for Series.


| Param | Type | Description |
| --- | --- | --- |
| config|values | <code>object</code> &#124; <code>array</code> | Specifies content and configuration for the Series. |

<a name="dataForge.Series+thenBy"></a>

#### series.thenBy ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs additional sorting (ascending).

**Kind**: instance property of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

<a name="dataForge.Series+thenByDescending"></a>

#### series.thenByDescending ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs additional sorting (descending).

**Kind**: instance property of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has been sorted by the value returned by the selector.  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| sortSelector | <code>function</code> | Selects the value to sort by. |

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
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the specified index attached.  

| Param | Type | Description |
| --- | --- | --- |
| newIndex | <code>array</code> &#124; <code>Series</code> | The new index to apply to the Series. |

<a name="dataForge.Series+resetIndex"></a>

#### series.resetIndex() ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Reset the index of the data frame back to the default sequential integer index.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the index reset to the default zero-based index.  
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

<a name="dataForge.Series+selectMany"></a>

#### series.selectMany(generator) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Generate a new series based on the results of the selector function.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with values that have been produced by the generator function.  

| Param | Type | Description |
| --- | --- | --- |
| generator | <code>function</code> | Generator function that may generator 0 or more new values from value in the series or dataframe. |

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

<a name="dataForge.Series+window"></a>

#### series.window(period) ⇒ <code>Series</code>
Segment a Series into 'windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original series or dataframe.
Use select or selectPairs to aggregate.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a new series, each value of which is a 'window' (or segment) of the original series or dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of values in the window. |

<a name="dataForge.Series+rollingWindow"></a>

#### series.rollingWindow(period) ⇒ <code>Series</code>
Segment a Series into 'rolling windows'. Returns a new Series. Each value in the new Series contains a 'window' (or segment) of the original Series.
Use select or selectPairs to aggregate.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a new series, each value of which is a 'window' (or segment) of the original series or dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| period | <code>integer</code> | The number of values in the window. |

<a name="dataForge.Series+toString"></a>

#### series.toString() ⇒ <code>string</code>
Format the data frame for display as a string.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>string</code> - Generates and returns a string representation of the series or dataframe.  
<a name="dataForge.Series+percentChange"></a>

#### series.percentChange() ⇒ <code>Series</code>
Compute the percent change for each row after the first.
Percentages are expressed as 0-1 values.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a new series where each value indicates the percent change from the previous number value in the original series.  
<a name="dataForge.Series+parseInts"></a>

#### series.parseInts() ⇒ <code>Series</code>
Parse a series with string values to a series with int values.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a new series where string values from the original series have been parsed to integer values.  
<a name="dataForge.Series+parseFloats"></a>

#### series.parseFloats() ⇒ <code>Series</code>
Parse a series with string values to a series with float values.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a new series where string values from the original series have been parsed to floating-point values.  
<a name="dataForge.Series+parseDates"></a>

#### series.parseDates([formatString]) ⇒ <code>Series</code>
Parse a series with string values to a series with date values.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a new series where string values from the original series have been parsed to Date values.  

| Param | Type | Description |
| --- | --- | --- |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="dataForge.Series+toStrings"></a>

#### series.toStrings([formatString]) ⇒ <code>Series</code>
Convert a series of values of different types to a series of string values.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a new series where the values from the original series have been stringified.  

| Param | Type | Description |
| --- | --- | --- |
| [formatString] | <code>string</code> | Optional formatting string for dates. |

<a name="dataForge.Series+detectTypes"></a>

#### series.detectTypes() ⇒ <code>DataFrame</code>
Detect the types of the values in the sequence.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>DataFrame</code> - Returns a dataframe that describes the data types contained in the input series or dataframe.  
<a name="dataForge.Series+detectValues"></a>

#### series.detectValues() ⇒ <code>DataFrame</code>
Detect the frequency of values in the sequence.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>DataFrame</code> - Returns a dataframe that describes the values contained in the input sequence.  
<a name="dataForge.Series+truncateStrings"></a>

#### series.truncateStrings(maxLength) ⇒ <code>Series</code>
Produces a new series with all string values truncated to the requested maximum length.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a new series with strings that are truncated to the specified maximum length.  

| Param | Type | Description |
| --- | --- | --- |
| maxLength | <code>int</code> | The maximum length of the string values after truncation. |

<a name="dataForge.Series+bake"></a>

#### series.bake() ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Forces lazy evaluation to complete and 'bakes' the series into memory.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a series or dataframe that has been 'baked', all lazy evaluation has completed.  
<a name="dataForge.Series+toPairs"></a>

#### series.toPairs() ⇒ <code>array</code>
Retreive the data as pairs of [index, value].

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>array</code> - Returns an array of pairs for the content of the series or dataframe. Each pair is a two element array that contains an index and a value.  
<a name="dataForge.Series+count"></a>

#### series.count() ⇒ <code>array</code>
Count the number of rows in the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>array</code> - Returns the count of all values in the series or dataframes.  
<a name="dataForge.Series+first"></a>

#### series.first() ⇒ <code>value</code>
Get the first value of the series or dataframe.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>value</code> - Returns the first value of the series or dataframe.  
<a name="dataForge.Series+last"></a>

#### series.last() ⇒ <code>value</code>
Get the last value of the series or dataframe.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>value</code> - Returns the last value of the series or dataframe.  
<a name="dataForge.Series+reverse"></a>

#### series.reverse() ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Reverse the series or dataframe.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that is the reverse of the input.  
<a name="dataForge.Series+inflate"></a>

#### series.inflate([selector]) ⇒ <code>DataFrame</code>
Inflate a series to a data-frame.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>DataFrame</code> - Returns a new dataframe that has been created from the input series via the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| [selector] | <code>function</code> | Optional selector function that transforms each value in the series to a row in the new data-frame. |

<a name="dataForge.Series+head"></a>

#### series.head(values) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get X values from the start of the series or dataframe.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has only the specified number of values taken from the start of the input sequence.  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="dataForge.Series+tail"></a>

#### series.tail(values) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get X values from the end of the series or dataframe.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe that has only the specified number of values taken from the end of the input sequence.  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>int</code> | Number of values to take. |

<a name="dataForge.Series+sum"></a>

#### series.sum() ⇒ <code>number</code>
Sum the values in a series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>number</code> - Returns the sum of the number values in the series.  
<a name="dataForge.Series+average"></a>

#### series.average() ⇒ <code>number</code>
Average the values in a series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>number</code> - Returns the average of the number values in the series.  
<a name="dataForge.Series+median"></a>

#### series.median() ⇒ <code>Number</code>
Get the median value in the series. Not this sorts the series, so can be expensive.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Number</code> - Returns the median of the values in the series.  
<a name="dataForge.Series+min"></a>

#### series.min() ⇒ <code>number</code>
Get the min value in the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>number</code> - Returns the minimum of the number values in the series.  
<a name="dataForge.Series+max"></a>

#### series.max() ⇒ <code>number</code>
Get the max value in the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>number</code> - Returns the maximum of the number values in the series.  
<a name="dataForge.Series+aggregate"></a>

#### series.aggregate([seed], selector) ⇒ <code>value</code>
Aggregate the values in the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>value</code> - Returns a new value that has been aggregated from the input sequence by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| [seed] | <code>object</code> | The seed value for producing the aggregation. |
| selector | <code>function</code> | Function that takes the seed and then each value in the series and produces the aggregate value. |

<a name="dataForge.Series+toObject"></a>

#### series.toObject(keySelector, keySelector) ⇒ <code>object</code>
Convert the series to a JavaScript object.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>object</code> - Returns a JavaScript object generated from the input sequence by the key and value selector funtions.  

| Param | Type | Description |
| --- | --- | --- |
| keySelector | <code>function</code> | Function that selects keys for the resulting object. |
| keySelector | <code>valueSelector</code> | Function that selects values for the resulting object. |

<a name="dataForge.Series+zip"></a>

#### series.zip(sequence, selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Zip together multiple series or dataframes to produce a new series or dataframe.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a single series or dataframe that is the combination of multiple input sequences that have been 'zipped' together by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| sequence | <code>Series</code> &#124; <code>DataFrame</code> | Multiple parameters, one for each sequence to be zipped. |
| selector | <code>function</code> | Selector function that produces a new series or dataframe based on the inputs. |

<a name="dataForge.Series+forEach"></a>

#### series.forEach(callback) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Invoke a callback function for each value in the series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the input sequence with no modifications.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The calback to invoke for each value. |

<a name="dataForge.Series+all"></a>

#### series.all(predicate) ⇒ <code>boolean</code>
Determine if the predicate returns truthy for all values in the sequence.
Returns false as soon as the predicate evaluates to falsy.
Returns true if the predicate returns truthy for all values in the Series.
Returns false if the series is empty.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>boolean</code> - Returns true if the predicate has returned truthy for every value in the sequence, otherwise returns false.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+any"></a>

#### series.any([predicate]) ⇒ <code>boolean</code>
Determine if the predicate returns truthy for any of the values in the sequence.
Returns true as soon as the predicate returns truthy.
Returns false if the predicate never returns truthy.
If no predicate is specified the value itself is checked.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>boolean</code> - Returns true if the predicate has returned truthy for any value in the sequence, otherwise returns false.  

| Param | Type | Description |
| --- | --- | --- |
| [predicate] | <code>function</code> | Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+none"></a>

#### series.none([predicate]) ⇒ <code>boolean</code>
Determine if the predicate returns truthy for none of the values in the sequence.
Returns true for an empty Series.
Returns true if the predicate always returns falsy.
Otherwise returns false.
If no predicate is specified the value itself is checked.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>boolean</code> - Returns true if the predicate has returned truthy for no values in the sequence, otherwise returns false.  

| Param | Type | Description |
| --- | --- | --- |
| [predicate] | <code>function</code> | Optional predicate function that receives each value in turn and returns truthy for a match, otherwise falsy. |

<a name="dataForge.Series+sequentialDistinct"></a>

#### series.sequentialDistinct(selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Group sequential duplicate values into a Series of windows.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a series of groups. Each group is itself a series or dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selects the value used to compare for duplicates. |

<a name="dataForge.Series+distinct"></a>

#### series.distinct(selector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Group distinct values in the Series into a Series of windows.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a series or dataframe containing only unique values as determined by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selects the value used to compare for duplicates. |

<a name="dataForge.Series+variableWindow"></a>

#### series.variableWindow(comparer) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Groups sequential values into variable length 'windows'. The windows can then be transformed/transformed using selectPairs or selectManyPairs.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a series of groups. Each group is itself a series or dataframe that contains the values in the 'window'.  

| Param | Type | Description |
| --- | --- | --- |
| comparer | <code>function</code> | Predicate that compares two values and returns true if they should be in the same window. |

<a name="dataForge.Series+insertPair"></a>

#### series.insertPair(pair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Insert a pair at the start of a Series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the specified pair inserted.  

| Param | Type | Description |
| --- | --- | --- |
| pair | <code>pair</code> | The pair to insert. |

<a name="dataForge.Series+appendPair"></a>

#### series.appendPair(pair) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Append a pair to the end of a Series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with the specified pair appended.  

| Param | Type | Description |
| --- | --- | --- |
| pair | <code>pair</code> | The pair to append. |

<a name="dataForge.Series+fillGaps"></a>

#### series.fillGaps(predicate, generator) ⇒ <code>Series</code>
Fill gaps in a series or dataframe.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a new series with gaps filled in.  

| Param | Type | Description |
| --- | --- | --- |
| predicate | <code>function</code> | Predicate that is passed pairA and pairB, two consecutive rows, return truthy if there is a gap between the rows, or falsey if there is no gap. |
| generator | <code>function</code> | Generator that is passed pairA and pairB, two consecutive rows, returns an array of pairs that fills the gap between the rows. |

<a name="dataForge.Series+groupBy"></a>

#### series.groupBy(selector) ⇒ <code>Series</code>
Group the series according to the selector.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a series of groups. Each group is a series with values that have been grouped by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector that defines the value to group by. |

<a name="dataForge.Series+groupSequentialBy"></a>

#### series.groupSequentialBy(selector) ⇒ <code>Series</code>
Group sequential values into a Series of windows.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a series of groups. Each group is a series with values that have been grouped by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>function</code> | Selector that defines the value to group by. |

<a name="dataForge.Series+at"></a>

#### series.at(index) ⇒ <code>value</code>
Get the value at a specified index.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>value</code> - Returns the value from the specified index in the sequence.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>function</code> | Index to for which to retreive the value. |

<a name="dataForge.Series+concat"></a>

#### series.concat(series) ⇒ <code>Series</code>
Concatenate multiple other series onto this series.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> - Returns a single series concatenated from multiple input series.  

| Param | Type | Description |
| --- | --- | --- |
| series | <code>array</code> &#124; <code>Series</code> | Multiple arguments. Each can be either a series or an array of series. |

<a name="dataForge.Series+join"></a>

#### series.join(self, inner, outerKeySelector, innerKeySelector, resultSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Correlates the elements of two Series or DataFrames based on matching keys.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the joined series or dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| self | <code>Series</code> &#124; <code>DataFrame</code> | The outer Series or DataFrame to join. |
| inner | <code>Series</code> &#124; <code>DataFrame</code> | The inner Series or DataFrame to join. |
| outerKeySelector | <code>function</code> | Selector that chooses the join key from the outer sequence. |
| innerKeySelector | <code>function</code> | Selector that chooses the join key from the inner sequence. |
| resultSelector | <code>function</code> | Selector that defines how to merge outer and inner values. |

<a name="dataForge.Series+joinOuter"></a>

#### series.joinOuter(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs an outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes elements that have no correlation.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the joined series or dataframe.  

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

#### series.joinOuterLeft(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs a left outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes left elements that have no correlation.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the joined series or dataframe.  

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

#### series.joinOuterRight(self, inner, outerKeySelector, innerKeySelector, outerResultSelector, innerResultSelector, mergeSelector) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Performs a right outer join on two Series or DataFrames. Correlates the elements based on matching keys.
Includes right elements that have no correlation.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the joined series or dataframe.  

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

#### series.defaultIfEmpty(defaultSequence) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Returns the specified default sequence if the Series or DataFrame is empty.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns 'defaultSequence' if the input sequence is empty.  

| Param | Type | Description |
| --- | --- | --- |
| defaultSequence | <code>array</code> &#124; <code>Series</code> &#124; <code>DataFrame</code> | Default sequence to return if the Series or DataFrame is empty. |

<a name="dataForge.Series+union"></a>

#### series.union(other, [comparer]) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Returns the unique union of values between two Series or DataFrames.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the union of two sequences.  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+intersection"></a>

#### series.intersection(other, [comparer]) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Returns the intersection of values between two Series or DataFrames.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the intersection of two sequences.  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+except"></a>

#### series.except(other, [comparer]) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Returns the exception of values between two Series or DataFrames.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns the difference of one sequence to another.  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>Series</code> &#124; <code>DataFrame</code> | The other Series or DataFrame to combine. |
| [comparer] | <code>function</code> | Optional comparer that selects the value to compare. |

<a name="dataForge.Series+asPairs"></a>

#### series.asPairs() ⇒ <code>Pairs</code>
Convert a series or a dataframe to a series of pairs in the form [pair1, pair2, pair3, ...] where each pair is [index, value].

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Pairs</code> - Returns a series of pairs for each index and value pair in the input sequence.  
<a name="dataForge.Series+startAt"></a>

#### series.startAt(indexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe starting at the specified index value.

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all values after the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| indexValue | <code>value</code> | The value to search for before starting the new Series or DataFrame. |

<a name="dataForge.Series+endAt"></a>

#### series.endAt(indexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe ending at the specified index value (inclusive).

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with values up to and including the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| indexValue | <code>value</code> | The value to search for before ending the new Series or DataFrame. |

<a name="dataForge.Series+before"></a>

#### series.before(indexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe with all values before the specified index value (exclusive).

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all values before the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| indexValue | <code>value</code> | The value to search for while taking values. |

<a name="dataForge.Series+after"></a>

#### series.after(indexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe with all values after the specified index value (exclusive).

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all values before the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| indexValue | <code>value</code> | The value to search for while taking values. |

<a name="dataForge.Series+between"></a>

#### series.between(startIndexValue, endIndexValue) ⇒ <code>Series</code> &#124; <code>DataFrame</code>
Get a new series or dataframe with all values between the specified index values (inclusive).

**Kind**: instance method of <code>[Series](#dataForge.Series)</code>  
**Returns**: <code>Series</code> &#124; <code>DataFrame</code> - Returns a new series or dataframe with all values before the specified index.  

| Param | Type | Description |
| --- | --- | --- |
| startIndexValue | <code>value</code> | The index where the new sequence starts. |
| endIndexValue | <code>value</code> | The index where the new sequence ends. |

<a name="dataForge.concatDataFrames"></a>

### dataForge.concatDataFrames ⇒ <code>DataFrame</code>
Concatenate multiple dataframes into a single dataframe.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  
**Returns**: <code>DataFrame</code> - Returns the single concatendated dataframe.  

| Param | Type | Description |
| --- | --- | --- |
| dataFrames | <code>array</code> | Array of dataframes to concatenate. |

<a name="dataForge.concatSeries"></a>

### dataForge.concatSeries ⇒ <code>Series</code>
Concatenate multiple series into a single series.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  
**Returns**: <code>Series</code> - - Returns the single concatendated series.  

| Param | Type | Description |
| --- | --- | --- |
| series | <code>array</code> | Array of series to concatenate. |

<a name="dataForge.use"></a>

### dataForge.use(plugin) ⇒ <code>[dataForge](#dataForge)</code>
Install a plugin in the dataForge namespace.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
**Returns**: <code>[dataForge](#dataForge)</code> - Returns the dataForge API object so that calls to 'use' can be chained.  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>plugin-object</code> | The plugin to add to data-forge. |

<a name="dataForge.fromJSON"></a>

### dataForge.fromJSON(jsonTextString, [config]) ⇒ <code>DataFrame</code>
Deserialize a DataFrame from a JSON text string.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
**Returns**: <code>DataFrame</code> - Returns a dataframe that has been deserialized from the JSON data.  

| Param | Type | Description |
| --- | --- | --- |
| jsonTextString | <code>string</code> | The JSON text to deserialize. |
| [config] | <code>config</code> | Optional configuration option to pass to the DataFrame. |

<a name="dataForge.fromCSV"></a>

### dataForge.fromCSV(csvTextString, [config]) ⇒ <code>DataFrame</code>
Deserialize a DataFrame from a CSV text string.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
**Returns**: <code>DataFrame</code> - Returns a dataframe that has been deserialized from the CSV data.  

| Param | Type | Description |
| --- | --- | --- |
| csvTextString | <code>string</code> | The CSV text to deserialize. |
| [config] | <code>config</code> | Optional configuration option to pass to the DataFrame. |

<a name="dataForge.readFile"></a>

### dataForge.readFile(filePath) ⇒ <code>object</code>
Read a file asynchronously from the file system.
Works in Nodejs, doesn't work in the browser.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
**Returns**: <code>object</code> - file - Returns an object that represents the file. Use `parseCSV` or `parseJSON` to deserialize to a DataFrame.  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | The path to the file to read. |

<a name="dataForge.readFileSync"></a>

### dataForge.readFileSync(filePath) ⇒ <code>object</code>
Read a file synchronously from the file system.
Works in Nodejs, doesn't work in the browser.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
**Returns**: <code>object</code> - Returns an object that represents the file. Use `parseCSV` or `parseJSON` to deserialize to a DataFrame.  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | The path to the file to read. |

<a name="dataForge.httpGet"></a>

### dataForge.httpGet(url) ⇒ <code>object</code>
Deserialize a DataFrame from a REST API that returns data via HTTP GET.
Works asynchronously, returns a promise.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
**Returns**: <code>object</code> - Returns an object that represents the response REST API. Use `parseCSV` or `parseJSON` to deserialize to a DataFrame.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL for a REST API that returns data. |

<a name="dataForge.range"></a>

### dataForge.range(start, count) ⇒ <code>Series</code>
Generate a series from a range of numbers.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
**Returns**: <code>Series</code> - Returns a series with a sequence of generated values. The series contains 'count' values beginning at 'start'.  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>int</code> | The value of the first number in the range. |
| count | <code>int</code> | The number of sequential values in the range. |

<a name="dataForge.matrix"></a>

### dataForge.matrix(numColumns, numRows, start, increment) ⇒ <code>DataFrame</code>
Generate a data-frame containing a matrix of values.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
**Returns**: <code>DataFrame</code> - Returns a dataframe that contains a matrix of generated values.  

| Param | Type | Description |
| --- | --- | --- |
| numColumns | <code>int</code> | The number of columns in the data-frame. |
| numRows | <code>int</code> | The number of rows in the data-frame. |
| start | <code>number</code> | The starting value. |
| increment | <code>number</code> | The value to increment by for each new value. |

<a name="dataForge.zipSeries"></a>

### dataForge.zipSeries(series, selector) ⇒ <code>Series</code>
Zip together multiple series to create a new series.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
**Returns**: <code>Series</code> - Returns a single series that is the combination of multiple input series that have been 'zipped' together by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| series | <code>array</code> | Array of series to zip together. |
| selector | <code>function</code> | Selector function that produces a new series based on the input series. |

<a name="dataForge.zipDataFrames"></a>

### dataForge.zipDataFrames(dataFrames, selector) ⇒ <code>DataFrame</code>
Zip together multiple data-frames to create a new data-frame.

**Kind**: static method of <code>[dataForge](#dataForge)</code>  
**Returns**: <code>DataFrame</code> - Returns a single dataframe that is the combination of multiple input dataframes that have been 'zipped' together by the 'selector' function.  

| Param | Type | Description |
| --- | --- | --- |
| dataFrames | <code>array</code> | Array of data-frames to zip together. |
| selector | <code>function</code> | Selector function that produces a new data-frame based on the input data-frames. |

<a name="parseCSV"></a>

## parseCSV([config]) ⇒ <code>Promise.&lt;DataFrame&gt;</code>
Deserialize a CSV file to a DataFrame.
Returns a promise that later resolves to a DataFrame.

**Kind**: global function  
**Returns**: <code>Promise.&lt;DataFrame&gt;</code> - Returns a promise of a dataframe loaded from the file.  

| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>object</code> | Optional configuration file for parsing. |

<a name="parseJSON"></a>

## parseJSON([config]) ⇒ <code>Promise.&lt;DataFrame&gt;</code>
Deserialize a JSON file to a DataFrame.
Returns a promise that later resolves to a DataFrame.

**Kind**: global function  
**Returns**: <code>Promise.&lt;DataFrame&gt;</code> - Returns a promise of a dataframe loaded from the file.  

| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>object</code> | Optional configuration file for parsing. |

<a name="parseCSV"></a>

## parseCSV([config]) ⇒ <code>DataFrame</code>
Deserialize a CSV file to a DataFrame.

**Kind**: global function  
**Returns**: <code>DataFrame</code> - Returns a dataframe that was deserialized from the file.  

| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>object</code> | Optional configuration file for parsing. |

<a name="parseJSON"></a>

## parseJSON([config]) ⇒ <code>DataFrame</code>
Deserialize a JSON file to a DataFrame.

**Kind**: global function  
**Returns**: <code>DataFrame</code> - Returns a dataframe that was deserialized from the file.  

| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>object</code> | Optional configuration file for parsing. |

<a name="parseCSV"></a>

## parseCSV([config]) ⇒ <code>Promise.&lt;DataFrame&gt;</code>
Deserialize a CSV data to a DataFrame.

**Kind**: global function  
**Returns**: <code>Promise.&lt;DataFrame&gt;</code> - Returns a promise of a dataframe loaded from the REST API.  

| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>object</code> | Optional configuration file for parsing. |

<a name="parseJSON"></a>

## parseJSON([config]) ⇒ <code>Promise.&lt;DataFrame&gt;</code>
Deserialize JSON data to a DataFrame.

**Kind**: global function  
**Returns**: <code>Promise.&lt;DataFrame&gt;</code> - Returns a promise of a dataframe loaded from the REST API.  

| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>object</code> | Optional configuration file for parsing. |

<a name="writeFile"></a>

## writeFile(filePath) ⇒ <code>Promise</code>
Serialize the dataframe to a CSV file in the local file system.Asynchronous version.

**Kind**: global function  
**Returns**: <code>Promise</code> - Returns a promise that resolves when the file has been written.  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | Specifies the output path for the file. |

<a name="writeFileSync"></a>

## writeFileSync(filePath)
Serialize the dataframe to a CSV file in the local file system.Synchronous version.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | Specifies the output path for the file. |

<a name="httpPost"></a>

## httpPost(url) ⇒ <code>Promise</code>
Serialize the dataframe to CSV and HTTP POST it to the specified REST API.

**Kind**: global function  
**Returns**: <code>Promise</code> - Returns a promise that resolves when the HTTP request has completed.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL of the REST API. |

<a name="writeFile"></a>

## writeFile(filePath) ⇒ <code>Promise</code>
Serialize the dataframe to a JSON file in the local file system.Asynchronous version.

**Kind**: global function  
**Returns**: <code>Promise</code> - Returns a promise that resolves when the file has been written.  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | Specifies the output path for the file. |

<a name="writeFileSync"></a>

## writeFileSync(filePath)
Serialize the dataframe to a JSON file in the local file system.Synchronous version.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | Specifies the output path for the file. |

<a name="httpPost"></a>

## httpPost(url) ⇒ <code>Promise</code>
Serialize the dataframe to JSON and HTTP POST it to the specified REST API.

**Kind**: global function  
**Returns**: <code>Promise</code> - Returns a promise that resolves when the HTTP request has completed.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL of the REST API. |

