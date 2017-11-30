// @flow
import get from 'lodash-es/get';

import descriptionItemToHandlers from 'utils/processDescription/descriptionItemToHandlers';

/*:: import type { Description } from 'utils/processDescription/handlers'; */

// prettier-ignore
const pathForPart = (
  type/*: string */,
  values/*: {|[key: string]: ?(string | boolean)|} */
)/*: string */ => {
  return [type, ...Object.values(values)].filter(part => typeof part === 'string').join('/');
};

export default (description /*: Description */) => {
  let output = '/';
  if (!(description.main && description.main.key)) {
    return (
      output +
      Object.values(description.other)
        .filter(Boolean)
        .join('/')
    );
  }
  const main = description.main.key;
  output += `${pathForPart(main, description[main])}/`;
  const filters = Object.entries(description).filter(
    ([, { isFilter }]) => isFilter,
  );
  return filters.reduce(
    (acc, [key, values]) => `${output}${pathForPart(key, values)}/`,
    output,
  );
};
