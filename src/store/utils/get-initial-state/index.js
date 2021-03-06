import { parse } from 'url';
import config, { PROD } from 'config';

import pathToDescription from 'utils/processDescription/pathToDescription';
import parseParamToNumber from 'store/utils/parse-param-to-number';
import defaultSettingsReducer from 'reducers/settings';

import settingsStorage from 'storage/settings';

const DEFAULT_HTTP_PORT = 80;

const addNewDefaultSttings = (settings) => {
  const defaultSettings = defaultSettingsReducer({}, {});
  Object.keys(defaultSettings).forEach((mainKey) => {
    if (!(mainKey in settings)) {
      settings[mainKey] = defaultSettings[mainKey];
    }
    Object.keys(defaultSettings[mainKey]).forEach((secondKey) => {
      if (!(secondKey in settings[mainKey])) {
        settings[mainKey][secondKey] = defaultSettings[mainKey][secondKey];
      }
    });
  });
};

export default (history) => {
  const {
    location: { pathname, search, hash },
  } = history;
  let settings;
  if (settingsStorage) {
    settings = settingsStorage.getValue() || undefined;
    if (settings) {
      addNewDefaultSttings(settings);
    }
    if (PROD && settings) {
      settings.ebi = {
        protocol: config.root.EBIsearch.protocol,
        hostname: config.root.EBIsearch.hostname,
        port: config.root.EBIsearch.port || DEFAULT_HTTP_PORT,
        root: config.root.EBIsearch.pathname,
      };
      settings.api = {
        protocol: config.root.API.protocol,
        hostname: config.root.API.hostname,
        port: config.root.API.port || DEFAULT_HTTP_PORT,
        root: config.root.API.pathname,
      };
      settings.ipScan = {
        protocol: config.root.IPScan.protocol,
        hostname: config.root.IPScan.hostname,
        port: config.root.IPScan.port || DEFAULT_HTTP_PORT,
        root: config.root.IPScan.pathname,
      };
      settings.genome3d = {
        protocol: config.root.genome3d.protocol,
        hostname: config.root.genome3d.hostname,
        port: config.root.genome3d.port || DEFAULT_HTTP_PORT,
        root: config.root.genome3d.pathname,
      };
    }
  }
  // TODO: remove this line when the logs show that users are now using /wwwapi/
  if (settings?.api?.hostname === 'www.ebi.ac.uk') {
    settings.api.root = settings.api.root.replace('/api/', '/wwwapi/');
  }
  let description = { other: ['NotFound'] };
  try {
    description = pathToDescription(pathname);
  } catch {
    console.error('Unable to identify resouce based on the URL request');
  }
  return {
    customLocation: {
      description,
      search: parseParamToNumber('page_size')(
        parseParamToNumber('page')(parse(search, true).query),
      ),
      hash: hash.replace(/^#/, ''),
    },
    settings,
  };
};
