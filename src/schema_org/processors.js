import config from 'config';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

export const schemaProcessDataInterpro = ({
  location,
  description = null,
}) => ({
  '@type': 'DataCatalog',
  '@id': '@mainEntityOfPage',
  name: 'InterPro',
  description,
  url: 'https://www.ebi.ac.uk/interpro/',
  keywords: ['InterPro', 'Domain', 'Family', 'Annotation', 'Protein'],
  provider: {
    '@type': 'Organization',
    name: 'European Bioinformatics Institute',
    url: 'https://www.ebi.ac.uk/',
  },
  citation: '@citation',
  dataset: '@dataset',
});
export const schemaProcessDataForDB = ({
  name,
  location,
  releaseDate = null,
  version = null,
  description = null,
}) => ({
  '@type': 'Dataset',
  '@id': '@dataset',
  name,
  identifier: name,
  version,
  description,
  license: '@license',
  datePublished: releaseDate,
  url: `https://www.ebi.ac.uk/interpro/entry/${name}`,
});

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
  '@type': 'Dataset',
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

export const isPartOf = (main, db, version) => ({
  '@type': 'Dataset',
  '@id':
    config.root.website.protocol +
    config.root.website.href +
    descriptionToPath({
      main: { key: main },
      [main]: { db },
    }),
  version,
  name: db,
});
export const schemaProcessIntegrated = ({ name, version }) => ({
  '@type': ['Entry', 'BioChemEntity', 'CreativeWork'],
  '@id': '@isBasisFor',
  isPartOf: isPartOf('entry', 'InterPro', version),
  name,
  url:
    config.root.website.protocol +
    config.root.website.href +
    descriptionToPath({
      main: { key: 'entry' },
      entry: { db: 'InterPro', accession: name },
    }),
});

export const isContainedInOrganism = ({ taxId, fullName = null }) => ({
  '@id': '@isContainedIn',
  '@type': 'BioChemEntity',
  additionalType: 'http://semanticscience.org/resource/SIO_010000',
  identifier: taxId,
  name: fullName,
  url: `http://purl.bioontology.org/ontology/NCBITAXON/${taxId}`,
  sameAs: `http://purl.uniprot.org/taxonomy/${taxId}`,
});

export const isTranscribedFrom = ({ gene }) => ({
  '@id': '@additionalProperty',
  '@type': 'PropertyValue',
  additionalType: 'http://semanticscience.org/resource/SIO_010081',
  name: 'gene',
  value: {
    '@type': ['StructuredValue', 'BioChemEntity'],
    additionalType: 'http://semanticscience.org/resource/SIO_010035',
    identifier: gene,
    name: gene,
  },
});
const mapTypeToOntology = new Map([
  ['Domain', 'DomainAnnotation'],
  ['Family', 'FamilyAnnotation'],
  ['Repeat', 'RepeatAnnotation'],
  ['Unknown', 'UnknownAnnotation'],
  ['Conserved_site', 'ConservedSiteAnnotation'],
  ['Binding_site', 'BindingSiteAnnotation'],
  ['Active_site', 'ActiveSiteAnnotation'],
  ['PTM', 'PTMAnnotation'],
]);

export const schemaProcessDataRecord = ({ data, endpoint, version }) => ({
  '@type': 'Dataset',
  '@id': '@mainEntityOfPage',
  identifier: data.metadata.accession,
  isPartOf: isPartOf(endpoint, data.metadata.source_database, version),
  mainEntity: '@mainEntity',
  seeAlso: '@seeAlso',
  isBasedOn: '@isBasedOn',
  isBasisFor: '@isBasisFor',
  citation: '@citation',
});

export const schemaProcessMainEntity = ({ data, type }) => {
  const schema = {
    '@type': [type, 'StructuredValue', 'BioChemEntity', 'CreativeWork'],
    '@id': '@mainEntity',
    identifier: data.accession,
    name: data.name.name || data.accession,
    alternateName: data.name.long || null,
    additionalProperty: '@additionalProperty',
    contains: '@contains',
    isContainedIn: '@isContainedIn',
    signature: '@signature',
  };
  if (type === 'Entry') {
    schema['@type'].push(
      mapTypeToOntology.get(data.type) || mapTypeToOntology.get('Unknown'),
    );
  }
  return schema;
};

export const schemaProcessCitations = ({ identifier, author }) => ({
  '@type': 'ScholarlyArticle',
  '@id': '@citation',
  identifier,
  author,
});

export const schemaProcessDataWebPage = ({ name, description, location }) => ({
  '@type': 'WebPage',
  '@id': '@mainEntityOfPage',
  name,
  description,
  url: location.href,
  keywords: ['InterPro', 'Domain', 'Family', 'Annotation', 'Protein'],
  provider: {
    '@type': 'Organization',
    name: 'European Bioinformatics Institute',
    url: 'https://www.ebi.ac.uk/',
  },
  contains: '@contains',
});

export const schemaProcessDataPageSection = ({ name, description }) => ({
  '@type': 'WebPageElement',
  '@id': '@contains',
  name,
  description,
});

export const schemaProcessLicense = () => ({
  '@type': 'CreativeWork',
  '@id': '@license',
  name: 'Creative Commons CC4 Attribution',
  url: 'https://creativecommons.org/licenses/by/4.0/',
});
