// @flow
import * as handlers from 'utils/processDescription/handlers';

const otherHandlerSet = new Set([handlers.otherHandler]);

export default new Map([
  ['other.0', otherHandlerSet],
  ['other.1', otherHandlerSet],
  [
    'main.key',
    new Set([
      handlers.entryHandler,
      handlers.proteinHandler,
      handlers.structureHandler,
      handlers.organismHandler,
      handlers.setHandler,
      handlers.searchHandler,
      handlers.jobHandler,
    ]),
  ],
]);
