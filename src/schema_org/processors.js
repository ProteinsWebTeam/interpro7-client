import config from 'config';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { getDescriptionText } from 'components/Description';

const INTERPRO_DESCRIPTION =
  'InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites';

export const schemaProcessDataInterpro = ({ description = null }) => ({
  '@type': 'Dataset',
  '@id': '@mainEntity',
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
  hasPart: '@dataset',
  license: 'https://creativecommons.org/licenses/by/4.0/',
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
  isPartOf: {
    '@type': 'Dataset',
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
  '@id': '@additionalProperty',
  '@type': 'PropertyValue',
  name: 'isContainedIn',
  value: {
    '@type': 'StructuredValue',
    additionalType: [
      'bio:Taxon',
      'bio:BioChemEntity',
      'http://semanticscience.org/resource/SIO_010000',
    ],
    identifier: taxId,
    name: fullName,
    url: `http://purl.bioontology.org/ontology/NCBITAXON/${taxId}`,
    sameAs: `http://purl.uniprot.org/taxonomy/${taxId}`,
  },
});

export const isTranscribedFrom = ({ gene }) => ({
  '@id': '@additionalProperty',
  '@type': 'PropertyValue',
  additionalType: 'http://semanticscience.org/resource/SIO_010081',
  name: 'gene',
  value: {
    '@type': 'StructuredValue',
    additionalType: [
      'bio:Gene',
      'bio:BioChemEntity',
      'http://semanticscience.org/resource/SIO_010035',
    ],
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

const cleanUpDescription = (description /*: string */) =>
  getDescriptionText(
    (Array.isArray(description) ? description[0] : description) || '',
  )
    .replace(/\r/g, '')
    .replace(/\n/g, '')
    .replace(/<\/?[a-zA-Z]+>/g, '')
    .replace(/\[(\[cite:[a-zA-Z0-9]+\](, )?)+\]/g, '')
    .replace(/\[(PMID: [0-9]+(, )?)+\]/g, '');

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
  if (data.description) {
    schema.description = cleanUpDescription(data.description);
  } else
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
  '@type': 'CreativeWork',
  '@id': '@mainCitation',
  mainEntityOfPage: 'https://www.ebi.ac.uk/interpro/',
  name: 'The InterPro protein families and domains database: 20 years on',
  headline: 'The InterPro protein families and domains database: 20 years on',
  url: 'https://doi.org/10.1093/nar/gkaa977',
  datePublished: '2020-11',
  dateModified: '2020-11',
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
    'Blum M',
    'Chang H',
    'Chuguransky S',
    'Grego T',
    'Kandasaamy S',
    'Mitchell A',
    'Nuka G',
    'Paysan-Lafosse T',
    'Qureshi M',
    'Raj S',
    'RichardsonL',
    'Salazar GA',
    'Williams L',
    'Bork P',
    'Bridge A',
    'Gough J',
    'Haft DH',
    'Letunic I',
    'Marchler-Bauer A',
    'Mi H',
    'Natale DA',
    'Necci M',
    'Orengo CA',
    'Pandurangan AP',
    'Rivoire C',
    'Sigrist CJA',
    'Sillitoe I',
    'Thanki N',
    'Thomas PD',
    'Tosatto SCE',
    'Wu CH',
    'Bateman A',
    'Finn RD',
  ],
  sameAs: [
    'https://academic.oup.com/nar/advance-article/doi/10.1093/nar/gkaa977/5958491',
    'https://pubmed.ncbi.nlm.nih.gov/33156333/',
  ],
});
