// @flow
import reactLoadable from 'react-loadable';

import LoadingComponent from './LoadingComponent';

const DEFAULT_DELAY = 200;
const DEFAULT_TIMEOUT = 15000;

// TODO: find better flow types
// TODO: Updating to flow ^0.85 makes this mandatory and reports many errors for connect()
const loadable = (options /*: Object */) /*: Object */ =>
  reactLoadable({
    loading: LoadingComponent,
    delay: DEFAULT_DELAY,
    timeout: DEFAULT_TIMEOUT,
    ...options,
  });

export default loadable;
