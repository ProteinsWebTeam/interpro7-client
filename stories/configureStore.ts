import {
  legacy_createStore as createStore,
  Reducer,
  Middleware,
  Action,
} from 'redux';
import { applyMiddleware, compose } from 'redux';

import rootReducer from 'reducers';
import getInitialState from 'store/utils/get-initial-state';

import {
  NEW_CUSTOM_LOCATION,
  NEW_PROCESSED_CUSTOM_LOCATION,
} from 'actions/types';

export const middleware: Middleware<{}, GlobalState> =
  (storeApi) => (next) => (action) => {
    const dispatch = storeApi.dispatch;
    const actionTyped = action as Action<string>;
    if (actionTyped.type === NEW_CUSTOM_LOCATION) {
      dispatch({
        ...actionTyped,
        type: NEW_PROCESSED_CUSTOM_LOCATION,
      });
    }
    return next(action);
  };

// declare global {
//   interface Window {
//     __REDUX_DEVTOOLS_EXTENSION__?: StoreEnhancer<{}, {}>;
//   }
// }

type InitialLocation = { pathname?: string; search?: string; hash?: string };
const reducer = rootReducer as unknown as Reducer<GlobalState, Action<string>>;

const configureStore = (location: InitialLocation = {}) => {
  const { pathname = '/', search = '', hash = '' } = location;
  const state = getInitialState({
    history: { location: { pathname, search, hash } },
    basename: '',
  }) as GlobalState;
  // console.log(state);

  return createStore<GlobalState, Action<string>>(
    reducer,
    state,
    compose(
      applyMiddleware(middleware)
      // window.__REDUX_DEVTOOLS_EXTENSION__ &&
      //   window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
};

export default configureStore;
