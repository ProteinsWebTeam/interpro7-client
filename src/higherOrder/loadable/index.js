// @flow
import reactLoadable from 'react-loadable';

import LoadingComponent from './LoadingComponent';

const DEFAULT_DELAY = 200;
const DEFAULT_TIMEOUT = 15000;

const loadable = options =>
  reactLoadable({
    loading: LoadingComponent,
    delay: DEFAULT_DELAY,
    timeout: DEFAULT_TIMEOUT,
    ...options,
  });

export default loadable;
