// @flow
import { schedule } from 'timing-functions/src';

const DEFAULT_ROOT_DATA = {
  '@context': 'http://schema.org',
  '@type': 'WebSite',
  mainEntityOfPage: '@mainEntity',
};

const DEFAULT_MAX_DELAY = 250;

const checkDeadline = async (deadline, dev /*?: boolean */) => {
  let _deadline = deadline;
  if (!deadline.timeRemaining()) {
    if (dev) {
      console.log('⌛ No more time remaining! Re-schedule work for later');
    }
    _deadline = await schedule(DEFAULT_MAX_DELAY);
  }
  return _deadline;
};

const merger = async (
  dataMap,
  deadline,
  toBeProcessed = DEFAULT_ROOT_DATA,
  dev /*?: boolean */,
) => {
  const _deadline = await checkDeadline(deadline, dev);
  const schema = {};
  for (const [key, value] of Object.entries(toBeProcessed)) {
    if (value && value[0] === '@') {
      const data = Array.from(dataMap.get(value) || []);
      // we have data, add it
      if (data.length) {
        if (data.length === 1) {
          // if one piece of data, pass the piece
          schema[key] = await merger(dataMap, deadline, data[0]);
        } else {
          // if multiple data, pass as array
          schema[key] = await Promise.all(
            data.map(datum => merger(dataMap, deadline, datum)),
          );
        }
      } // else don't add
    } else {
      if (value !== null) schema[key] = value;
    }
  }
  return schema;
};

export default merger;
