processDescription
====

The files in this folder implement the in-house router of the interpro-client app.

#### URL => App State => Content
When a user access the website using a URL to get directed to a particular resource (e.g. https://www.ebi.ac.uk/interpro/beta/entry/InterPro/IPR000001/) this URL is mapped into a location object in the App(redux) state. The change in the state propagates a series of updates in the react components, so the content of the page gets updated with the requested information.

#### App State => URL => Content
Similarly, if a value is changed in the location structure of the App state, it also changes the current URL (without refreshing the page). This implies that links in the website are implemented as _redux actions_ instead of default redirects of a `<a>` element. See [Link Component](/src/components/generic/Link/).


The data structure
----

The file in [emptyDescription](emptyDescription/index.js) creates the empty structure to represent a location in the InterPro website.
