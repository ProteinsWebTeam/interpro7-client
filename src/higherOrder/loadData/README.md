loadData()
==========

`loadData` is a high order comoponent that asyncronously injects data in a wrapped component.

I uses the the adapted versions of `fetch` tha are in [/src/utils/cached-fetch](/src/utils/cached-fetch).


loadData returns a function that receives a component and returns it wrapped with the React logic to load the data as a _prop_.

So if for example you have a component `YourComponent` and wants to use data from `http://your.api/call`, you can use loadData in the following way:
```javascript
const getURL = () => "http://your.api/call";
const componentWrapper = loadData(getURL);
const ComponentWrapped = componentWrapper(YourComponent);
return ComponentWrapped;
```
Or the short notation:
```javascript
return loadData(() => "http://your.api/call")(YourComponent);
```


This will pass the _prop_ `data` to `YourComoponent`. `data` is an object with the following attributes:

 * **loading:** A boolean indicating if the request has been responded or if is still in process.
 * **progress:** A float from 0 to 1 indicating the progress of the request, where 1 mean it is completed.
 * **ok:** A boolean indicating if the request has end up in an error (`false`) or everything went OK(`true`)
 * **status:** The HTTP code of the response.
 * **payload:** The body of the response. Notice that if for example the `fetch` used is `cachedFetchJSON` this payload is already parsed.
 * **url:** The original URL requested.

The above usage of the `loadData` function only supplies the getURL parameter, but loadData has several more parameters:

 * **getUrl:** A function that should return the URL(as a string) to request. This function receives as parameters the App state(AKA redux state), and the _props_.
 * **fetchOptions:** Options to pass to the `fetch` function. See more in [/src/utils/cached-fetch](/src/utils/cached-fetch).
 * **propNamespace:** Suffix to add to the `data` prop in the wrapped component, so if `propNamespace:EXT` the prop will be `dataEXT`. Useful to be able to embed a comopnent in multiple `loadData`.
 * **weight:** 
 * **mapStateToProps:** `loadData` uses internally a `connect` in order to get the app state. This parameter allows to reuse that `connect` to get values from the stateApp to be included as _props_ in the Component.
 * **mapDispatchToProps:** Similar to above, but to get Actions to interact with the App state.
 
 
See the [/src/components/MemberDBSelector/index.js#L420](MemberDBSelector) comopnent for an example of multiple `loadData` using most of its parameters.
