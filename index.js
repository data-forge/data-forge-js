'use strict';

var assert = require('chai').assert;

module.exports = {
	
	//
	// Read a DataFrame from a plugable source.
	//
	from: function (plugin, filePath, options) {
		assert.isObject(plugin, "Expected 'plugin' parameter to 'panjas.from' to be an object.");
		assert.isFunction(plugin.from, "Expected 'plugin' parameter to 'panjas.from' to be an object with a 'from' function.");
		assert.isString(filePath, "Expected 'filePath' parameter to 'panjas.from' to be a string.");
		
		return plugin.from(filePath, options);
	},
	
	DataFrame: require('./dataframe'),
	LazyDataFrame: require('./lazydataframe'),
	Series: require('./series'),
	LazySeries: require('./lazyseries'),
};