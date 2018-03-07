import config from 'config';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

export const schemaProcessDataTable = ({ data: { db }, location }) => ({
  '@type': 'Dataset',
  '@id': '@mainEntityOfPage',
  identifier: db.canonical,
  name: db.name,
  version: db.version,
  url: location.href,
  hasPart: '@hasPart',
  includedInDataCatalog: {
    '@type': 'DataCatalog',
    '@id': config.root.website.protocol + config.root.website.href,
  },
});

export const schemaProcessDataTableRow = ({ data: { row, endpoint } }) => ({
  '@type': 'DataRecord',
  '@id': '@hasPart',
  identifier: row.accession,
  name: row.db || row.source_database,
  url:
    config.root.website.protocol +
    config.root.website.href +
    descriptionToPath({
      main: { key: endpoint },
      [endpoint]: {
        db: row.db || row.source_database,
        accession: row.accession.toString(),
      },
    }),
});

export const schemaProcessIntegrated = ({ name, version }) => ({
  '@type': ['Entry', 'BioChemEntity', 'CreativeWork'],
  '@id': '@isBasisFor',
  isPartOf: {
    '@type': 'Dataset',
    '@id':
      config.root.website.protocol +
      config.root.website.href +
      descriptionToPath({
        main: { key: 'entry' },
        entry: { db: 'InterPro' },
      }),
    version,
    name: 'InterPro',
  },
  name,
  url:
    config.root.website.protocol +
    config.root.website.href +
    descriptionToPath({
      main: { key: 'entry' },
      entry: { db: 'InterPro', accession: name },
    }),
});
