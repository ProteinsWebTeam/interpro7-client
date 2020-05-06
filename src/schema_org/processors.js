import config from 'config';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

const INTERPRO_DESCRIPTION =
  'InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites';

export const schemaProcessDataInterpro = ({ description = null }) => ({
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
  license: 'https://creativecommons.org/licenses/by/4.0/',
  datePublished: releaseDate,
  url: `https://www.ebi.ac.uk/interpro/entry/${name}`,
});

export const schemaProcessDataTable = ({ data: { db }, location }) => ({
  '@type': 'Dataset',
  '@id': '@mainEntity',
  identifier: db.canonical,
  name: db.name,
  version: db.version,
  url: location.href,
  hasPart: '@TableRow',
  includedInDataCatalog: {
    '@type': 'DataCatalog',
    '@id': config.root.website.protocol + config.root.website.href,
  },
  description: `Dataset of the type ${db.type || '?'} from the database ${
    db.name
  } - version ${db.version}`,
  license: 'https://creativecommons.org/licenses/by/4.0/',
});

export const schemaProcessDataTableRow = ({ data: { row, endpoint } }) => ({
  '@type': 'Dataset',
  '@id': '@TableRow',
  identifier: row.accession,
  name: row.name || row.db || row.source_database,
  description: `Data item of the type ${row.type || '?'} from the database ${
    row.db || row.source_database
  } with accession ${row.accession} and name ${row.name}`,
  license: 'https://creativecommons.org/licenses/by/4.0/',
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

export const isPartOf = (main, db, version, description = undefined) => ({
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
  description,
  license: 'https://creativecommons.org/licenses/by/4.0/',
});
export const schemaProcessIntegrated = ({ name, version }) => ({
  '@type': ['Dataset'],
  // '@type': ['Entry', 'BioChemEntity', 'CreativeWork'],
  '@id': '@isBasisFor',
  isPartOf: isPartOf('entry', 'InterPro', version, INTERPRO_DESCRIPTION),
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
// const mapTypeToOntology = new Map([
//   ['Domain', 'DomainAnnotation'],
//   ['Family', 'FamilyAnnotation'],
//   ['Repeat', 'RepeatAnnotation'],
//   ['Unknown', 'UnknownAnnotation'],
//   ['Conserved_site', 'ConservedSiteAnnotation'],
//   ['Binding_site', 'BindingSiteAnnotation'],
//   ['Active_site', 'ActiveSiteAnnotation'],
//   ['PTM', 'PTMAnnotation'],
// ]);

// export const schemaProcessDataRecord = ({ data, endpoint, version }) => ({
//   '@type': 'Dataset',
//   '@id': '@mainEntityOfPage',
//   identifier: data.metadata.source_database,
//   name: data.metadata.source_database,
//   description: data.metadata.description,
//   url: `https://www.ebi.ac.uk/interpro/${endpoint}/${data.metadata.source_database}/${data.metadata.accession}`,
//   mainEntity: '@mainEntity',
//   seeAlso: '@seeAlso',
//   isBasedOn: '@isBasedOn',
//   isBasisFor: '@isBasisFor',
//   citation: '@citation',
//   license: 'https://creativecommons.org/licenses/by/4.0/',
// });

export const endpoint2type = {
  entry: 'bio:ProteinAnnotation',
  protein: 'bio:Protein',
  taxonomy: 'bio:Taxon',
  proteome: 'bio:DataRecord',
  structure: 'bio:ProteinStructure',
  set: 'bio:DataRecord',
};

export const schemaProcessMainEntity = ({ data, type }) => {
  const schema = {
    // '@type': [type, 'StructuredValue', 'BioChemEntity', 'CreativeWork'],
    '@type': ['Dataset'],
    '@id': '@mainEntity',
    additionalType: endpoint2type[type],
    identifier: data.accession,
    url: `https://www.ebi.ac.uk/interpro/${type}/${data.source_database}/${data.accession}`,
    name: data.name.name || data.accession,
    alternateName: data.name.long || null,
    additionalProperty: '@additionalProperty',
    hasPart: '@hasPart',
    isContainedIn: '@isContainedIn',
    isPartOf: `https://www.ebi.ac.uk/interpro/${type}/${data.source_database}/`,
    license: 'https://creativecommons.org/licenses/by/4.0/',
  };
  schema.description = `The main entity of this document is a ${type} with accession number ${data.accession}`;
  // if (type === 'Entry') {
  //   schema['@type'].push(
  //     mapTypeToOntology.get(data.type) || mapTypeToOntology.get('Unknown'),
  //   );
  // }
  return schema;
};

export const schemaProcessCitations = ({ identifier, author, name }) => ({
  '@type': 'CreativeWork',
  '@id': '@citation',
  identifier,
  name,
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
  hasPart: '@hasPart',
});

export const schemaProcessDataPageSection = ({ name, description }) => ({
  '@type': 'WebPageElement',
  '@id': '@mainEntity',
  name,
  description,
});

export const schemaProcessInterProCitation = () => ({
  '@type': 'ScholarlyArticle',
  '@id': '@mainCitation',
  mainEntityOfPage: 'https://www.ebi.ac.uk/interpro/',
  name:
    'InterPro in 2019: improving coverage, classification and access to protein sequence annotations',
  headline:
    'InterPro in 2019: improving coverage, classification and access to protein sequence annotations',
  url: 'https://doi.org/10.1093/nar/gky1100',
  datePublished: '2019-01',
  dateModified: '2019-01',
  publisher: {
    '@type': 'Organization',
    '@id': 'https://academic.oup.com/nar',
    name: 'Nucleic Acids Research',
    url: 'https://academic.oup.com/nar',
    logo: {
      '@type': 'imageObject',
      url: 'https://example.com/logo.png',
    },
  },
  image:
    'https://proteinswebteam.github.io/interpro-blog/assets/media/images/logo_medium.png',
  author: [
    'Mitchell AL',
    'Attwood TK',
    'Babbitt PC',
    'Blum M',
    'Bork P',
    'Bridge A',
    'Brown SD',
    'Chang HY',
    'El-Gebali S',
    'Fraser MI',
    'Gough J',
    'Haft DR',
    'Huang H',
    'Letunic I',
    'Lopez R',
    'Luciani A',
    'Madeira F',
    'Marchler-Bauer A',
    'Mi H',
    'Natale DA',
    'Necci M',
    'Nuka G',
    'Orengo C',
    'Pandurangan AP',
    'Paysan-Lafosse T',
    'Pesseat S',
    'Potter SC',
    'Qureshi MA',
    'Rawlings ND',
    'Redaschi N',
    'Richardson LJ',
    'Rivoire C',
    'Salazar GA',
    'Sangrador-Vegas A',
    'Sigrist CJA',
    'Sillitoe I',
    'Sutton GG',
    'Thanki N',
    'Thomas PD',
    'Tosatto SCE',
    'Yong SY',
    'Finn RD',
  ],
  sameAs: [
    'https://academic.oup.com/nar/article/47/D1/D351/5162469',
    'https://www.ncbi.nlm.nih.gov/pubmed/30398656',
  ],
});
