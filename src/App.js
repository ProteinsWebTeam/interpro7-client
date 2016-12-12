// @flow
import React from 'react';
import {Provider} from 'react-redux';
import {Router, useRouterHistory} from 'react-router/es';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import config from 'config';
import routes from 'routes';
import loadDataForURL from 'data';
import createStore from 'store';
import {createToastManagerWithStore} from 'toasts';

const history = useRouterHistory(createBrowserHistory)({
  basename: config.root.website.pathname,
});

const store = createStore();

// For next changes to  history
history.listen(loadDataForURL(store));
// For first load
loadDataForURL(store)(history.getCurrentLocation());
// Instantiate Toast manager
createToastManagerWithStore(store);

const App = () => (
  <Provider store={store}>
    <Router
      history={history}
      routes={routes}
    />
  </Provider>
);

export default App;
