import { parse } from 'url';

import pathToDescription from 'utils/processDescription/pathToDescription';
import parseParamToNumber from 'store/utils/parse-param-to-number';

import settingsStorage from 'storage/settings';

export default history => {
  const { location: { pathname, search, hash } } = history;
  let settings;
  if (settingsStorage) {
    settings = settingsStorage.getValue() || undefined;
  }
  return {
    customLocation: {
      description: pathToDescription(pathname),
      search: parseParamToNumber('page_size')(
        parseParamToNumber('page')(parse(search, true).query),
      ),
      hash: hash.replace(/^#/, ''),
    },
    settings,
  };
};
