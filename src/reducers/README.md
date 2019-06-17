InterPro7 Reducer
====

The file [index.js](./index.js) in this folder exports the reducer function used in the App store of our website.

The 1-level-depth object in our app store looks like this:
```javascript
{
  "custom-location": {},
  "download": {},
  "jobs": {},
  "status": {},
  "ui": {},
  "data-progress": {},
  "settings": {},
  "toasts": {}
}
```
Each of the folders here is incharge of a section of the reducer and it gets aggreageted in the index via `combineReducers()`.

All the action types used to create the reducers are defined in [/src/actions/types/index.js](/src/actions/types/index.js)
