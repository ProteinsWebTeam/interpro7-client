// @flow
import { rootHandler, otherHandler } from 'utils/processDescription/handlers';

import getEmptyDescription from 'utils/processDescription/emptyDescription';

import getNewPartsFromOldURL from 'utils/interpro6-url-pattern';

const MULTIPLE_SLASHES = /\/+/;

export default (path /*: string */) => {
  const parts = path.split(MULTIPLE_SLASHES).filter(Boolean);
  try {
    return rootHandler.handle(getEmptyDescription(), ...parts);
  } catch (error) {
    console.log('error');
    if (
      error.message.includes(
        '404',
      ) /*&&
      document.referrer.startsWith(BASE_FOR_IP)6*/
    ) {
      const parts = getNewPartsFromOldURL(path);
      if (parts) return rootHandler.handle(getEmptyDescription(), ...parts);
    }
    return otherHandler.handle(getEmptyDescription(), ...parts);
  }
};
