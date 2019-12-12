Store Enhancer
===

Redux provides a way to extend the normal flow of data in the store called [middleware](https://redux.js.org/advanced/middleware). Multiple middlewares can be turned into a pipeline through the `applyMiddleware()` enhancer.

Basically, a _middleware_ intercepts all the dispatched actions, before the root reducer gets executed.

We are implementing 4 _middlewares_:
* `download-middleware`:
* `jobs-middleware`:
* `location-middleware`:
* `status-middleware`: