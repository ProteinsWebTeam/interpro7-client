// @flow
import get from 'lodash-es/get';
import set from 'lodash-es/set';

import getEmptyDescription from 'utils/processDescription/emptyDescription';
import descriptionItemToHandlers from 'utils/processDescription/descriptionItemToHandlers';

export default (description /*: {[key: string]: string} */) => {
  // new description to be populated
  const _description = getEmptyDescription();
  // for all possible keys in description, get potential handlers
  for (const [key, handlers] of descriptionItemToHandlers) {
    // if not in provided description, fill output with null
    if (!get(description, key)) {
      try {
        set(_description, key, null);
      } finally {
        continue;
      }
    }
    let matchingHandler;
    let value;
    // for all possible handlers for this key
    for (const handler of handlers) {
      value = get(description, key);
      if (handler.match(value, _description)) {
        matchingHandler = handler;
        // Stop! we found a handler, no need to look further
        break;
      }
    }
    if (!matchingHandler) {
      throw new Error(`"${key}" doesn't allow a value like "${value}"`);
    }
    // If I'm here, I do have a handler for this 'key', with this 'value'
    // So set the new description at 'key' with the cleaned up value
    set(
      _description,
      key,
      matchingHandler.cleanedUp || matchingHandler.cleanUp(value, _description),
    );
  }
  return _description;
};
