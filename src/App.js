// @flow
import React from 'react';
import { Provider } from 'react-redux';

import createHistory from 'history/es/createBrowserHistory';

import Root from 'Root';
import ErrorBoundary from 'wrappers/ErrorBoundary';

import config from 'config';
import createStore from 'store';
import { createToastManagerWithStore } from 'toasts';

const history = createHistory({ basename: config.root.website.pathname });
const store = createStore(history);

createToastManagerWithStore(store);

const App = () => (
  <Provider store={store}>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </Provider>
);

export default App;
