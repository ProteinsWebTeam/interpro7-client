// @flow
import { SERVER_STATUS } from 'actions/types';

/*:: type Server = 'api' | 'ebi' | 'ipScan'; */
/*:: export type ServerStatus = {|
  status: ?boolean,
  lastCheck: ?number,
|}; */
/*:: import type { State } from 'reducers'; */
/*:: import type { Action } from 'actions'; */

// eslint-disable-next-line no-extra-parens
export default (server /*: Server */) => ((
  state = { status: null, lastCheck: null },
  action,
) => {
  switch (action.type) {
    case SERVER_STATUS:
      if (action.server !== server) return state;
      return {
        status: action.status,
        lastCheck: Date.now(),
      };
    default:
      return state;
  }
} /*: (ServerStatus | void, any) => any */);
