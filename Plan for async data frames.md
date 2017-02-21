This is my plan to support asynchronous (unresolved) dataframes.

I want to be able to do something like this:

    dataForge.fromMongoDB()
        .head(5)                // This should be passed through to the query.
        .resolve()
        .then(dataFrame => {
            // Now have a data frame with 
        })


Or this:

    dataForge.fromMongoDB(inUrl)
        .select(row => transform(row))
        .toMongoDB(outUrl)
        .then(() => {
            // Completed!!
        })

Or 

    dataForge.fromMongoDB()
        .toArray()
        .then(array => {
            // Baking operations normally in Data-Forge should return a promise for an async dataframe.
        })        


This requires new classes: AsyncDataFrame and AsyncSeries.

Then I can have overriden functions.

Normal functions, eg 'select' should just come from the base class.

These need to be retro fitted to build some kind of AST.