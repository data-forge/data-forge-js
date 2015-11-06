'use strict'

$(function() {
	
	//
	// Load as single CSV file containing share prices.
	//
	var loadFile = function (url) {
	
		return panjas
			.from(panjas.http(url))
			.as(panjas.csv());
	};

	//
	// Helper function for plotting.
	//
	var plot = function (id, dataFrame) {

		var data = E.from(dataFrame.getValues()) // Assume first column is date, second column is value to plot.
			.select(function (entry) {
				var dateStr = entry[0].toString();
				var date = moment(dateStr).toDate(); //todo: use auto date parsing.

				return [
					date.getTime(),
					entry[1]
				]; 
			})
			.toArray();

		$.plot(id, 
			[
				{
					label: "Close",
					data: data,
				}, 
			],
			{
				xaxis: { mode: "time" }
			}
		);
	};

	loadFile('share_prices.csv')
		.then(function (dataFrame) {
			//
			// Plot the data frame.
			//
			var subsetToPlot = dataFrame.getColumnsSubset(['Date', 'Close']);
			plot('#placeholder', subsetToPlot);
		})
		.catch(function (err) {
			console.error(err.stack);
		});
	
});
