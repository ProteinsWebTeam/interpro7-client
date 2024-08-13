import { get, set } from 'lodash-es';

import getEmptyDescription from 'utils/processDescription/emptyDescription';
import descriptionItemToHandlers from 'utils/processDescription/descriptionItemToHandlers';
import { InterpolationTypes } from 'molstar/lib/mol-geo/geometry/image/image';
import emptyDescription from 'utils/processDescription/emptyDescription';

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

  type SpecificDescription<OuterObj> = {
    [Property in keyof OuterObj]: OuterObj[Property];
  };

  type PossibleOuterKeys = Endpoint | 'search' | 'result' | 'main';
  type EndpointDescription<Key extends PossibleOuterKeys> = SpecificDescription<
    InterProDescription[Key]
  >;

  Object.keys(_description).forEach((key) => {
    if (
      key !== 'main' &&
      key !== _description.main.key &&
      !_description[key as Endpoint].isFilter
    ) {
      let internalObject: any = null;
      let internalKeys = [];

      switch (key) {
        case 'entry':
          internalObject = _description[
            'entry'
          ] as EndpointDescription<'entry'>;
        case 'protein':
          internalObject = _description[
            'protein'
          ] as EndpointDescription<'protein'>;
        case 'structure':
          internalObject = _description[
            'structure'
          ] as EndpointDescription<'protein'>;
        case 'taxonomy':
          internalObject = _description[
            'taxonomy'
          ] as EndpointDescription<'taxonomy'>;
        case 'proteome':
          internalObject = _description[
            'proteome'
          ] as EndpointDescription<'proteome'>;
        case 'set':
          internalObject = _description['set'] as EndpointDescription<'set'>;
      }

      if (internalObject && internalObject !== undefined) {
        internalKeys = Object.keys(
          internalObject,
        ) as (keyof typeof internalObject)[];
        internalKeys.forEach((k) => {
          internalObject[k] = null;
        });
      }
    }
  });

  // Specific logic for 'other'
  _description.other.push(...(description?.other || []));
  Object.seal(_description.other);

  return _description;
};
