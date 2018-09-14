import { parse } from 'url';
import config, { PROD } from 'config';

import pathToDescription from 'utils/processDescription/pathToDescription';
import parseParamToNumber from 'store/utils/parse-param-to-number';

import settingsStorage from 'storage/settings';

const DEFAULT_HTTP_PORT = 80;

export default history => {
  const {
    location: { pathname, search, hash },
  } = history;
  let settings;
  if (settingsStorage) {
    settings = settingsStorage.getValue() || undefined;
    if (PROD) {
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
    }
  }
  const description = pathToDescription(pathname);
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
