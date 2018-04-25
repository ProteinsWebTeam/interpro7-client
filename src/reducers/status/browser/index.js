// @flow
import { BROWSER_STATUS } from 'actions/types';

/*:: export type BrowserStatus = boolean; */
/*:: import type { State } from 'reducers'; */
/*:: import type { Action } from 'actions'; */

const getInitialBrowserStatus = () => {
  if (typeof window === 'undefined') return true;
  return window.navigator.onLine;
};

export default (
  state /*: BrowserStatus */ = getInitialBrowserStatus(),
  action /*: Action */,
) => {
  switch (action.type) {
    case BROWSER_STATUS:
      return action.onLine;
    default:
      return state;
  }
};

export const browserStatusSelector = (state /*: State */) =>
  state.status.browser;
