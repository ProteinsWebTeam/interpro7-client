import { parse } from 'url';

import pathToDescription from 'utils/processDescription/pathToDescription';
import parseParamToNumber from 'store/utils/parse-param-to-number';

import settingsStorage from 'storage/settings';

export default history => {
  const {
    location: { pathname, search, hash },
  } = history;
  let settings;
  if (settingsStorage) {
    settings = settingsStorage.getValue() || undefined;
  }
  let description = { other: ['error', '404'] };
  let state;
  try {
    description = pathToDescription(pathname);
  } catch (error) {
    state = { errorURL: pathname };
    console.error(error);
  }
  return {
    customLocation: {
      description,
      search: parseParamToNumber('page_size')(
        parseParamToNumber('page')(parse(search, true).query),
      ),
      hash: hash.replace(/^#/, ''),
      state,
    },
    settings,
  };
};
