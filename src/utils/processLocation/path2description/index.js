// @flow
import * as handlers from 'utils/processLocation/handlers';

// describe parsing of the path as a directed graph of handlers

// define edges
handlers.mainDetailHandler.children = new Set([
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
]);
handlers.memberDBAccessionHandler.children = new Set([
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
  handlers.mainDetailHandler,
]);
handlers.memberDBHandler.children = new Set([
  handlers.memberDBAccessionHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
]);
handlers.interProAccessionHandler.children = new Set([
  handlers.memberDBHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
  handlers.mainDetailHandler,
]);
handlers.interProHandler.children = new Set([
  handlers.interProAccessionHandler,
  handlers.memberDBHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
]);
handlers.integrationHandler.children = new Set([
  handlers.memberDBHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
]);
handlers.structureChainHandler.children = new Set([
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
  handlers.mainDetailHandler,
]);
handlers.structureAccessionHandler.children = new Set([
  handlers.structureChainHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
  handlers.mainDetailHandler,
]);
handlers.structureDBHandler.children = new Set([
  handlers.structureAccessionHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
]);
handlers.structureHandler.children = new Set([
  handlers.structureDBHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
]);
handlers.proteinAccessionHandler.children = new Set([
  handlers.entryHandler,
  handlers.structureHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
  handlers.mainDetailHandler,
]);
handlers.proteinDBHandler.children = new Set([
  handlers.proteinAccessionHandler,
  handlers.entryHandler,
  handlers.structureHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
]);
handlers.proteinHandler.children = new Set([
  handlers.proteinDBHandler,
  handlers.entryHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
]);
handlers.entryHandler.children = new Set([
  handlers.interProHandler,
  handlers.memberDBHandler,
  handlers.integrationHandler,
  handlers.structureHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
]);
handlers.textSearchHandler.children = new Set([
  handlers.valueTextSearchHandler,
]);
handlers.sequenceSearchHandler.children = new Set([
  handlers.jobSequenceSearchHandler,
]);
handlers.searchHandler.children = new Set([
  handlers.textSearchHandler,
  handlers.sequenceSearchHandler,
]);
handlers.rootHandler.children = new Set([
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.proteomeHandler,
  handlers.pathwayHandler,
  handlers.searchHandler,
  handlers.otherHandler,
]);

const MULTIPLE_SLASHES = /\/+/;
const notFalsy = x => x;

export default (path /*: string */) => {
  const parts = path.split(MULTIPLE_SLASHES).filter(notFalsy);
  return handlers.rootHandler.handle(undefined, ...parts);
};
