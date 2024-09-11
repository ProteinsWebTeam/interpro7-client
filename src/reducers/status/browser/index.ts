import { BROWSER_STATUS, StatusAction } from 'actions/types';

const getInitialBrowserStatus = () => {
  if (typeof window === 'undefined') return true;
  return window.navigator.onLine;
};

export default (
  state: boolean = getInitialBrowserStatus(),
  action: StatusAction,
) => {
  switch (action.type) {
    case BROWSER_STATUS:
      return !!action.onLine;
    default:
      return state;
  }
};

export const browserStatusSelector = (state: GlobalState) =>
  state.status.browser;
