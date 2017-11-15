// @flow
import * as handlers from 'utils/processLocation/handlers';
/*:: import type { Handler } from 'utils/processLocation/handlers'; */

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

// Note: they need to be order from more to less restrictive.
export const descriptionItemToHandlers /*: Map<string, Set<Handler>> */ = new Map(
  [
    ['other', new Set([handlers.otherHandler])],
    [
      'mainType',
      new Set([
        handlers.structureHandler,
        handlers.proteinHandler,
        handlers.entryHandler,
        handlers.setHandler,
        handlers.organismHandler,
        handlers.searchHandler,
        handlers.otherHandler,
      ]),
    ],
    ['mainIntegration', new Set([handlers.integrationHandler])],
    [
      'mainDB',
      new Set([
        handlers.memberDBHandler,
        handlers.interProHandler,
        handlers.structureDBHandler,
        handlers.proteinDBHandler,
        handlers.proteomeHandler,
        handlers.taxonomyHandler,
        handlers.sequenceSearchHandler,
        handlers.textSearchHandler,
      ]),
    ],
    [
      'mainAccession',
      new Set([
        handlers.jobSequenceSearchHandler,
        handlers.interProAccessionHandler,
        handlers.memberDBAccessionHandler,
        handlers.structureAccessionHandler,
        handlers.proteinAccessionHandler,
        handlers.proteomeAccessionHandler,
        handlers.taxonomyAccessionHandler,
        handlers.valueTextSearchHandler,
      ]),
    ],
    ['mainChain', new Set([handlers.structureChainHandler])],
    [
      'mainMemberDB',
      new Set([handlers.memberDBHandler, handlers.proteomeHandler]),
    ],
    [
      'mainMemberDBAccession',
      new Set([
        handlers.memberDBAccessionHandler,
        handlers.proteomeAccessionHandler,
      ]),
    ],
    ['mainDetail', new Set([handlers.mainDetailHandler])],
    [
      'focusType',
      new Set([
        handlers.structureHandler,
        handlers.proteinHandler,
        handlers.entryHandler,
        handlers.organismHandler,
        handlers.setHandler,
      ]),
    ],
    ['focusIntegration', new Set([handlers.integrationHandler])],
    [
      'focusDB',
      new Set([
        handlers.memberDBHandler,
        handlers.interProHandler,
        handlers.structureDBHandler,
        handlers.proteinDBHandler,
        handlers.proteomeHandler,
        handlers.taxonomyHandler,
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
    ['focusChain', new Set([handlers.structureChainHandler])],
    [
      'focusMemberDB',
      new Set([handlers.memberDBHandler, handlers.proteomeHandler]),
    ],
    [
      'focusMemberDBAccession',
      new Set([
        handlers.memberDBAccessionHandler,
        handlers.proteomeAccessionHandler,
      ]),
    ],
  ],
);
