// @flow
import get from 'lodash-es/get';

import descriptionItemToHandlers from 'utils/processDescription/descriptionItemToHandlers';

export default (description /*: {[key: string]: ?string} */) => {
  let output = '/';
  if (!description.main.key) {
    return (
      output +
      Object.values(description.other)
        .filter(Boolean)
        .join('/')
    );
  }
  return '';
  // const {[description.main.key]: main, other, main: _, ...filter} = description;
  // debugger;
  // for (const key of descriptionItemToHandlers.keys()) {
  //   const value = get(description, key);
  //   if (value) {
  //     // filter out empty values
  //     output += value + '/'; // eslint-disable-line prefer-template
  //     if (key === 'other' || key === 'mainDetail') {
  //       // break before if dead end
  //       break;
  //     }
  //   }
  // }
  // output += mainParts.filter(Boolean).join('/');
  // if (filterParts.length) output += `/${filterParts.filter(Boolean).join('/')}`;
  // return output;
};
