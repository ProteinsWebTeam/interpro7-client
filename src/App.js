// @flow
import React from 'react';
import {Provider} from 'react-redux';
import BrowserRouter from 'react-router/BrowserRouter';
// import createBrowserHistory from 'history/createBrowserHistory';

import Root from 'Root';

import config from 'config';
// import routes from 'routes';
import loadDataForURL from 'data';
import createStore from 'store';
import {createToastManagerWithStore} from 'toasts';

// const history = useRouterHistory(createBrowserHistory)({
//   basename: config.root.website.pathname,
// });

console.log(config);
const store = createStore();

// For next changes to  history
// history.listen(loadDataForURL(store));
// For first load
// loadDataForURL(store)(history.getCurrentLocation());
// Instantiate Toast manager
createToastManagerWithStore(store);

const App = () => (
  <Provider store={store}>
    <BrowserRouter basename={config.root.website.pathname}>
      <Root />
    </BrowserRouter>
  </Provider>
);

export default App;
