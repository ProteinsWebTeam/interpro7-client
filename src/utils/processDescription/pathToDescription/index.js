// @flow
import { rootHandler } from 'utils/processDescription/handlers';

import getEmptyDescription from 'utils/processDescription/emptyDescription';

const MULTIPLE_SLASHES = /\/+/;

export default (path /*: string */) => {
  const parts = path.split(MULTIPLE_SLASHES).filter(Boolean);
  return rootHandler.handle(getEmptyDescription(), ...parts);
};
