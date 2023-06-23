import { CHANGE_SETTINGS, RESET_SETTINGS } from 'actions/types';
import config from 'config';

import { EntryColorMode } from 'utils/entry-color';

const DEFAULT_HTTP_PORT = 80;
const DEFAULT_SECONDS_TO_RETRY = 10;

/*:: type Category = 'navigation' | 'notifications' | 'ui' | 'cache' | 'ebi' | 'api' | 'ipScan'; */

// eslint-disable-next-line complexity
export const getDefaultSettingsFor = (category /*: Category */) => {
  switch (category) {
    case 'navigation':
      return {
        pageSize: config.pagination.pageSize,
        secondsToRetry:
          config?.timeout?.secondsToRetry || DEFAULT_SECONDS_TO_RETRY,
      };

    case 'notifications':
      return {
        showTreeToast: true,
        showConnectionStatusToast: true,
        showSettingsToast: true,
        showHelpToast: true,
        showCtrlToZoomToast: true,
      };
    case 'ui':
      return {
        lowGraphics: false,
        colorDomainsBy: EntryColorMode.ACCESSION,
        labelContent: {
          accession: true,
          name: false,
          short: false,
        },
        structureViewer: false,
        shouldHighlight: true,
        idaAccessionDB: 'interpro',
        idaLabel: 'name',
        isPIPEnabled: true,
      };
    case 'cache':
      return {
        enabled: config.cache.enabled,
      };
    case 'ebi':
      return {
        protocol: config.root.EBIsearch.protocol,
        hostname: config.root.EBIsearch.hostname,
        port: config.root.EBIsearch.port || DEFAULT_HTTP_PORT,
        root: config.root.EBIsearch.pathname,
      };
    case 'api':
      return {
        protocol: config.root.API.protocol,
        hostname: config.root.API.hostname,
        port: config.root.API.port || DEFAULT_HTTP_PORT,
        root: config.root.API.pathname,
      };
    case 'ipScan':
      return {
        protocol: config.root.IPScan.protocol,
        hostname: config.root.IPScan.hostname,
        port: config.root.IPScan.port || DEFAULT_HTTP_PORT,
        root: config.root.IPScan.pathname,
      };
    case 'genome3d':
      return {
        protocol: config.root.genome3d.protocol,
        hostname: config.root.genome3d.hostname,
        port: config.root.genome3d.port || DEFAULT_HTTP_PORT,
        root: config.root.genome3d.pathname,
      };
    case 'repeatsDB':
      return {
        protocol: config.root.repeatsDB.protocol,
        hostname: config.root.repeatsDB.hostname,
        port: config.root.repeatsDB.port || DEFAULT_HTTP_PORT,
        root: config.root.repeatsDB.pathname,
      };
    case 'wikipedia':
      return {
        protocol: config.root.wikipedia.protocol,
        hostname: config.root.wikipedia.hostname,
        port: config.root.wikipedia.port || DEFAULT_HTTP_PORT,
        root: config.root.wikipedia.pathname,
      };
    case 'alphafold':
      return {
        protocol: config.root.alphafold.protocol,
        hostname: config.root.alphafold.hostname,
        port: config.root.alphafold.port || DEFAULT_HTTP_PORT,
        root: config.root.alphafold.pathname,
        query: config.root.alphafold.query,
      };
    default:
      return null;
  }
};

export default (category /*: Category */) =>
  (
    state /*: Object */ = getDefaultSettingsFor(category),
    action /*: Object */,
  ) => {
    switch (action.type) {
      case CHANGE_SETTINGS:
        if (action.category !== category) return state;
        if (action.key.includes('.')) {
          const parts = action.key.split('.');
          const currentGroup = state[parts[0]];
          return {
            ...state,
            [parts[0]]: {
              ...currentGroup,
              [parts[1]]: action.value,
            },
          };
        }
        return {
          ...state,
          [action.key]: action.value,
        };
      case RESET_SETTINGS:
        return action.value || getDefaultSettingsFor(category);
      default:
        return state;
    }
  };
