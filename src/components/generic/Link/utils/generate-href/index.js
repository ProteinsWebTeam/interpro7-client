// @flow
import { format } from 'url';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import config from 'config';

const rootPathname = (config.root.website.pathname || '').replace(/\/$/, '');

export default (nextLocation /*: Object */, href /*:: ?: ?string */) => {
  if (href) return href;
  return format({
    pathname: rootPathname + descriptionToPath(nextLocation.description),
    query: nextLocation.search,
    hash: nextLocation.hash,
  });
};
