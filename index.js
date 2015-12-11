'use strict';

var assert = require('chai').assert;
var E = require('linq');
var dropElement = require('./src/utils').dropElement;
require('sugar');

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
	
	DataFrame: require('./src/dataframe'),
	LazyDataFrame: require('./src/lazydataframe'),
	Column: require('./src/column'),
	LazyColumn: require('./src/lazycolumn'),
	Index: require('./src/index'),
	LazyIndex: require('./src/lazyindex'),

	/**
	 * Read a DataFrame asynchronously from a plugable data source.
	 */
	from: function (dataSourcePlugin) {
		assert.isObject(dataSourcePlugin, "Expected 'dataSourcePlugin' parameter to 'dataForge.from' to be an object.");
		assert.isFunction(dataSourcePlugin.read, "Expected 'dataSourcePlugin' parameter to 'dataForge.from' to be an object with a 'read' function.");
		
		return {
			/**
			 * Convert DataFrame from a particular data format using a plugable format.
			 */
			as: function (formatPlugin) {
				assert.isObject(formatPlugin, "Expected 'formatPlugin' parameter to 'dataForge.from' to be an object.");
				assert.isFunction(formatPlugin.from, "Expected 'formatPlugin' parameter to 'dataForge.from' to be an object with a 'from' function.");
				
				return dataSourcePlugin.read()
					.then(function (textData) {
						return formatPlugin.from(textData);
					});		
			},		
		};
	},

	/**
	 * Read a DataFrame synchronously from a plugable data source.
	 */
	fromSync: function (dataSourcePlugin) {
		assert.isObject(dataSourcePlugin, "Expected 'dataSourcePlugin' parameter to 'dataForge.from' to be an object.");
		assert.isFunction(dataSourcePlugin.readSync, "Expected 'dataSourcePlugin' parameter to 'dataForge.from' to be an object with a 'readSync' function.");
		
		return {
			/**
			 * Convert DataFrame from a particular data format using a plugable format.
			 */
			as: function (formatPlugin) {
				assert.isObject(formatPlugin, "Expected 'formatPlugin' parameter to 'dataForge.from' to be an object.");
				assert.isFunction(formatPlugin.from, "Expected 'formatPlugin' parameter to 'dataForge.from' to be an object with a 'from' function.");
				
				return formatPlugin.from(dataSourcePlugin.readSync());
			},		
		};
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

		var leftRows = leftDataFrame.getValues();
		var rightRows = rightDataFrame.getValues();

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
				return mergedValues;
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

				return E.from(dataFrames)
					.selectMany(function (dataFrame) {

						var columnNames = dataFrame.getColumnNames();

						return E.from(dataFrame.getValues())
							.select(function (row) {
								var columnValueMap = E.from(columnNames)
									.select(function (columnName, columnIndex) {
										return [columnName, row[columnIndex]];
									})
									.toObject(
										function (pair) {
											return pair[0];

										},
										function (pair) {
											return pair[1];									
										}
									);

								return E.from(concatenatedColumns)
									.select(function (columnName) {
										return columnValueMap[columnName];
									})
									.toArray();
							})
							.toArray();

						/*todo:
						return dataFrame
							.remapColumns(concatenatedColumns)
							.getValues();
						*/
					})
					.toArray();
			},
			function () {
				var LazyIndex = require('./src/lazyindex');
				return new LazyIndex(
					"__concatenated__",
					function () {
						return E.from(dataFrames)
							.selectMany(function (dataFrame) {
								return dataFrame.getIndex().getValues();
							})
							.toArray();
					}
				)
			}
		);
	},
};

module.exports = dataForge;