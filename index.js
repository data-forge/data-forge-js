'use strict';

var assert = require('chai').assert;
var E = require('linq');
var dropElement = require('./src/utils').dropElement;

/**
 * Main namespace for Panjas.
 * 
 * Nodejs:
 * 
 * 		npm install --save panjas
 * 		
 * 		var panjas = require('panjas');
 * 
 * Browser:
 * 
 * 		bower install --save panjas
 * 
 * 		<script language="javascript" type="text/javascript" src="bower_components/panjas.js"></script>
 */
var panjas = {
	
	DataFrame: require('./src/dataframe'),
	LazyDataFrame: require('./src/lazydataframe'),
	Column: require('./src/column'),
	LazyColumn: require('./src/lazycolumn'),
	builder: require('./src/builder'),	
	Index: require('./src/index'),

	/**
	 * Read a DataFrame from a plugable data source.
	 */
	from: function (dataSourcePlugin) {
		assert.isObject(dataSourcePlugin, "Expected 'dataSourcePlugin' parameter to 'panjas.from' to be an object.");
		assert.isFunction(dataSourcePlugin.read, "Expected 'dataSourcePlugin' parameter to 'panjas.from' to be an object with a 'read' function.");
		
		return {
			/**
			 * Convert DataFrame from a particular data format using a plugable format.
			 */
			as: function (formatPlugin) {
				assert.isObject(formatPlugin, "Expected 'formatPlugin' parameter to 'panjas.from' to be an object.");
				assert.isFunction(formatPlugin.from, "Expected 'formatPlugin' parameter to 'panjas.from' to be an object with a 'from' function.");
				
				return dataSourcePlugin.read()
					.then(function (textData) {
						return formatPlugin.from(textData);
					});		
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
};

module.exports = panjas;