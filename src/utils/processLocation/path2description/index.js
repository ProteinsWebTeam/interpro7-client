// @flow
import * as handlers from 'utils/processLocation/handlers';

// describe parsing of the path as a directed graph of handlers

// define edges
handlers.mainDetailHandler.children = new Set([
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
]);
handlers.memberDBAccessionHandler.children = new Set([
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.mainDetailHandler,
]);
handlers.memberDBHandler.children = new Set([
  handlers.memberDBAccessionHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
]);
handlers.interProAccessionHandler.children = new Set([
  handlers.memberDBHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.mainDetailHandler,
]);
handlers.interProHandler.children = new Set([
  handlers.interProAccessionHandler,
  handlers.memberDBHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
]);
handlers.integrationHandler.children = new Set([
  handlers.memberDBHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
]);
handlers.structureChainHandler.children = new Set([
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.mainDetailHandler,
]);
handlers.structureAccessionHandler.children = new Set([
  handlers.structureChainHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.mainDetailHandler,
]);
handlers.structureDBHandler.children = new Set([
  handlers.structureAccessionHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
]);
handlers.structureHandler.children = new Set([
  handlers.structureDBHandler,
  handlers.entryHandler,
  handlers.proteinHandler,
]);
handlers.proteinAccessionHandler.children = new Set([
  handlers.entryHandler,
  handlers.structureHandler,
  handlers.mainDetailHandler,
]);
handlers.proteinDBHandler.children = new Set([
  handlers.proteinAccessionHandler,
  handlers.entryHandler,
  handlers.structureHandler,
]);
handlers.proteinHandler.children = new Set([
  handlers.proteinDBHandler,
  handlers.entryHandler,
  handlers.structureHandler,
]);
handlers.entryHandler.children = new Set([
  handlers.interProHandler,
  handlers.memberDBHandler,
  handlers.integrationHandler,
]);
handlers.rootHandler.children = new Set([
  handlers.entryHandler,
  handlers.proteinHandler,
  handlers.structureHandler,
  handlers.otherHandler,
]);

const MULTIPLE_SLASHES = /\/+/;
const notFalsy = x => x;

export default (path/*: string */) => {
  const parts = path.split(MULTIPLE_SLASHES).filter(notFalsy);
  // eslint-disable-next-line no-undefined
  return handlers.rootHandler.handle(undefined, ...parts);
};
