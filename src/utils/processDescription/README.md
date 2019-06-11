processDescription
====

The files in this folder implement the in-house router of the interpro-client app.

#### URL => App State => Content
When a user accesses the website using a URL to get to a particular resource (e.g. https://www.ebi.ac.uk/interpro/beta/entry/InterPro/IPR000001/), the URL is mapped to a location object in the App (redux) state. The change in state propagates a series of updates in the react components, so that the content of the page is updated with the requested information.

#### App State => URL => Content
Similarly, if a value is changed in the location structure of the App state, it also changes the current URL (without refreshing the page). This implies that links in the website are implemented as _redux actions_ instead of default redirects of a `<a>` element. See [Link Component](/src/components/generic/Link/).


The data structure
----

The file in [emptyDescription](emptyDescription/index.js) creates the empty structure to represent a location in the InterPro website. This data structure has been design to represent all the pages of the website excluding any URL parameters and hashes.

You can find the processed description of any page in the redux state, by checking `{ customLocation: {description} }`.
For example in the page for https://www.ebi.ac.uk/interpro/beta/entry/InterPro/IPR000001/, the value for `description` in the redux state is something like:
```javascript
{
  customLocation: {
    description: {
      main: {
        key: 'entry',
        numberOfFilters: 0
      },
      entry: {
        isFilter: null,
        integration: null,
        db: 'InterPro',
        accession: 'IPR000001',
        memberDB: null,
        memberDBAccession: null,
        detail: null,
        order: null
      },
...
```

In order to read this structure, first check the value of the `main` object, in the example above the `key` to check is `entry` and no filters have been applied to it, which means that we can reconstruct the URL by just checking the object in `entry`. Therefore we can deduce that the URL should start with `/entry`.

Further checks in the object `entry`, shows that its `db` is `"InterPro"` and the `accession` is `"IPR000001"`, all the other values are null, and therefore the object corresponds to the URL `/entry/InterPro/IPR000001` as expected.

The `numberOfFilters` indicates whether it is necessary to check other parts of the description, besides the one tagged in `main:{key}`. For example, if we have `main: { key: 'entry', numberOfFilters: 1 }`, the next step after prcessing the object entry, is to check which of the other objects has the flag `isFilter` set to `true`. Continuing with the example, let's assume we receive this:
```javascript
...
      protein: {
        isFilter: true,
        db: 'UniProt',
        accession: null,
        detail: null,
        order: 1
      },
...
```
This then implies that the URL should include `/protein/UniProt/` which together with the main object will give us: `/entry/InterPro/IPR000001/protein/UniProt/`.

**NOTE:** If the `numberOfFilters` is bigger than one, the procedure is the same for all the filters, only taking into account the value of `order` on each filter, to include the filter in the URL.


handlers
----
In order to be able to walk through the tree of possible URLs in the website, we define a structure representing a directed graph of possible URL nodes. This is called the of `handler` to each of these nodes. And it is defined in this [file](handlers/index.js). 

For an explanation of the class attributes of a Handler, see the inline comments [here](handlers/index.js#L96).

The `handle` method of a `handler` is responsible for taking the fragment of the URL that corresponds to the handler and mutating the description object to include that information, and then checking if the next part of the URL, matches any of its children. If so, it invokes the `handle` method of the matching child.

Each handler defines its children, which correspond to the valid handler to deal with the next part of a URL. For example, the `rootHandler` represents the URL `"/"` and its children are defined [here](handlers/index.js#L877).


pathToDescription
----
This functions takes a URL path as a string and returns the corresponding description object.

This file is pretty simple, as most of its logic is delegated to the handlers:

* It calls the handler of the `rootHandler`, if ecverything goes alright it returns the description object with all the changes done by `rootHandler` and its children. 

* If there is an error in the process, it assumes that the handler then is `otherHandler` and process the rest of the URL that way.


descriptionItemToHandlers
----

A `Map` of all possible keys in a description with its potential handlers.


descriptionToDescription
----

It takes a description object that doesn't include null values, and returns the description object making sure it includes all the attributes, even when their value is `null`. While doing this mapping it verifies that the given description is valid, by checking the existence of the matching handlers.
You can check the inline comments to see the execution logic [file](descriptionToDescription/index.js). 


descriptionToPath
----
Creates the URL string that represents the description object. It first uses the descriptionToDescription object to make sure it is valid and it contains all the parts of the object, and then seralized the object as a URL.
