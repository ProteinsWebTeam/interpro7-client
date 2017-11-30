// @flow
import * as handlers from 'utils/processDescription/handlers';

const otherHandlerSet = new Set([handlers.otherHandler]);

export default new Map([
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
  ['entry.integration', new Set([handlers.integrationHandler])],
  ['entry.db', new Set([handlers.interProHandler, handlers.memberDBHandler])],
  [
    'entry.accession',
    new Set([
      handlers.interProAccessionHandler,
      handlers.memberDBAccessionHandler,
    ]),
  ],
  ['entry.memberDB', new Set([handlers.memberDBHandler])],
  ['entry.memberDBAccession', new Set([handlers.memberDBAccessionHandler])],
  ['entry.detail', new Set([handlers.detailHandler])],
  ['protein.db', new Set([handlers.proteinDBHandler])],
  ['protein.accession', new Set([handlers.proteinAccessionHandler])],
  ['protein.detail', new Set([handlers.detailHandler])],
  ['structure.db', new Set([handlers.structureDBHandler])],
  ['structure.accession', new Set([handlers.structureAccessionHandler])],
  ['structure.chain', new Set([handlers.structureChainHandler])],
  ['structure.detail', new Set([handlers.detailHandler])],
  ['organism.db', new Set([handlers.taxonomyDBHandler])],
  ['organism.accession', new Set([handlers.taxonomyAccessionHandler])],
  ['organism.proteomeDB', new Set([handlers.proteomeDBHandler])],
  ['organism.proteomeAccession', new Set([handlers.proteomeAccessionHandler])],
  ['organism.detail', new Set([handlers.detailHandler])],
  ['set.db', new Set([handlers.setDBHandler])],
  ['set.accession', new Set([handlers.setAccessionHandler])],
  ['set.detail', new Set([handlers.detailHandler])],
  ['search.type', new Set([handlers.searchTypeHandler])],
  ['search.value', new Set([handlers.searchValueHandler])],
  ['job.type', new Set([handlers.jobHandler])],
  ['job.accession', new Set([handlers.jobAccessionHandler])],
  ['job.detail', new Set([handlers.detailHandler])],
  ['other.0', otherHandlerSet],
  ['other.1', otherHandlerSet],
]);
