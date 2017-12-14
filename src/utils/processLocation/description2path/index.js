// @flow
import { descriptionItemToHandlers } from 'utils/processLocation/utils';

export default (description /*: {[key: string]: ?string} */) => {
  let output = '/';
  for (const key of descriptionItemToHandlers.keys()) {
    const value = description[key];
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
