// @flow
import get from 'lodash-es/get';

import descriptionItemToHandlers from 'utils/processDescription/descriptionItemToHandlers';

export default (description /*: {[key: string]: ?string} */) => {
  let output = '/';
  for (const key of descriptionItemToHandlers.keys()) {
    const value = get(description, key);
    if (value) {
      // filter out empty values
      output += value + '/'; // eslint-disable-line prefer-template
      if (key === 'other' || key === 'mainDetail') {
        // break before if dead end
        break;
      }
    }
  }
  return output;
};
