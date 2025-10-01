import { CHANGE_SETTINGS, RESET_SETTINGS, SettingsAction } from 'actions/types';
import config from 'config';

import { EntryColorMode } from 'utils/entry-color';

const DEFAULT_HTTP_PORT = 80;
const DEFAULT_SECONDS_TO_RETRY = 10;

export const getDefaultSettingsFor = <T extends keyof SettingsState>(
  category: T,
): SettingsState[T] | null => {
  switch (category) {
    case 'navigation':
      return {
        pageSize: config.pagination.pageSize,
        secondsToRetry:
          config?.timeout?.secondsToRetry || DEFAULT_SECONDS_TO_RETRY,
      } as SettingsState[T];

    case 'notifications':
      return {
        showTreeToast: true,
        showConnectionStatusToast: true,
        showSettingsToast: true,
        showHelpToast: true,
        showCtrlToZoomToast: true,
      } as SettingsState[T];
    case 'ui':
      return {
        lowGraphics: false,
        colorDomainsBy: EntryColorMode.MEMBER_DB,
        labelContent: {
          accession: false,
          name: true,
          short: true,
        },
        matchTypeSettings: 'best',
        structureViewer: false,
        shouldHighlight: true,
        idaAccessionDB: 'interpro',
        isPIPEnabled: false,
      } as SettingsState[T];
    case 'cache':
      return {
        enabled: config.cache.enabled,
      } as SettingsState[T];
    case 'ebi':
      return {
        protocol: config.root.EBIsearch.protocol,
        hostname: config.root.EBIsearch.hostname,
        port: config.root.EBIsearch.port || DEFAULT_HTTP_PORT,
        root: config.root.EBIsearch.pathname,
      } as SettingsState[T];
    case 'api':
      return {
        protocol: config.root.API.protocol,
        hostname: config.root.API.hostname,
        port: config.root.API.port || DEFAULT_HTTP_PORT,
        root: config.root.API.pathname,
      } as SettingsState[T];
    case 'ipScan':
      return {
        protocol: config.root.IPScan.protocol,
        hostname: config.root.IPScan.hostname,
        port: config.root.IPScan.port || DEFAULT_HTTP_PORT,
        root: config.root.IPScan.pathname,
      } as SettingsState[T];
    case 'repeatsDB':
      return {
        protocol: config.root.repeatsDB.protocol,
        hostname: config.root.repeatsDB.hostname,
        port: config.root.repeatsDB.port || DEFAULT_HTTP_PORT,
        root: config.root.repeatsDB.pathname,
      } as SettingsState[T];
    case 'proteinsAPI':
      return {
        protocol: config.root.proteinsAPI.protocol,
        hostname: config.root.proteinsAPI.hostname,
        port: config.root.proteinsAPI.port || DEFAULT_HTTP_PORT,
        root: config.root.proteinsAPI.pathname,
      } as SettingsState[T];
    case 'disprot':
      return {
        protocol: config.root.disprot.protocol,
        hostname: config.root.disprot.hostname,
        port: config.root.disprot.port || DEFAULT_HTTP_PORT,
        root: config.root.disprot.pathname,
      } as SettingsState[T];
    case 'wikipedia':
      return {
        protocol: config.root.wikipedia.protocol,
        hostname: config.root.wikipedia.hostname,
        port: config.root.wikipedia.port || DEFAULT_HTTP_PORT,
        root: config.root.wikipedia.pathname,
      } as SettingsState[T];
    case 'alphafold':
      return {
        protocol: config.root.alphafold.protocol,
        hostname: config.root.alphafold.hostname,
        port: config.root.alphafold.port || DEFAULT_HTTP_PORT,
        root: config.root.alphafold.pathname,
        query: config.root.alphafold.query,
      } as SettingsState[T];
    case 'bfvd':
      return {
        protocol: config.root.bfvd.protocol,
        hostname: config.root.bfvd.hostname,
        port: config.root.bfvd.port || DEFAULT_HTTP_PORT,
        root: config.root.bfvd.pathname,
        query: config.root.bfvd.query,
      } as SettingsState[T];
    default:
      return null;
  }
};

export default <T extends keyof SettingsState>(category: T) =>
  (
    state: SettingsState[T] = getDefaultSettingsFor(category)!,
    action: SettingsAction,
  ) => {
    switch (action.type) {
      case CHANGE_SETTINGS:
        if (action.category !== category) return state;
        if ((action.key || '').includes('.')) {
          const parts = action.key!.split('.');
          const currentGroup = state[parts[0] as keyof SettingsState[T]];
          return {
            ...state,
            [parts[0]]: {
              ...currentGroup,
              [parts[1]]: action.value,
            },
          } as SettingsState[T];
        }
        return {
          ...state,
          [action.key!]: action.value,
        } as SettingsState[T];
      case RESET_SETTINGS:
        return action.value || getDefaultSettingsFor(category);
      default:
        return state;
    }
  };
