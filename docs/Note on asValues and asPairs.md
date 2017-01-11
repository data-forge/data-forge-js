Dealing with the asValues issue.

I have a work around for this now. In that asValues takes a constructor parameter and this is useful for restoring a DataFrame in the internal code.

It's not a great thing for users.

What is the ideal solution to this?

Should I make a rule that any series that contains JS object is a DataFrame?
That would certainly solve the problem.
It sounds difficult to implement though and can I keep it consistent?


    .asPairs()
    .. rewrite the index ...
    .asValues()


Is there another way entirely to think about the index?
The index is needed for merging.
It's very useful for the startAt/endAt style fns.
I can't just get rid of the index.
That would have been great but it's not possible.

I could probably also get rid of DataFrame.
But there is so much good stuff there.
And what is Data-Forge without the DataFrame?

Is there a change I could make that would make this problem irrelevant?


What is the purpose of asPairs?

- To be able to rewrite both index and value.
- To be able to filter on index.

Why do I need asValues?

- To get it back to a regular DataFrame or Series.
- I guess it can just remember what it was.
- Maybe I can create a seperate class Pairs that derives from Series.
- That way I can restrict asValues().
- And 'Pairs' can have special logic to revert back to what it came from.


    blah
        .asPairs() <-- Returns an instance of 'Pairs', derived from 'Series'. Records the current 'Constructor'.
        .select(...) <-- Write index/values.
        .asValues() <-- Only available on 'Pairs'. Remembers the previous 'Constructor'.

asValues -> restoreValues?

 

Directly wrapping a sequence might help with this...


    eg 

        .asPairs = function () {
            var self = this;
            return new Pairs(self); // Wrap one sequence with another.
        });

The problem is that every sequence has to wrap another....


    new Series(someOtherSeries, someModification)


It's almost like it needs some kind of internal pipeline.

It would work better if constructor was a factory rather than newable!!! 