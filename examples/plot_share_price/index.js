'use strict';

var panjas = require("../../index.js");
var csv = require('../../fmt/csv');
var file = require('../../datasource/file');

var glob = require('glob');
var E = require('linq');
var assert = require('chai').assert;
var highcharts = require('node-highcharts');

//
// Load as single CSV file containing share prices.
//
var loadFile = function (filePath) {
	assert.isString(filePath);
	
	return panjas.from(file, filePath).as(csv);
};

//
// Plot a graph from the data frame.
//
var plot = function (dataFrame, outputFilePath) {
	assert.isObject(dataFrame);
	assert.isString(outputFilePath);

	return new Promise(function (resolve, reject) {

		var data = E.from(dataFrame.subset(['Date', 'Close']).values())
			.select(function (entry) {
				return [entry[0].getTime(), entry[1]];
			})
			.toArray();

		var options = {
	        chart: {
	            width: 300,
	            height: 300,
	            defaultSeriesType: 'line'
	        },
	        legend: {
	            enabled: false
	        },
	        title: {
	            text: 'Example chart rendered from NodeJS'
	        },
	        series: [{
	            data: data
	        }]
	    };

		highcharts.render(options, function(err, data) {
		    if (err) {
		        reject(err);
		        return;
		    }

	        fs.writeFile(outputFilePath, data, function(err) {
	        	if (err) {
	        		reject(err);
	        		return;
	        	}

		        resolve();
	        });
		});    
	});
};

loadFile('share_prices.csv')
	.then(function (dataFrame) {
		return plot(dataFrame, 'output.png');		
	})
	.catch(function (err) {
		console.error(err.stack);
	});
