# src
This directory contains all the source code for the site. 

InterPro7 is a React application. The file [index.js](./index.js) is the start point for the application. Its main function is to render our main react component([`<App>`](./App.js)). It also initialises some aspects required for the site:
* Imports essential polyfills
* Enables (if posible) *Hot Module Replacement* for development
* Prepares the handling of errors (throw them while in dev, or sending them to Google analytics for production)
* Initialise the logic to be enable to "Add to homescreen" InterPro7 in mobiles.
* Creates the root element for the Schema.org metadata.

The component [`<App>`](./App.js) is the place where we have setup the high level React logic for the App:
* Gets the browser history manager to take manual control over it.
* Creates the App store, we are using redux for this. See [`/store`](./store) for details.
* Activates the service worker that caches the App files(`.js`, `.css`, etc.) and refreshes them if there is a new version. [Read More](./README_SW.md)
* Renders `Provider>ErrorBoundary>Root`, where:
  * `<Provider>` is the `react-redux` wrapper component that allows to pass the App sotr to inner components via `connect()`.
  * `<ErrorBoundary>` a sort of global `catch` in case anything goes wrong down the line. 
  * [`<Root>`](./Root.js) Contains all the top level components to be rendered and starts using our code-splitting strategy via [`loadable`](./higherOrder/loadable)

## directory structure
-  `/__mocks__`: unused at the moment?
-  `/actions`: defines global actions used throughout the site e.g The sidebar, Settings form and EMBL Map (included in EBI header)
-  `/components`: Defines the components used in the various 'pages' of the website
-  `/higherOrder`: Components reused in the whole App. LoadData to fetch data for a wrapped document, Loadable to be ablo to asplit code
-  `/images`: Static images used in the App
-  `/pages`: The pages components for the first level of navigation (Main Menu), for example, Home, Help, Release notes, etc.
-  `/reducers`: The reducer function for redux split in differnt files by using `combineReducer()`
-  `/schema`.org: Comonents that deal with the logic to compose the json-ld of the schema.org
-  `/snippets`: Template files used in the API selector page
-  `/staticData`: static data used for some of the components in the Home page.
-  `/storage`: Logic relatted to client based storage, either IndexedDB for InterProScan Jobs, or SessionStorage/LocalStorage for settings.
-  `/store`: Files dealing with the Redux store.
-  `/styles`: CSS files for the website.
-  `/subPages`: The components to display subpages when an entity has been selected, for instance the proteins of an entry, or the signature of a pfam domain.
-  `/utils`: Utility functions useful througout the website
-  `/web-workers`: Currently the only web worker is to generate a file to download that requires multiplae API calls.
-  `/wrappers`: Small utility components that are used in mutliple parts of the website.