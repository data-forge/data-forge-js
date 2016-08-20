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
 */
var dataForge = {
	
	/**
	 * Constructor for DataFrame.
	 *
	 * @param {object} config - Specifies content and configuration for the DataFrame.
	 */
	DataFrame: DataFrame,

	/**
	 * Constructor for Series.
	 *
	 * @param {object} config - Specifies content and configuration for the Series.
	 */
	Series: Series,

	/**
	 * Install a plugin in the dataForge namespace.
	 */
	use: function (plugin) {

		assert.isFunction(plugin, "Expected 'plugin' parameter to 'use' to be a function.");

		if (registeredPlugins[plugin] === plugin) {
			return; // Already registered.
		}

		registeredPlugins[plugin] = plugin;

		var self = this;
		plugin(self);
	},


	/**
	 * Deserialize a DataFrame from a JSON text string.
	 *
	 * @param {string} jsonTextString - The JSON text to deserialize.
	 * @param {config} [config] - Optional configuration option to pass to the DataFrame.
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

	//
	// Deserialize a DataFrame from a CSV text string.
	//
	fromCSV: function (csvTextString, config) {
		assert.isString(csvTextString, "Expected 'csvTextString' parameter to 'dataForge.fromCSV' to be a string containing data encoded in the CSV format.");

		if (config) {
			assert.isObject(config, "Expected 'config' parameter to 'dataForge.fromJSON' to be an object with configuration to pass to the DataFrame.");
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
				
		var columnNames = E.from(E.from(rows).first())
				.select(function (columnName) {
					return columnName.trim();
				})
				.toArray();

		var remaining = E.from(rows)
			.skip(1)
			.select(function (row) {
				return E.from(row)
					.select(function (cell) {
						return cell.trim();
					})
					.toArray()
			})
			.toArray();

		var baseConfig = {
			columnNames: columnNames, 
			values: remaining,
		};
		var dataFrameConfig = extend({}, config || {}, baseConfig);
		return new dataForge.DataFrame(dataFrameConfig);
	},

	/**
	 * Merge data-frames by index or a particular column.
	 * 
	 * @param {DataFrame} leftDataFrame - One data frame to merge.
	 * @param {DataFrame} rightDataFrame - The other data frame to merge.
	 * @param {string} [columnName] - The name of the column to merge on. Optional, when not specified merge is based on the index.
	 */
	merge: require('./src/merge-dataframes.js'),

	/**
	 * Merge multiple series into a new DataFrame.
	 * 
	 * @param {array} columnNames - Array of strings that defines the column names for the resulting DataFrame. Must have the same number of elements as the 'series' parameter.
	 * @param {array} series - Array of series that defined the values for the columns. Must have the same number of elements as the 'columnNames' parameter.
	 */
	mergeSeries: require('./src/merge-series'),

	/**
	 * Concatenate multiple dataframes into a single dataframe.
	 *
	 * @param {array} dataFrames - Array of dataframes to concatenate. 
	 */
	concat: require('./src/concat-dataframes'),

	/**
	 * Concatenate multiple series into a single series.
	 * 
	 * @param {array} series - Array of series to concatenate. 
	 */
	concatSeries: require('./src/concat-series'),

	/**
	 * Generate a series from a range of numbers.
	 *
	 * @param {int} start - The value of the first number in the range.
	 * @param {int} count - The number of sequential values in the range.
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
	 */
	zipSeries: require('./src/zip-series'),

	/**
	 * Zip together multiple data-frames to create a new data-frame.
	 *
	 * @param {array} dataFrames - Array of data-frames to zip together.
	 * @param {function} selector - Selector function that produces a new data-frame based on the input data-frames.
	 */
	zip: require('./src/zip-dataframes'),	
};

module.exports = dataForge;