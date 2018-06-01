import * as handlers from 'utils/processDescription/handlers';

const otherHandlerSet = new Set([handlers.otherHandler]);

export default new Map([
  [
    'main.key',
    new Set([
      handlers.entryHandler,
      handlers.proteinHandler,
      handlers.structureHandler,
      handlers.taxonomyHandler,
      handlers.proteomeHandler,
      handlers.setHandler,
      handlers.searchHandler,
      handlers.jobHandler,
    ]),
  ],
  ['entry.isFilter', new Set([handlers.entryHandler])],
  ['entry.integration', new Set([handlers.integrationHandler])],
  [
    'entry.db',
    new Set([
      handlers.interProHandler,
      handlers.memberDBHandler,
      handlers.allEntriesHandler,
    ]),
  ],
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
  ['protein.isFilter', new Set([handlers.proteinHandler])],
  ['protein.db', new Set([handlers.proteinDBHandler])],
  ['protein.accession', new Set([handlers.proteinAccessionHandler])],
  ['protein.detail', new Set([handlers.detailHandler])],
  ['structure.isFilter', new Set([handlers.structureHandler])],
  ['structure.db', new Set([handlers.structureDBHandler])],
  ['structure.accession', new Set([handlers.structureAccessionHandler])],
  ['structure.chain', new Set([handlers.structureChainHandler])],
  ['structure.detail', new Set([handlers.detailHandler])],
  ['taxonomy.isFilter', new Set([handlers.taxonomyHandler])],
  ['taxonomy.db', new Set([handlers.taxonomyDBHandler])],
  ['taxonomy.accession', new Set([handlers.taxonomyAccessionHandler])],
  ['taxonomy.detail', new Set([handlers.detailHandler])],
  ['proteome.isFilter', new Set([handlers.proteomeHandler])],
  ['proteome.db', new Set([handlers.proteomeDBHandler])],
  ['proteome.accession', new Set([handlers.proteomeAccessionHandler])],
  ['proteome.detail', new Set([handlers.detailHandler])],
  ['set.isFilter', new Set([handlers.setHandler])],
  ['set.db', new Set([handlers.setDBHandler])],
  ['set.accession', new Set([handlers.setAccessionHandler])],
  ['set.detail', new Set([handlers.detailHandler])],
  ['search.type', new Set([handlers.searchTypeHandler])],
  ['search.value', new Set([handlers.searchValueHandler])],
  ['job.type', new Set([handlers.jobTypeHandler])],
  [
    'job.accession',
    new Set([
      handlers.jobIPScanAccessionHandler,
      handlers.jobDownloadAccessionHandler,
    ]),
  ],
  ['job.detail', new Set([handlers.detailHandler])],
  ['other.0', otherHandlerSet],
  ['other.1', otherHandlerSet],
]);
