'use strict';

var assert = require('chai').assert;
var E = require('linq');
var DataFrame = require('./dataframe');

/*
 * Zip together multiple data-frames to create a new data-frame.
 *
 * @param {array} dataFrames - Array of data-frames to zip together.
 * @param {function} selector - Selector function that produces a new data-frame based on the input data-frames.
 */
module.exports = function (dataFrames, selector) {

	assert.isArray(dataFrames, "Expected 'dataFrames' parameter to zipDataFrames to be an array of Series objects.");
	assert.isFunction(selector, "Expected 'selector' parameter to zipDataFrames to be a function.");

	//todo: make this lazy.

	var dataFrameContents = E.from(dataFrames)
		.select(function (dataFrame) {
			return dataFrame.toValues();
		})
		.toArray();

	var length = E.from(dataFrameContents).select(function (objects) { 
			return objects.length; 
		})
		.min();

	var output = [];

	for (var i = 0; i < length; ++i) {
		var curElements = E.from(dataFrameContents)
			.select(function (objects) {
				return objects[i];
			})
			.toArray();
		output.push(selector(curElements));
	}

	return new DataFrame({
		index: dataFrames[0].getIndex(),
		values: output,
	});
};