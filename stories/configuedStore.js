import { createStore } from 'redux';
import { applyMiddleware, compose } from 'redux';

import rootReducer from 'reducers';
import getInitialState from 'store/utils/get-initial-state';

import {
  NEW_CUSTOM_LOCATION,
  NEW_PROCESSED_CUSTOM_LOCATION,
} from 'actions/types';

// Simple custom midleware that doesn't changes the browser history.
const middleware = ({ dispatch }) => {
  return (next) => (action) => {
    if (action.type === NEW_CUSTOM_LOCATION) {
      dispatch({
        ...action,
        type: NEW_PROCESSED_CUSTOM_LOCATION,
      });
    }
    return next(action);
  };
};

const configureStore = (location = {}) => {
  const { pathname = '/', search = '', hash = '' } = location;
  const state = getInitialState({
    history: { location: { pathname, search, hash } },
    basename: '',
  });
  // console.log(state);
  return createStore(
    rootReducer,
    state,
    compose(
      applyMiddleware(middleware),
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
};

export default configureStore;
