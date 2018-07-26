// @flow
import { rootHandler, otherHandler } from 'utils/processDescription/handlers';

import getEmptyDescription from 'utils/processDescription/emptyDescription';

const MULTIPLE_SLASHES = /\/+/;

export default (path /*: string */) => {
  const parts = path.split(MULTIPLE_SLASHES).filter(Boolean);
  let output;
  try {
    output = rootHandler.handle(getEmptyDescription(), ...parts);
  } catch (error) {
    if (error.message.includes('404')) {
      console.warn('404, check referrer');
      console.log(window.referrer);
    }
    output = otherHandler.handle(getEmptyDescription(), ...parts);
  }
  return output;
};
