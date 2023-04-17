// @flow
import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';

import { createBrowserHistory } from 'history';

import Root from 'Root';
import ErrorBoundary from 'wrappers/ErrorBoundary';

import config, { PROD, STAGING } from 'config';
import createStore from 'store';
import { removeLastSlash } from 'utils/url';

const history = createBrowserHistory();
const historyWrapper = {
  history,
  basename: removeLastSlash(config.root.website.pathname),
};

const store = createStore(historyWrapper);

class App extends PureComponent /*:: <{||}> */ {
  async componentDidMount() {
    if (PROD || STAGING) {
      const module = await import(
        /* webpackChunkName: "offline" */ './offline'
      );
      module.default(store);
    }
  }

  render() {
    return (
      <Provider store={store}>
        <ErrorBoundary>
          <React.StrictMode>
            <Root />
          </React.StrictMode>
        </ErrorBoundary>
      </Provider>
    );
  }
}

export default App;
