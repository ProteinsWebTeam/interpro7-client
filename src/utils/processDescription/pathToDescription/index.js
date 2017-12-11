// @flow
import { rootHandler } from 'utils/processDescription/handlers';

const MULTIPLE_SLASHES = /\/+/;

export default (path /*: string */) => {
  const parts = path.split(MULTIPLE_SLASHES).filter(Boolean);
  return rootHandler.handle(undefined, ...parts);
};
