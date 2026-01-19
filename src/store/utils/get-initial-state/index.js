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

export default (historyWrapper) => {
  const {
    location: { pathname: p, search, hash },
  } = historyWrapper.history;
  const pathname = p.replace(historyWrapper.basename, '/');
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
      settings.repeatsDB = {
        protocol: config.root.repeatsDB.protocol,
        hostname: config.root.repeatsDB.hostname,
        port: config.root.repeatsDB.port || DEFAULT_HTTP_PORT,
        root: config.root.repeatsDB.pathname,
      };
      settings.disprot = {
        protocol: config.root.disprot.protocol,
        hostname: config.root.disprot.hostname,
        port: config.root.disprot.port || DEFAULT_HTTP_PORT,
        root: config.root.disprot.pathname,
      };
      settings.proteinsAPI = {
        protocol: config.root.proteinsAPI.protocol,
        hostname: config.root.proteinsAPI.hostname,
        port: config.root.proteinsAPI.port || DEFAULT_HTTP_PORT,
        root: config.root.proteinsAPI.pathname,
      };
    }
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
