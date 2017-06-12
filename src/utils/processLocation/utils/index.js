// @flow
import * as handlers from 'utils/processLocation/handlers';

export const getEmptyDescription = () => ({
  other: null,
  mainType: null,
  mainIntegration: null,
  mainDB: null,
  mainAccession: null,
  mainChain: null,
  mainMemberDB: null,
  mainMemberDBAccession: null,
  mainDetail: null,
  focusType: null,
  focusIntegration: null,
  focusDB: null,
  focusAccession: null,
  focusChain: null,
  focusMemberDB: null,
  focusMemberDBAccession: null,
});

export const descriptionItemToHandlers = new Map([
  [
    'other',
    new Set([handlers.otherHandler]),
  ],
  [
    'mainType',
    new Set([
      handlers.structureHandler,
      handlers.proteinHandler,
      handlers.entryHandler,
      handlers.proteomeHandler,
      handlers.pathwayHandler,
      handlers.searchHandler,
      handlers.otherHandler,
    ]),
  ],
  [
    'mainIntegration',
    new Set([handlers.integrationHandler]),
  ],
  [
    'mainDB',
    new Set([
      handlers.memberDBHandler,
      handlers.interProHandler,
      handlers.structureDBHandler,
      handlers.proteinDBHandler,
      handlers.sequenceSearchHandler,
      handlers.textSearchHandler,
    ]),
  ],
  [
    'mainAccession',
    new Set([
      handlers.memberDBAccessionHandler,
      handlers.interProAccessionHandler,
      handlers.structureAccessionHandler,
      handlers.proteinAccessionHandler,
      handlers.jobSequenceSearchHandler,
      handlers.valueTextSearchHandler,
    ]),
  ],
  [
    'mainChain',
    new Set([handlers.structureChainHandler]),
  ],
  [
    'mainMemberDB',
    new Set([handlers.memberDBHandler]),
  ],
  [
    'mainMemberDBAccession',
    new Set([handlers.memberDBAccessionHandler]),
  ],
  [
    'mainDetail',
    new Set([handlers.mainDetailHandler]),
  ],
  [
    'focusType',
    new Set([
      handlers.structureHandler,
      handlers.proteinHandler,
      handlers.entryHandler,
      handlers.proteomeHandler,
      handlers.pathwayHandler,
    ]),
  ],
  [
    'focusIntegration',
    new Set([handlers.integrationHandler]),
  ],
  [
    'focusDB',
    new Set([
      handlers.memberDBHandler,
      handlers.interProHandler,
      handlers.structureDBHandler,
      handlers.proteinDBHandler,
    ]),
  ],
  [
    'focusAccession',
    new Set([
      handlers.memberDBAccessionHandler,
      handlers.interProAccessionHandler,
      handlers.structureAccessionHandler,
      handlers.proteinAccessionHandler,
    ]),
  ],
  [
    'focusChain',
    new Set([handlers.structureChainHandler]),
  ],
  [
    'focusMemberDB',
    new Set([handlers.memberDBHandler]),
  ],
  [
    'focusMemberDBAccession',
    new Set([handlers.memberDBAccessionHandler]),
  ],
]);
