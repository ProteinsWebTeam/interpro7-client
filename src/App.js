// @flow
import React from 'react';
import {Provider} from 'react-redux';

import createHistory from 'history/createBrowserHistory';

import Root from 'Root';

import config from 'config';
import createStore from 'store';
import {createToastManagerWithStore} from 'toasts';

const history = createHistory({basename: config.root.website.pathname});
const store = createStore(history);

createToastManagerWithStore(store);

const App = () => (
  <Provider store={store}>
    <Root />
  </Provider>
);

export default App;
