// @flow
import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';

import createHistory from 'history/es/createBrowserHistory';

import Root from 'Root';
import ErrorBoundary from 'wrappers/ErrorBoundary';

import config, { PROD, STAGING } from 'config';
import createStore from 'store';

const history = createHistory({ basename: config.root.website.pathname });
const store = createStore(history);

class App extends PureComponent /*:: <{||}> */ {
  async componentDidMount() {
    if (PROD || STAGING) {
      const module = await import(/* webpackChunkName: "offline" */ './offline');
      module.default(store);
    }
  }

  render() {
    return (
      <Provider store={store}>
        <ErrorBoundary>
          <Root />
        </ErrorBoundary>
      </Provider>
    );
  }
}

export default App;
