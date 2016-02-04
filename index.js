'use strict';

var assert = require('chai').assert;
var E = require('linq');
var dropElement = require('./src/utils').dropElement;
var ArrayIterator = require('./src/iterators/array');
var ConcatIterator = require('./src/iterators/concat');
require('sugar');
var BabyParse = require('babyparse');

var DataFrame = require('./src/dataframe');
var Index = require('./src/index');

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
	Series: require('./src/series'),
	Index: Index,

	/**
	 * Install a plugin in the dataForge namespace.
	 */
	use: function (plugin) {

		assert.isFunction(plugin, "Expected 'plugin' parameter to 'use' to be a function.");

		var self = this;
		plugin(self);
	},


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
	fromCSV: function (csvTextString, config) {
		assert.isString(csvTextString, "Expected 'csvTextString' parameter to 'dataForge.fromCSV' to be a string containing data encoded in the CSV format.");

		var parsed = BabyParse.parse(csvTextString, config);
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
			return new dataForge.DataFrame({ columnNames: [], rows: [] });
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
		return new dataForge.DataFrame({
				columnNames: columnNames, 
				rows: remaining
			});
	},

	/**
	 * Merge data-frames by index or a particular column.
	 * 
	 * @param {DataFrame} leftDataFrame - One data frame to merge.
	 * @param {DataFrame} rightDataFrame - The other data frame to merge.
	 * @param {string} [columnName] - The name of the column to merge on. Optional, when not specified merge is based on the index.
	 */
	merge: function (leftDataFrame, rightDataFrame, columnName) {
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

		var mergedColumnNames = [columnName]
			.concat(dropElement(leftDataFrame.getColumnNames(), leftColumnIndex))
			.concat(dropElement(rightDataFrame.getColumnNames(), rightColumnIndex));

		var rightMap = E.from(rightRows)
			.groupBy(function (rightRow) {
				return rightRow[rightColumnIndex];
			})
			.toObject(
				function (group) {
					return group.key();
				},
				function (group) {
					return group.getSource();
				}
			);

		var mergedValues = E.from(leftRows) // Merge values, drop index.
			.selectMany(function (leftRow) {
				var rightRows = rightMap[leftRow[leftColumnIndex]] || [];
				return E.from(rightRows)
					.select(function (rightRow) {
						var combined = [leftRow[leftColumnIndex]];
						
						for (var i = 0; i < leftRow.length; ++i) {
							if (i !== leftColumnIndex) {
								combined.push(leftRow[i]);
							}
						}

						for (var i = 0; i < rightRow.length; ++i) {
							if (i !== rightColumnIndex) {
								combined.push(rightRow[i]);
							}
						}

						return combined;
					});
			})
			.toArray();

		return new DataFrame({
			columnNames: mergedColumnNames,
			rows: {
				getIterator: function () {
					return new ArrayIterator(mergedValues);
				},
			},
		});
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

		return new DataFrame({
			columnNames: concatenateColumns(),
			rows: {
				getIterator: function () {
					var concatenatedColumns = concatenateColumns();
					return new ArrayIterator(
						E.from(dataFrames)
							.selectMany(function (dataFrame) {
								return dataFrame
									.remapColumns(concatenatedColumns)
									.toValues();
							})
							.toArray()
					);
				},
			},
			index: new Index({
				getIterator: function () {
					var indexes = E.from(dataFrames)
						.select(function (dataFrame) {
							return dataFrame.getIndex();
						})
						.toArray();
					return new ConcatIterator(indexes);
				},
			}),
		});
	},
};

module.exports = dataForge;