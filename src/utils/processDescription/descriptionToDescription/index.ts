import { get, set } from 'lodash-es';

import getEmptyDescription from 'utils/processDescription/emptyDescription';
import descriptionItemToHandlers from 'utils/processDescription/descriptionItemToHandlers';

export default (description: InterProPartialDescription | undefined) => {
  // new description to be populated
  const _description = getEmptyDescription();
  // for all possible keys in description, get potential handlers
  for (const [key, handlers] of descriptionItemToHandlers) {
    // if not in provided description, fill output with null
    if (!get(description, key)) {
      try {
        if (key.indexOf('order') === -1) {
          set(_description, key, null);
        }
      } finally {
        continue;
      }
    }
    let matchingHandler;
    let value;
    // for all possible handlers for this key
    for (const handler of handlers) {
      value = get(description, key);
      // if (typeof value === 'string') {
      //   //all string values in elasticsearch are lower if (key ==
      //   value = value.toLowerif (key == ();
      // }
      if (handler.match(value, _description)) {
        matchingHandler = handler;
        // Stop! we found a handler, no need to look further
        break;
      }
    }
    if (!matchingHandler) {
      throw new Error(`"${value}" is not a valid value for "${key}"`);
    }
    // If I'm here, I do have a handler for this 'key', with this 'value'
    // So set the new description at 'key' with the cleaned up value
    set(
      _description,
      key,
      matchingHandler.cleanedUp || matchingHandler.cleanUp(value, _description),
    );
    if (
      _description.main.numberOfFilters !== undefined &&
      key.indexOf('isFilter') >= 0
    ) {
      _description.main.numberOfFilters++;
      const endpoint = key.split('.')[0];
      _description[endpoint as Endpoint].order =
        _description[endpoint as Endpoint].order ||
        _description.main.numberOfFilters;
    }
  }

  type EndpointDescription = InterProDescription[Endpoint];
  type EndpointKeys = keyof EndpointDescription;

  Object.keys(_description).forEach((key) => {
    if (
      key !== 'main' &&
      key !== _description.main.key &&
      !_description[key as Endpoint].isFilter
    ) {
      Object.keys(_description[key as Endpoint]).forEach(
        (k) =>
          ((_description[key as Endpoint] as EndpointDescription)[
            k as EndpointKeys
          ] = null),
      );
    }
  });

  // Specific logic for 'other'
  _description.other.push(...(description?.other || []));
  Object.seal(_description.other);
  return _description;
};
