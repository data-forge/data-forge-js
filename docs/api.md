<a name="dataForge"></a>

## dataForge
Main namespace for Data-Forge.

Nodejs:

		npm install --save data-forge
		
		var dataForge = require('data-forge');

Browser:

		bower install --save data-forge

		<script language="javascript" type="text/javascript" src="bower_components/data-forge/data-forge.js"></script>

**Kind**: global variable  

* [dataForge](#dataForge)
    * [.DataFrame](#dataForge.DataFrame)
    * [.Series](#dataForge.Series)
    * [.Index](#dataForge.Index)
    * [.merge](#dataForge.merge)
    * [.mergeSeries](#dataForge.mergeSeries)
    * [.concat](#dataForge.concat)
    * [.zipSeries](#dataForge.zipSeries)
    * [.zip](#dataForge.zip)
    * [.use()](#dataForge.use)
    * [.fromJSON(jsonTextString, [config])](#dataForge.fromJSON)
    * [.range(start, count)](#dataForge.range)
    * [.matrix(numColumns, numRows, start, increment)](#dataForge.matrix)

<a name="dataForge.DataFrame"></a>

### dataForge.DataFrame
Constructor for DataFrame.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | Specifies content and configuration for the DataFrame. |

<a name="dataForge.Series"></a>

### dataForge.Series
Constructor for Series.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | Specifies content and configuration for the Series. |

<a name="dataForge.Index"></a>

### dataForge.Index
Constructor for Index.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>array</code> | Array of values to include in the index. |

<a name="dataForge.merge"></a>

### dataForge.merge
Merge data-frames by index or a particular column.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| leftDataFrame | <code>DataFrame</code> | One data frame to merge. |
| rightDataFrame | <code>DataFrame</code> | The other data frame to merge. |
| [columnName] | <code>string</code> | The name of the column to merge on. Optional, when not specified merge is based on the index. |

<a name="dataForge.mergeSeries"></a>

### dataForge.mergeSeries
Merge multiple series into a new DataFrame.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| columnNames | <code>array</code> | Array of strings that defines the column names for the resulting DataFrame. Must have the same number of elements as the 'series' parameter. |
| series | <code>array</code> | Array of series that defined the values for the columns. Must have the same number of elements as the 'columnNames' parameter. |

<a name="dataForge.concat"></a>

### dataForge.concat
Concatenate multiple data frames into a single.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| dataFrames | <code>array</code> | Array of data frames to concatenate. |

<a name="dataForge.zipSeries"></a>

### dataForge.zipSeries
Zip together multiple series to create a new series.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| series | <code>array</code> | Array of series to zip together. |
| selector | <code>function</code> | Selector function that produces a new series based on the input series. |

<a name="dataForge.zip"></a>

### dataForge.zip
Zip together multiple data-frames to create a new data-frame.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| dataFrames | <code>array</code> | Array of data-frames to zip together. |
| selector | <code>function</code> | Selector function that produces a new data-frame based on the input data-frames. |

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

