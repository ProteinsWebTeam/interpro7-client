import { rootHandler, otherHandler } from 'utils/processDescription/handlers';

import getEmptyDescription from 'utils/processDescription/emptyDescription';

import getNewPartsFromOldURL from 'utils/interpro6-url-pattern';

const MULTIPLE_SLASHES = /\/+/;

export default (path: string) => {
  const parts = path.split(MULTIPLE_SLASHES).filter(Boolean);
  try {
    return rootHandler.handle(getEmptyDescription(), ...parts);
  } catch (error) {
    console.warn(error);
    if ((error as Error).message.includes('404')) {
      const parts = getNewPartsFromOldURL(path);
      if (parts) return rootHandler.handle(getEmptyDescription(), ...parts);
    }
    return otherHandler.handle(getEmptyDescription(), ...parts);
  }
};
