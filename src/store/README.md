InterPro7 App Store
====

The global data store of InterPro7 is managed using [redux](https://redux.js.org) and [react-redux](https://react-redux.js.org/).

The app store is created in [index.js](./index.js) using the browser history any client stored setting to generate the initial state (see [get-initial-state](./utils/get-initial-state)).

The other elements included when creating the store are the reducer function which is defined in [/src/reducers](/src/reducers), and the store enhancers in [./enhancers](./enhancers).

These are the different parts of our source code that are directly related with the usage of react-redux:
* Reducers: [/src/reducers](/src/reducers)
* Action Types: [/src/actions/types/index.js](/src/actions/types/index.js)
* Action Creators: [/src/actions/creators](/src/actions/creators)
