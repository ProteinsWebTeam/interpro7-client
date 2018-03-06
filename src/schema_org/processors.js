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
  name: row.db,
  url:
    config.root.website.protocol +
    config.root.website.href +
    descriptionToPath({
      main: { key: endpoint },
      [endpoint]: { db: row.db, accession: row.accession },
    }),
});
