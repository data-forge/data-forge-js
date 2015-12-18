'use strict';

var assert = require('chai').assert;
var E = require('linq');
var dropElement = require('./src/utils').dropElement;
var ArrayEnumerator = require('./src/enumerators/array');
require('sugar');

var DataFrame = require('./src/dataframe');

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
	
	DataFrame: DataFrame,
	LazyDataFrame: require('./src/lazydataframe'),
	Column: require('./src/column'),
	LazyColumn: require('./src/lazycolumn'),
	Index: require('./src/index'),
	LazyIndex: require('./src/lazyindex'),

	/**
	 * Deserialize a data frame from a JSON text string.
	 */
	fromJSON: function (jsonTextString) {
		assert.isString(jsonTextString, "Expected 'jsonTextString' parameter to 'dataForge.fromJSON' to be a string containing data encoded in the JSON format.");

		return new DataFrame({
				rows: JSON.parse(jsonTextString)
			});
	},

	//
	// Deserialize a data from a CSV text string.
	//
	fromCSV: function (csvTextString) {
		assert.isString(csvTextString, "Expected 'csvTextString' parameter to 'dataForge.fromCSV' to be a string containing data encoded in the CSV format.");
		
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

		if (rows.length === 0) {
			return new dataForge.DataFrame({ columnNames: [], rows: [] });
		}
				
		var header = E.from(rows).first();
		var remaining = E.from(rows).skip(1).toArray();
		return new dataForge.DataFrame({
				columnNames: header, 
				rows: remaining
			});
	},

	/**
	 * Merge data frames by index or a particular column.
	 * 
	 * @param {DataFrame} leftDataFrame - One data frame to merge.
	 * @param {DataFrame} rightDataFrame - The other data frame to merge.
	 * @param {string} [columnName] - The name of the column to merge on. Optional, when not specified merge is based on the index.
	 */
	merge: function (leftDataFrame, rightDataFrame, columnName) {
		var LazyDataFrame = require('./src/lazydataframe'); //todo: don't included this way.

		assert.isObject(leftDataFrame, "Expected 'leftDataFrame' parameter to 'merge' to be an object.");
		assert.isObject(rightDataFrame, "Expected 'rightDataFrame' parameter to 'merge' to be an object.");

		if (columnName) {
			assert.isString(columnName, "Expected optional 'columnName' parameter to 'merge' to be a string.");
		}

		var leftColumnIndex = leftDataFrame.getColumnIndex(columnName);
		if (leftColumnIndex < 0) {
			throw new Error("Column with name '" + columnName + "' doesn't exist in 'leftDataFrame'.");
		}

		var rightColumnIndex = rightDataFrame.getColumnIndex(columnName);
		if (rightColumnIndex < 0) {
			throw new Error("Column with name '" + columnName + "' doesn't exist in 'rightColumnIndex'.");
		}

		var leftRows = leftDataFrame.toValues();
		var rightRows = rightDataFrame.toValues();

		var mergedValues = E.from(leftRows) // Merge values, drop index.
			.selectMany(function (leftRow) {
				return E
					.from(rightRows)
					.where(function (rightRow) {
						return leftRow[leftColumnIndex] === rightRow[rightColumnIndex];
					})
					.select(function (rightRow) {
						var left = dropElement(leftRow, leftColumnIndex);
						var right = dropElement(rightRow, rightColumnIndex);
						return [leftRow[leftColumnIndex]].concat(left).concat(right);
					});
			})
			.toArray();

		return new LazyDataFrame(
			function () {
				return ['key', 'lval', 'rval'];
			},
			function () {
				return new ArrayEnumerator(mergedValues);
			}
		);
	},

	/**
	 * Concatenate multiple data frames into a single.
	 *
	 * @param {array} dataFrames - Array of data frames to concatenate.
	 */
	concat: function (dataFrames) {
		assert.isArray(dataFrames, "Expected 'dataFrames' parameter to 'dataForge.concat' to be an array of data frames.");

		var concatenateColumns = function () {
			return E.from(dataFrames)
				.selectMany(function (dataFrame) {
					return dataFrame.getColumnNames();
				})
				.distinct()
				.toArray();
		};

		var LazyDataFrame = require('./src/lazydataframe');
		return new LazyDataFrame(
			function () {
				return concatenateColumns();
			},
			function () {
				var concatenatedColumns = concatenateColumns();
				return new ArrayEnumerator(
					E.from(dataFrames)
						.selectMany(function (dataFrame) {
							return dataFrame
								.remapColumns(concatenatedColumns)
								.toValues();
						})
						.toArray()
				);
			},
			function () {
				var LazyIndex = require('./src/lazyindex');
				return new LazyIndex(
					"__concatenated__",
					function () {
						return new ArrayEnumerator(E.from(dataFrames)
							.selectMany(function (dataFrame) {
								return dataFrame.getIndex().toValues();
							})
							.toArray()
						);
					}
				)
			}
		);
	},
};

module.exports = dataForge;