The pipeline of operations should only be executed piece by piece.

Functions like 'readFileSync' should return an interator that chunk the file into pieces.

Functions like 'writeFileSync' should drive the iterator and write the file in pieces as well.

    dataForge.readFileSync(filePath)
        .asCSV()
        .select(row => transform(row))      // <-- This should cause the file to be read and processed incrementally, so it works for very large files.
        .writeFileSync(outputFilePath)
        ;

Does the same approach work for async data frames?

    dataForge.readFile(filePath)            // <-- Returns an async data frame.
        .asCSV()
        .select(row => transform(row))      // <-- How does this work with async?
        .writeFile(outputFilePath)          // <-- Maybe each 'next' of the iterator is a promise itself? That's the only way I can see this working.
        .then(() => {
            // Completed asyncrhonously.
        }))
        ;


Yes! An iterator for an async dataframe is promise operation. 'next' must complete asyncrhonously before the next data item is available.

I'm thinking this completely solves async data frames.
