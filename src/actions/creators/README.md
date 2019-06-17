Action creators
====

The file index.js is a collection of functions that can be used with the object shorthand form of the `mapDispatchToProps` parameter of the `connect()` function from [react-redux](https://react-redux.js.org/api/connect).

When using with `connect()` the actions are already bind to `dispatch()`, so if you "connect" the function to your code, you could use it directly, triggering a dispatch wich in turn will modify the app state via reducers.

The functions defined here use the action types defined in [/src/actions/types](/src/actions/types).
