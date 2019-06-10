processDescription
====

The files in this folder implement the in-house router of the interpro-client app.

#### URL => App State => Content
When a user access the website using a URL to get directed to a particular resource (e.g. https://www.ebi.ac.uk/interpro/beta/entry/InterPro/IPR000001/) this URL is mapped into a location object in the App(redux) state. The change in the state propagates a series of updates in the react components, so the content of the page gets updated with the requested information.

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

In order to read this structure, firts check what is the value of the `main` object, in this case it says that the `key` to check is `entry` and that there are not filters applied to it, which means that we can reconstruct the URL bi only checking the object in `entry`. So far with this information we can deduce that the URL should start wit `/entry`.

Further checks in the object `entry`, shows that its `db` is `"InterPro"` and the `accession` is `"IPR000001"`, all the other values are null, and therefore the object correspon to the URL `/entry/InterPro/IPR000001` as expected.

The `numberOfFilters` indicates if is necesary to check other parts of the description, besides the one tagged in `main:{key}`. So, if for instance we have `main: { key: 'entry', numberOfFilters: 1 }`, the next step after prcessing the object entry, is to check which of the other objects has the flag `isFilter` set to `true`. Continuing with the example, let's assume we find this:
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
This then implies that the URL should include `/protein/UniProt/` which togetehr with the main object will give us: `/entry/InterPro/IPR000001/protein/UniProt/`.

**NOTE:** If the `numberOfFilters` is bigger than one, the procedure is the same for all the filters, only taking into account the value of `order` on each filter, to include the filter in the URL.


