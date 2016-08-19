var assert = require('chai').assert;
var E = require('linq');
var DataFrame = require('./dataframe');
var dropElement = require('./utils').dropElement;
var ArrayIterator = require('./iterators/array');

//
// Helper function to replicate a value.
//
var replicate = function (value, count) {
	var output = [];
	for (var i = 0; i < count; ++i) {
		output.push(value);
	}
	return output;
};

//
// Convert an object row to an array.
// todo: Feels like a bit of a hack to use this.
//
var toRow = function (row, columnNames) {
	return E.from(columnNames)
		.select(function (columnName) {
			return row[columnName];
		})
		.toArray();
};

/**
 * Merge data-frames by index or a particular column.
 * 
 * @param {DataFrame} leftDataFrame - One data frame to merge.
 * @param {DataFrame} rightDataFrame - The other data frame to merge.
 * @param {string} [columnName] - The name of the column to merge on. Optional, when not specified merge is based on the index.
 */
module.exports = function (leftDataFrame, rightDataFrame, columnName) {

	//todo: refactor and DRY the two code paths here.
	//todo: this probably just needs a rewrite so that multiple dataframes can be merged.

	assert.isObject(leftDataFrame, "Expected 'leftDataFrame' parameter to 'merge' to be an object.");
	assert.isObject(rightDataFrame, "Expected 'rightDataFrame' parameter to 'merge' to be an object.");

	if (columnName) {
		assert.isString(columnName, "Expected optional 'columnName' parameter to 'merge' to be a string.");

		var leftColumnIndex = leftDataFrame.getColumnIndex(columnName);
		if (leftColumnIndex < 0) {
			throw new Error("Column with name '" + columnName + "' doesn't exist in 'leftDataFrame'.");
		}

		var rightColumnIndex = rightDataFrame.getColumnIndex(columnName);
		if (rightColumnIndex < 0) {
			throw new Error("Column with name '" + columnName + "' doesn't exist in 'rightColumnIndex'.");
		}

		var leftPairs = leftDataFrame.toPairs();
		var rightPairs = rightDataFrame.toPairs();

		var mergedColumnNames = [columnName]
			.concat(dropElement(leftDataFrame.getColumnNames(), leftColumnIndex))
			.concat(dropElement(rightDataFrame.getColumnNames(), rightColumnIndex));

		var leftColumns = leftDataFrame.getColumnNames();
		var rightColumns = rightDataFrame.getColumnNames();

		var leftIndices = E.from(leftPairs)
			.select(function (leftPair) {
				return leftPair[1][leftColumns[leftColumnIndex]];
			})
			.toArray();
		var rightIndices = E.from(rightPairs)
			.select(function (rightPair) {
				return rightPair[1][rightColumns[rightColumnIndex]];
			})
			.toArray();

		var distinctIndices = E.from(leftIndices.concat(rightIndices)).distinct().toArray();

		var leftMap = E.from(leftPairs)
			.groupBy(function (leftPair) {
				return leftPair[1][leftColumns[leftColumnIndex]];
			})
			.toObject(
				function (group) {
					return group.key();
				},
				function (group) {
					return group.getSource();
				}
			);

		var rightMap = E.from(rightPairs)
			.groupBy(function (rightPair) {
				return rightPair[1][rightColumns[rightColumnIndex]];
			})
			.toObject(
				function (group) {
					return group.key();
				},
				function (group) {
					return group.getSource();
				}
			);

		var outputIndices = [];

		var mergedValues = E.from(distinctIndices) // Merge values, drop index.
			.selectMany(function (index) {
				var leftPairs = leftMap[index] || [];
				var rightPairs = rightMap[index] || [];
				var outputRows = [];

				if (leftPairs.length > 0) {
					leftPairs.forEach(function (leftPair) {
						assert.isArray(leftPair);

						if (rightPairs.length > 0) {
							
							rightPairs.forEach(function (rightPair) {
								assert.isArray(rightPair);

								var leftValues = dropElement(toRow(leftPair[1], leftColumns), leftColumnIndex);
								var rightValues = dropElement(toRow(rightPair[1], rightColumns), rightColumnIndex);
								var outputRow = [index]
									.concat(leftValues)
									.concat(rightValues)
									;

								outputIndices.push(leftPair[0]);
								outputRows.push(outputRow);
							});
						}
						else {
							var leftValues = dropElement(toRow(leftPair[1], leftColumns), leftColumnIndex);
							var rightValues = replicate(undefined, rightColumns.length-1);
							var outputRow = [index]
								.concat(leftValues)
								.concat(rightValues)
								;

							outputIndices.push(leftPair[0]);
							outputRows.push(outputRow);
						}
					});						
				}
				else {
					rightPairs.forEach(function (rightPair) {
						assert.isArray(rightPair);

						var leftValues = replicate(undefined, leftColumns.length-1);
						var rightValues = dropElement(toRow(rightPair[1], rightColumns), rightColumnIndex);
						var outputRow = [index]
							.concat(leftValues)
							.concat(rightValues)
							;
						
						outputIndices.push(rightPair[0]);
						outputRows.push(outputRow);
					});
				}

				return outputRows;
			})
			.toArray();

		return new DataFrame({
			columnNames: mergedColumnNames,
			values: function () {
				return new ArrayIterator(mergedValues);
			},
			index: outputIndices,
		});			
	}
	else {
		var leftPairs = leftDataFrame.toPairs();
		var rightPairs = rightDataFrame.toPairs();

		var leftColumns = leftDataFrame.getColumnNames();
		var rightColumns = rightDataFrame.getColumnNames();
		var mergedColumnNames = leftColumns.concat(rightColumns);

		var leftIndices = leftDataFrame.getIndex().toValues();
		var rightIndices = rightDataFrame.getIndex().toValues();
		var distinctIndices = E.from(leftIndices.concat(rightIndices)).distinct().toArray();

		var leftMap = E.from(leftPairs)
			.groupBy(function (leftPair) {
				return leftPair[0];
			})
			.toObject(
				function (group) {
					return group.key();
				},
				function (group) {
					return group.getSource();
				}
			);

		var rightMap = E.from(rightPairs)
			.groupBy(function (rightPair) {
				return rightPair[0];
			})
			.toObject(
				function (group) {
					return group.key();
				},
				function (group) {
					return group.getSource();
				}
			);

		var outputIndices = [];

		var mergedValues = E.from(distinctIndices) 
			.selectMany(function (index) {
				var leftPairs = leftMap[index] || [];
				var rightPairs = rightMap[index] || [];
				var outputRows = [];

				if (leftPairs.length > 0) {
					leftPairs.forEach(function (leftPair) {
						assert.isArray(leftPair);

						if (rightPairs.length > 0) {
							
							rightPairs.forEach(function (rightPair) {
								assert.isArray(rightPair);

								outputIndices.push(index);

								var outputRow = [];

								leftColumns.forEach(function (leftColumnName) {
									outputRow.push(leftPair[1][leftColumnName]);
								});

								rightColumns.forEach(function (rightColumnName) {
									outputRow.push(rightPair[1][rightColumnName]);
								});

								outputRows.push(outputRow);
							});
						}
						else {
							outputIndices.push(index);

							var outputRow = [];

							leftColumns.forEach(function (leftColumnName) {
								outputRow.push(leftPair[1][leftColumnName]);
							});

							for (var i = 0; i < rightColumns.length; ++i) {
								outputRow.push(undefined);
							}

							outputRows.push(outputRow);
						}
					});
				}
				else {
					rightPairs.forEach(function (rightPair) {
						assert.isArray(rightPair);

						outputIndices.push(index);

						var outputRow = [];

						for (var i = 0; i < leftColumns.length; ++i) {
							outputRow.push(undefined);
						}

						rightColumns.forEach(function (rightColumnName) {
							outputRow.push(rightPair[1][rightColumnName]);
						});

						outputRows.push(outputRow);
					});
				}

				return outputRows;
			})
			.toArray();

		return new DataFrame({
			columnNames: mergedColumnNames,
			values: function () {
				return new ArrayIterator(mergedValues);
			},
			index: outputIndices,
		});			
	}

};