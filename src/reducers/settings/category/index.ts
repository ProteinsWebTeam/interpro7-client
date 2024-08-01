import { CHANGE_SETTINGS, RESET_SETTINGS, SettingsAction } from 'actions/types';
import config from 'config';

import { EntryColorMode } from 'utils/entry-color';

const DEFAULT_HTTP_PORT = 80;
const DEFAULT_SECONDS_TO_RETRY = 10;

export const getDefaultSettingsFor = (category: keyof SettingsState) => {
  switch (category) {
    case 'navigation':
      return {
        pageSize: config.pagination.pageSize,
        secondsToRetry:
          config?.timeout?.secondsToRetry || DEFAULT_SECONDS_TO_RETRY,
      } as NavigationSettings;

    case 'notifications':
      return {
        showTreeToast: true,
        showConnectionStatusToast: true,
        showSettingsToast: true,
        showHelpToast: true,
        showCtrlToZoomToast: true,
      } as NotificationsSettings;
    case 'ui':
      return {
        lowGraphics: false,
        colorDomainsBy: EntryColorMode.ACCESSION,
        labelContent: {
          accession: true,
          name: false,
          short: true,
        },
        structureViewer: false,
        shouldHighlight: true,
        idaAccessionDB: 'interpro',
        isPIPEnabled: false,
      } as UISettings;
    case 'cache':
      return {
        enabled: config.cache.enabled,
      } as CacheSettings;
    case 'ebi':
      return {
        protocol: config.root.EBIsearch.protocol,
        hostname: config.root.EBIsearch.hostname,
        port: config.root.EBIsearch.port || DEFAULT_HTTP_PORT,
        root: config.root.EBIsearch.pathname,
      } as ParsedURLServer;
    case 'api':
      return {
        protocol: config.root.API.protocol,
        hostname: config.root.API.hostname,
        port: config.root.API.port || DEFAULT_HTTP_PORT,
        root: config.root.API.pathname,
      } as ParsedURLServer;
    case 'ipScan':
      return {
        protocol: config.root.IPScan.protocol,
        hostname: config.root.IPScan.hostname,
        port: config.root.IPScan.port || DEFAULT_HTTP_PORT,
        root: config.root.IPScan.pathname,
      } as ParsedURLServer;
    case 'genome3d':
      return {
        protocol: config.root.genome3d.protocol,
        hostname: config.root.genome3d.hostname,
        port: config.root.genome3d.port || DEFAULT_HTTP_PORT,
        root: config.root.genome3d.pathname,
      } as ParsedURLServer;
    case 'repeatsDB':
      return {
        protocol: config.root.repeatsDB.protocol,
        hostname: config.root.repeatsDB.hostname,
        port: config.root.repeatsDB.port || DEFAULT_HTTP_PORT,
        root: config.root.repeatsDB.pathname,
      } as ParsedURLServer;
    case 'proteinsAPI':
      return {
        protocol: config.root.proteinsAPI.protocol,
        hostname: config.root.proteinsAPI.hostname,
        port: config.root.proteinsAPI.port || DEFAULT_HTTP_PORT,
        root: config.root.proteinsAPI.pathname,
      } as ParsedURLServer;
    case 'disprot':
      return {
        protocol: config.root.disprot.protocol,
        hostname: config.root.disprot.hostname,
        port: config.root.disprot.port || DEFAULT_HTTP_PORT,
        root: config.root.disprot.pathname,
      } as ParsedURLServer;
    case 'wikipedia':
      return {
        protocol: config.root.wikipedia.protocol,
        hostname: config.root.wikipedia.hostname,
        port: config.root.wikipedia.port || DEFAULT_HTTP_PORT,
        root: config.root.wikipedia.pathname,
      } as ParsedURLServer;
    case 'alphafold':
      return {
        protocol: config.root.alphafold.protocol,
        hostname: config.root.alphafold.hostname,
        port: config.root.alphafold.port || DEFAULT_HTTP_PORT,
        root: config.root.alphafold.pathname,
        query: config.root.alphafold.query,
      } as ParsedURLServer;
    default:
      return null;
  }
};

type keysOfSettingsState = keyof SettingsState;
type SettingCategoryState = SettingsState[keysOfSettingsState];

export default (category: keysOfSettingsState) =>
  (
    state: SettingCategoryState = getDefaultSettingsFor(category)!,
    action: SettingsAction,
  ) => {
    switch (action.type) {
      case CHANGE_SETTINGS:
        if (action.category !== category) return state;
        if ((action.key || '').includes('.')) {
          const parts = action.key!.split('.');
          const currentGroup = state[
            parts[0] as keyof SettingCategoryState
          ] as Record<string, string | number | boolean | LabelUISettings>;
          return {
            ...state,
            [parts[0]]: {
              ...currentGroup,
              [parts[1]]: action.value,
            },
          } as SettingCategoryState;
        }
        return {
          ...state,
          [action.key!]: action.value,
        } as SettingCategoryState;
      case RESET_SETTINGS:
        return action.value || getDefaultSettingsFor(category);
      default:
        return state;
    }
  };
