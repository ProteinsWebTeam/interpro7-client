import { SERVER_STATUS, StatusAction } from 'actions/types';

export default (server: Server) =>
  (
    state: ServerStatus = { status: null, lastCheck: null },
    action: StatusAction,
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
  };
