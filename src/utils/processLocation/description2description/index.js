// @flow
import { descriptionItemToHandlers } from 'utils/processLocation/utils';

export default (description /*: {[key: string]: string} */) => {
  const _description = {};
  for (const [key, handlers] of descriptionItemToHandlers) {
    if (!description[key]) {
      _description[key] = null;
      continue;
    }
    let matchingHandler;
    for (const handler of handlers) {
      if (handler.match(description[key], _description)) {
        matchingHandler = handler;
        break;
      }
    }
    if (!matchingHandler) {
      throw new Error(
        `"${key}" doesn't allow a value like "${description[key]}"`,
      );
    }
    _description[key] =
      matchingHandler.cleanedUp || matchingHandler.cleanUp(description[key]);
  }
  return _description;
};
