'use strict';

var assert = require('chai').assert;
var E = require('linq');
var SelectIterator = require('./src/iterators/select');
var MultiIterator = require('./src/iterators/multi');
require('sugar');
var BabyParse = require('babyparse');
var extend = require('extend');

var DataFrame = require('./src/dataframe');
var Series = require('./src/series');
var E = require('linq');
var zip = require('./src/zip');

//
// Records plugins that have been registered.
//
var registeredPlugins = {};

/**
 * Main namespace for Data-Forge.
 * 
 * Nodejs:
 * 
 * 		npm install --save data-forge
 * 		
 * 		var dataForge = require('data-forge');
 * 
 * Browser:
 * 
 * 		bower install --save data-forge
 * 
 * 		<script language="javascript" type="text/javascript" src="bower_components/data-forge/data-forge.js"></script>
 *
 * @namespace dataForge
 */
var dataForge = {
	
	//
	// Constructor for DataFrame.
	//
	DataFrame: DataFrame,

	//
	// Constructor for Series.
	//
	Series: Series,

	/**
	 * Install a plugin in the dataForge namespace.
	 * 
	 * @param {plugin-object} plugin - The plugin to add to data-forge.
	 * 
	 * @returns {dataForge} Returns the dataForge API object so that calls to 'use' can be chained.
	 */
	use: function (plugin) {

		assert.isFunction(plugin, "Expected 'plugin' parameter to 'use' to be a function.");

		if (registeredPlugins[plugin] === plugin) {
			return; // Already registered.
		}

		registeredPlugins[plugin] = plugin;

		var self = this;
		plugin(self);
		return self;
	},


	/**
	 * Deserialize a DataFrame from a JSON text string.
	 *
	 * @param {string} jsonTextString - The JSON text to deserialize.
	 * @param {config} [config] - Optional configuration option to pass to the DataFrame.
	 * 
	 * @returns {DataFrame} Returns a dataframe that has been deserialized from the JSON data.
	 */
	fromJSON: function (jsonTextString, config) {
		
		assert.isString(jsonTextString, "Expected 'jsonTextString' parameter to 'dataForge.fromJSON' to be a string containing data encoded in the JSON format.");

		if (config) {
			assert.isObject(config, "Expected 'config' parameter to 'dataForge.fromJSON' to be an object with configuration to pass to the DataFrame.");
		}

		var baseConfig = {
			values: JSON.parse(jsonTextString)
		};

		var dataFrameConfig = extend({}, config || {}, baseConfig);
		return new DataFrame(dataFrameConfig);
	},

	/**
	 * Deserialize a DataFrame from a CSV text string.
	 *
	 * @param {string} csvTextString - The CSV text to deserialize.
	 * @param {config} [config] - Optional configuration option to pass to the DataFrame.
	 * 
	 * @returns {DataFrame} Returns a dataframe that has been deserialized from the CSV data.
	 */
	fromCSV: function (csvTextString, config) {
		assert.isString(csvTextString, "Expected 'csvTextString' parameter to 'dataForge.fromCSV' to be a string containing data encoded in the CSV format.");

		if (config) {
			assert.isObject(config, "Expected 'config' parameter to 'dataForge.fromJSON' to be an object with configuration to pass to the DataFrame.");

			if (config.columnNames) {
				assert.isArray(config.columnNames, "Expect 'columnNames' field of 'config' parameter to DataForge.fromCSV to be an array of strings that specify column names.")

				config.columnNames.forEach(function (columnName) {
					assert.isString(columnName, "Expect 'columnNames' field of 'config' parameter to DataForge.fromCSV to be an array of strings that specify column names.")
				});
			}			
		}

		var csvConfig = extend({}, config);
		var parsed = BabyParse.parse(csvTextString, csvConfig);
		var rows = parsed.data;
		
		/* Old csv parsing.
		var lines = csvTextString.split('\n');
		var rows = E
			.from(lines) // Ignore blank lines.
			.where(function (line) {
				return line.trim().length > 0;
			})
			.select(function (line) {
				return E
					.from(line.split(','))
					.select(function (col) {
						return col.trim();
					})
					.select(function (col) {
						if (col.length === 0) {
							return undefined;
						}
						else {
							return col;
						}
					})
					.toArray();					
			})
			.toArray();
		*/

		if (rows.length === 0) {
			return new dataForge.DataFrame({ columnNames: [], values: [] });
		}

		var columnNames;
		rows = E.from(rows)
			.select(function (row) {
				return E.from(row)
					.select(function (cell) {
						return cell.trim(); // Trim each cell.
					})
					.toArray()
			})
			.toArray();

		if (config && config.columnNames) {
			columnNames = config.columnNames;
		}
		else {
			columnNames = E.from(E.from(rows).first())
				.select(function (columnName) {
					return columnName.trim();
				})
				.toArray();
			rows = E.from(rows)
				.skip(1) // Skip header.
				.toArray();
		}

		var baseConfig = {
			columnNames: columnNames, 
			values: rows,
		};
		var dataFrameConfig = extend({}, config || {}, baseConfig);
		return new dataForge.DataFrame(dataFrameConfig);
	},

	/**
	 * Concatenate multiple dataframes into a single dataframe.
	 *
	 * @param {array} dataFrames - Array of dataframes to concatenate.
	 * 
	 * @returns {DataFrame} Returns the single concatendated dataframe. 
	 */
	concatDataFrames: require('./src/concat-dataframes'),

	/**
	 * Concatenate multiple series into a single series.
	 * 
	 * @param {array} series - Array of series to concatenate.
	 *
	 * @returns {Series} - Returns the single concatendated series.  
	 */
	concatSeries: require('./src/concat-series'),

	/**
	 * Generate a series from a range of numbers.
	 *
	 * @param {int} start - The value of the first number in the range.
	 * @param {int} count - The number of sequential values in the range.
	 * 
	 * @returns {Series} Returns a series with a sequence of generated values. The series contains 'count' values beginning at 'start'. 
	 */
	range: function (start, count) {

		assert.isNumber(start, "Expect 'start' parameter to range function to be a number.");
		assert.isNumber(count, "Expect 'count' parameter to range function to be a number.");

		return new Series({
				values: function ()  {

					var i = -1;

					return { //todo: should have a range iterator.
						moveNext: function () {
							return ++i < count;
						},

						getCurrent: function () {
							return start + i;
						},

					};
				},
			});
	},

	/**
	 * Generate a data-frame containing a matrix of values.
	 *
	 * @param {int} numColumns - The number of columns in the data-frame.
	 * @param {int} numRows - The number of rows in the data-frame.
	 * @param {number} start - The starting value.
	 * @param {number} increment - The value to increment by for each new value.
	 * 
	 * @returns {DataFrame} Returns a dataframe that contains a matrix of generated values.
	 */
	matrix: function (numColumns, numRows, start, increment) {
		return new DataFrame({
			columnNames: E.range(1, numColumns)
				.select(function (columnNumber) {
					return columnNumber.toString();
				})
				.toArray(),

			values: function () {
				var rowIndex = 0;
				var nextValue = start;
				var curRow = undefined;

				return {
					moveNext: function () {
						if (rowIndex >= numRows) {
							return false;
						}
						curRow = E.range(0, numColumns)
							.select(function (columnIndex) {
								return nextValue + (columnIndex * increment);
							})
							.toArray();
						nextValue += numColumns * increment;
						++rowIndex;
						return true;
					},

					getCurrent: function () {
						return curRow;
					}
				};
			},
		})
	},

	/**
	 * Zip together multiple series to create a new series.
	 *
	 * @param {array} series - Array of series to zip together.
	 * @param {function} selector - Selector function that produces a new series based on the input series.
	 * 
	 * @returns {Series} Returns a single series that is the combination of multiple input series that have been 'zipped' together by the 'selector' function.
	 */
	zipSeries: function (series, selector) {
		return zip(series, selector, Series);
	},

	/**
	 * Zip together multiple data-frames to create a new data-frame.
	 *
	 * @param {array} dataFrames - Array of data-frames to zip together.
	 * @param {function} selector - Selector function that produces a new data-frame based on the input data-frames.
	 * 
	 * @returns {DataFrame} Returns a single dataframe that is the combination of multiple input dataframes that have been 'zipped' together by the 'selector' function.
	 */
	zipDataFrames: function (dataFrames, selector) {
		return zip(dataFrames, selector, DataFrame);
	},
};

module.exports = dataForge;