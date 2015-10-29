'use strict';

var assert = require('chai').assert;

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
	//
	// Read a DataFrame from a plugable source.
	//
	from: function (dataSourcePlugin, sourceOptions) {
		assert.isObject(dataSourcePlugin, "Expected 'dataSourcePlugin' parameter to 'panjas.from' to be an object.");
		assert.isFunction(dataSourcePlugin.read, "Expected 'dataSourcePlugin' parameter to 'panjas.from' to be an object with a 'read' function.");
		
		return {
			as: function (formatPlugin, formatOptions) {
				assert.isObject(formatPlugin, "Expected 'formatPlugin' parameter to 'panjas.from' to be an object.");
				assert.isFunction(formatPlugin.from, "Expected 'formatPlugin' parameter to 'panjas.from' to be an object with a 'from' function.");
				
				return dataSourcePlugin.read(sourceOptions)
					.then(function (textData) {
						return formatPlugin.from(textData, formatOptions);						
					});		
			},		
		};
	},
	
	DataFrame: require('./src/dataframe'),
	LazyDataFrame: require('./src/lazydataframe'),
	Series: require('./src/series'),
	LazySeries: require('./src/lazyseries'),
	DateIndex: require('./src/dateindex'),
	NumberIndex: require('./src/numberindex'),
	LazyIndex: require('./src/lazyindex'),
	builder: require('./src/builder'),	
};

module.exports = panjas;