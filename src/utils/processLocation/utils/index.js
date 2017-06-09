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

export const descriptionItemToHandler = new Map([
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
    ]),
  ],
  [
    'mainAccession',
    new Set([
      handlers.memberDBAccessionHandler,
      handlers.interProAccessionHandler,
      handlers.structureAccessionHandler,
      handlers.proteinAccessionHandler,
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
