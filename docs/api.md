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
    * [.concatDataFrames](#dataForge.concatDataFrames)
    * [.concatSeries](#dataForge.concatSeries)
    * [.use()](#dataForge.use)
    * [.fromJSON(jsonTextString, [config])](#dataForge.fromJSON)
    * [.range(start, count)](#dataForge.range)
    * [.matrix(numColumns, numRows, start, increment)](#dataForge.matrix)
    * [.zipSeries(series, selector)](#dataForge.zipSeries)
    * [.zipDataFrames(dataFrames, selector)](#dataForge.zipDataFrames)

<a name="dataForge.DataFrame"></a>

### dataForge.DataFrame
Constructor for DataFrame.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config|values | <code>object</code> &#124; <code>array</code> | Specifies content and configuration for the DataFrame. |

<a name="dataForge.Series"></a>

### dataForge.Series
Constructor for Series.

**Kind**: static property of <code>[dataForge](#dataForge)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config|values | <code>object</code> &#124; <code>array</code> | Specifies content and configuration for the Series. |

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

