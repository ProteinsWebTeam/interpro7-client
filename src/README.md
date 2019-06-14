# src
This directory contains all the source code for the site. 

InterPro7 is a React application. The file [index.js](./index.js) is the start point for processing it. Its main function is to render our main react component([`<App>`](./App.js)). But before that, it sets up a few things:
* such including absolute required polyfills
* enables (if posible) *Hot Module Replacement* for development
* prepares the handling of errors (throw them while in dev, or sending them to Google analytics for production)
* Put in place the logic to be able to "Add to homescreen" InterPro7 in mobiles.
* Creates the root element for the Schema.org metadata.

The component [`<App>`](./App.js) is the place where we have setup the high level React logic for the App:
* Gets the browser history manager to take manual control over it.
* Creates the App store, we are using redux for this. See [`/store`](./store) for details.
* Renders `Provider>ErrorBoundary>Root`, where:
  * `<Provider>` is the `react-redux` wrapper component that allows to pass the App sotr to inner components via `connect()`.
  * `<ErrorBoundary>` a sort of global `catch` in case anything goes wrong down the line. 
  * [`<Root>`](./Root.js) Contains all the top level components to be rendered and starts using our code-splitting strategy via [`loadable`](./higherOrder/loadable)

## directory structure
-  __mocks__: unused at the moment?
-  actions: defines global actions used throughout the site e.g The sidebar, Settings form and EMBL Map (included in EBI header)
-  components: Defines the components used in the various 'pages' of the website
-  higherOrder:
-  images:
-  reducers
-  schema.org
-  snippets
-  staticData
-  storage
-  store
-  styles
-  subPages
-  utils
-  web-workers
-  wrappers
-  App.js
-  Root.js
-  config.js
-  index.js
-  index.template.html
-  offline.js
