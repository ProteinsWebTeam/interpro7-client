// @flow
import * as handlers from 'utils/processLocation/handlers';

// describe parsing of the path as a directed graph of handlers

// define edges
handlers.mainDetailHandler.children = new Set([
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.organismHandler,
]);
handlers.proteomeAccessionHandler.children = new Set([
  handlers.structureHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
]);
handlers.proteomeHandler.children = new Set([
  handlers.structureHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.proteomeAccessionHandler,
]);
handlers.taxonomyAccessionHandler.children = new Set([
  handlers.structureHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.proteomeHandler,
]);
handlers.taxonomyHandler.children = new Set([
  handlers.structureHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.taxonomyAccessionHandler,
  handlers.proteomeHandler,
]);
handlers.organismHandler.children = new Set([
  handlers.structureHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.taxonomyHandler,
  handlers.proteomeHandler,
]);
handlers.memberDBAccessionHandler.children = new Set([
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.organismHandler,
  handlers.setHandler,
  handlers.mainDetailHandler,
]);
handlers.memberDBHandler.children = new Set([
  handlers.memberDBAccessionHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.organismHandler,
]);
handlers.interProAccessionHandler.children = new Set([
  handlers.memberDBHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.organismHandler,
  handlers.setHandler,
  handlers.mainDetailHandler,
]);
handlers.interProHandler.children = new Set([
  handlers.interProAccessionHandler,
  handlers.memberDBHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.organismHandler,
]);
handlers.integrationHandler.children = new Set([
  handlers.memberDBHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.organismHandler,
]);
handlers.structureChainHandler.children = new Set([
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.organismHandler,
  handlers.mainDetailHandler,
]);
handlers.structureAccessionHandler.children = new Set([
  handlers.structureChainHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.organismHandler,
  handlers.mainDetailHandler,
]);
handlers.structureDBHandler.children = new Set([
  handlers.structureAccessionHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.organismHandler,
]);
handlers.structureHandler.children = new Set([
  handlers.structureDBHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.organismHandler,
]);
handlers.proteinAccessionHandler.children = new Set([
  handlers.entryHandler,
  handlers.structureHandler,
  handlers.organismHandler,
  handlers.mainDetailHandler,
]);
handlers.proteinDBHandler.children = new Set([
  handlers.proteinAccessionHandler,
  handlers.entryHandler,
  handlers.structureHandler,
  handlers.organismHandler,
]);
handlers.proteinHandler.children = new Set([
  handlers.proteinDBHandler,
  handlers.entryHandler,
  handlers.organismHandler,
]);
handlers.entryHandler.children = new Set([
  handlers.interProHandler,
  handlers.memberDBHandler,
  handlers.integrationHandler,
  handlers.structureHandler,
  handlers.organismHandler,
]);
handlers.textSearchHandler.children = new Set([
  handlers.valueTextSearchHandler,
]);
handlers.sequenceSearchHandler.children = new Set([
  handlers.jobSequenceSearchHandler,
]);
handlers.jobSequenceSearchHandler.children = new Set([
  handlers.entryHandler,
  handlers.mainDetailHandler,
]);
handlers.searchHandler.children = new Set([
  handlers.textSearchHandler,
  handlers.sequenceSearchHandler,
]);
handlers.setAccessionHandler.children = new Set([
  handlers.structureHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.organismHandler,
]);

handlers.setDBHandler.children = new Set([
  handlers.setAccessionHandler,
  handlers.entryHandler,
]);
handlers.setHandler.children = new Set([handlers.setDBHandler]);
handlers.rootHandler.children = new Set([
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.organismHandler,
  handlers.setHandler,
  handlers.searchHandler,
  handlers.otherHandler,
]);

const MULTIPLE_SLASHES = /\/+/;

export default (path /*: string */) => {
  const parts = path.split(MULTIPLE_SLASHES).filter(Boolean);
  return handlers.rootHandler.handle(undefined, ...parts);
};
