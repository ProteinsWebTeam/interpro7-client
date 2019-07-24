import { CHANGE_SETTINGS, RESET_SETTINGS } from 'actions/types';
import config from 'config';

import { EntryColorMode } from 'utils/entry-color';

const DEFAULT_HTTP_PORT = 80;

/*:: type Category = 'navigation' | 'ui' | 'cache' | 'ebi' | 'api' | 'ipScan'; */

export const getDefaultSettingsFor = (category /*: Category */) => {
  switch (category) {
    case 'navigation':
      return {
        pageSize: config.pagination.pageSize,
      };
    case 'ui':
      return {
        lowGraphics: false,
        colorDomainsBy: EntryColorMode.ACCESSION,
        structureViewer: false,
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
    default:
      return null;
  }
};

export default (category /*: Category */) => (
  state /*: Object */ = getDefaultSettingsFor(category),
  action /*: Object */,
) => {
  switch (action.type) {
    case CHANGE_SETTINGS:
      if (action.category !== category) return state;
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
