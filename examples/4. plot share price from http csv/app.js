'use strict'

$(function() {
	
	//
	// Get CSV data via HTTP.
	//
    var get = function (url) {
        return new Promise(function (resolve, reject) {
            $.get(url)
                .done(function (data) {
                    resolve(data);
                })
                .fail(function (err) {
                    reject(err);
                });
        });
    };

	//
	// Load as single CSV file containing share prices.
	//
	var loadCSV = function (url) {
		return get(url)
			.then(function (csv) {
				return dataForge.fromCSV(csv);
			})
			.then(function (dataFrame) {
				return dataFrame.parseDates('Date');
			});
	};

	//
	// Helper function for plotting.
	//
	var plot = function (id, dataFrame) {
		var data = E.from(dataFrame.toObjects()) // Assume first column is date, second column is value to plot.
			.select(function (entry) {
				return [
					entry.Date.getTime(),
					entry.Close
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

	loadCSV('share_prices.csv')
		.then(function (dataFrame) {
			//
			// Plot the data frame.
			//
			var subsetToPlot = dataFrame.subset(['Date', 'Close']);
			plot('#placeholder', subsetToPlot);
		})
		.catch(function (err) {
			console.error(err.stack);
		});
	
});
