import React from 'react';
import {Provider} from 'react-redux';
import {
  Router, applyRouterMiddleware, useRouterHistory,
} from 'react-router/es6';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {useScroll} from 'react-router-scroll';

import config from 'config';
import routes from 'routes';
import createStore from 'store';

const history = useRouterHistory(createBrowserHistory)({
  basename: config.root.website.pathname,
});

const store = createStore();

const handleURLChange = ({pathname, query}) => {
  console.log(pathname);
  console.log(query);
}

history.listen(handleURLChange);

// Override scroll behavior, prevents jumping back to the top
// TODO: define and implement when we actually want to jump back to the top
const scrollMiddleware = useScroll(() => {});

const App = () => (
  <Provider store={store}>
    <Router
      history={history}
      routes={routes}
      render={applyRouterMiddleware(scrollMiddleware)}
    />
  </Provider>
);

export default App;
