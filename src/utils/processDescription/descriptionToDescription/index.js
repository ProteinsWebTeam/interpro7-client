// @flow
import get from 'lodash-es/get';
import set from 'lodash-es/set';

import getEmptyDescription from 'utils/processDescription/emptyDescription';
import descriptionItemToHandlers from 'utils/processDescription/descriptionItemToHandlers';

export default (description /*: {[key: string]: string} */) => {
  const _description = getEmptyDescription();
  for (const [key, handlers] of descriptionItemToHandlers) {
    if (!get(description, key)) {
      try {
        set(_description, key, null);
      } finally {
        continue;
      }
    }
    let matchingHandler;
    for (const handler of handlers) {
      if (handler.match(get(description, key), _description)) {
        matchingHandler = handler;
        break;
      }
    }
    if (!matchingHandler) {
      throw new Error(
        `"${key}" doesn't allow a value like "${get(description, key)}"`,
      );
    }
    set(
      _description,
      key,
      matchingHandler.cleanedUp ||
        matchingHandler.cleanUp(get(description, key)),
    );
  }
  return _description;
};
