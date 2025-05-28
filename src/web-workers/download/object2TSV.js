// @flow
import { get } from 'lodash-es';
import Papa from 'papaparse';

const regTag = /&lt;\/?(p|ul|li)&gt;/gi;
const regtax =
  /\<taxon [^>]+>([^<]+)<\/taxon>/gi; /* Remove TAG taxon and just keep the inside text part e.e <taxon tax_id="217897">...</taxon> */
const reg =
  /\<[^"].*?id="([^"]+)"\/>/gi; /* all TAGS containing ID e.g. [<cite id="PUB00068465"/>] <dbxref db="INTERPRO" id="IPR009071"/> */

export const decodeDescription = (
  description /*: Array<string> */,
) /*: string */ =>
  description
    .join('\n')
    .replace(regTag, '')
    .replace(regtax, '$1')
    .replace(reg, '$1')
    .replace('[]', '')
    .replace(/[\n\r]/g, '\n')
    .replace('()', '');

const mapToString =
  (selector /*:: ?: string */, serializer /*:: ?: function  */) =>
  (list /*: Array<mixed> */) =>
    list
      .map((item) => {
        const value = selector ? get(item, selector) : item;
        return serializer ? serializer(value) : value;
      })
      .join(';');

const locationsToString = (
  locations /*:: ?: Array<{fragments: Array<{start:number, end:number}>}>  */,
) =>
  locations
    ? locations
        .map(({ fragments }) =>
          fragments.map(({ start, end }) => `${start}..${end}`).join(','),
        )
        .join(',')
    : '';

const domains2string = (pfam, ipro) =>
  `${pfam.accession}{${pfam.name}}${
    ipro ? `:${ipro.accession}{${ipro.name}}` : ''
  }[${pfam.coordinates[0].fragments[0].start}-${
    pfam.coordinates[0].fragments[0].end
  }]`;

const IDADomainsToString = (domains) => {
  if (!domains?.length) return '';
  const pfamDomain = domains[0];
  const iproDomain = domains?.[1];
  if (!iproDomain) return domains2string(pfamDomain).replace(/,$/, '');
  if (iproDomain.accession.startsWith('PF'))
    return `${domains2string(pfamDomain)},${IDADomainsToString(
      domains.slice(1),
    )}`.replace(/,$/, '');
  return `${domains2string(pfamDomain, iproDomain)},${IDADomainsToString(
    domains.slice(2),
  )}`.replace(/,$/, '');
};

export const columns /*: {
  entry: Object,
  protein: Object,
  structure: Object,
  taxonomy: Object,
  proteome: Object,
  set: Object,
  proteinEntry?: Object,
  proteinStructure?: Object,
  structureProtein?: Object,
  structureEntry?: Object,
  entryStructure?: Object,
  entryProtein?: Object,
} */ = {
  entry: [
    { name: 'Accession', selector: 'metadata.accession' },
    { name: 'Name', selector: 'metadata.name' },
    { name: 'Short Name', selector: 'metadata.short_name' },
    { name: 'Source Database', selector: 'metadata.source_database' },
    { name: 'Type', selector: 'metadata.type' },
    { name: 'Integrated Into', selector: 'metadata.integrated' },
    {
      name: 'Integrated Signatures',
      selector: 'metadata.member_databases',
      serializer: (dbs /*: Object */) =>
        dbs
          ? Object.keys(dbs)
              .map((db) => Object.keys(dbs[db]).join(','))
              .join(',')
          : '',
    },
    {
      name: 'GO Terms',
      selector: 'metadata.go_terms',
      serializer: (terms /*: Array<{identifier: string}> */) =>
        terms ? terms.map((t) => t.identifier).join(',') : '',
    },
  ],
  protein: [
    { name: 'Accession', selector: 'metadata.accession' },
    { name: 'Source Database', selector: 'metadata.source_database' },
    { name: 'Name', selector: 'metadata.name' },
    { name: 'Tax ID', selector: 'metadata.source_organism.taxId' },
    { name: 'Tax Name', selector: 'metadata.source_organism.scientificName' },
    { name: 'Length', selector: 'metadata.length' },
  ],
  structure: [
    { name: 'Accession', selector: 'metadata.accession' },
    { name: 'Source Database', selector: 'metadata.source_database' },
    { name: 'Name', selector: 'metadata.name' },
    { name: 'Experiment Type', selector: 'metadata.experiment_type' },
    { name: 'Resolution', selector: 'metadata.resolution' },
  ],
  taxonomy: [
    { name: 'Accession', selector: 'metadata.accession' },
    { name: 'Source Database', selector: 'metadata.source_database' },
    { name: 'Name', selector: 'metadata.name' },
    { name: 'Parent', selector: 'metadata.parent' },
    {
      name: 'Children',
      selector: 'metadata.children',
      serializer: (children /*: Array<string> */) =>
        children ? children.join(',') : '',
    },
    { name: 'Number of Entries', selector: 'extra_fields.counters.entries' },
    { name: 'Number of Proteins', selector: 'extra_fields.counters.proteins' },
  ],
  proteome: [
    { name: 'Accession', selector: 'metadata.accession' },
    { name: 'Source Database', selector: 'metadata.source_database' },
    { name: 'Name', selector: 'metadata.name' },
    { name: 'Tax ID', selector: 'metadata.taxonomy' },
    { name: 'Number of Entries', selector: 'extra_fields.counters.entries' },
    { name: 'Number of Proteins', selector: 'extra_fields.counters.proteins' },
  ],
  set: [
    { name: 'Accession', selector: 'metadata.accession' },
    { name: 'Source Database', selector: 'metadata.source_database' },
    { name: 'Name', selector: 'metadata.name' },
    { name: 'Number of Entries', selector: 'extra_fields.counters.entries' },
    { name: 'Number of Proteins', selector: 'extra_fields.counters.proteins' },
  ],
  ebisearch: [
    { name: 'Accession', selector: 'id' },
    { name: 'Name', selector: 'fields.name[0]' },
    {
      name: 'Description',
      selector: 'fields.description',
      serializer: decodeDescription,
    },
    { name: 'Source Database', selector: 'fields.source_database[0]' },
  ],
  ida: [
    { name: 'IDA ID', selector: 'ida_id' },
    { name: 'IDA Text', selector: 'ida' },
    { name: 'Unique Proteins', selector: 'unique_proteins' },
    { name: 'Representative Accession', selector: 'representative.accession' },
    { name: 'Representative Length', selector: 'representative.length' },
    {
      name: 'Representative Domains',
      selector: 'representative.domains',
      serializer: IDADomainsToString,
    },
  ],
};
columns.proteinEntry = [
  ...columns.protein,
  { name: 'Entry Accession', selector: 'entries[0].accession' },
  {
    name: 'Matches',
    selector: 'entries[0].entry_protein_locations',
    serializer: locationsToString,
  },
];
columns.proteinStructure = [
  ...columns.protein,
  {
    name: 'Structure Accession',
    selector: 'structures',
    selectorInGroup: 'accession',
    serializer: mapToString('accession'),
  },
  {
    name: 'Chain',
    selector: 'structures',
    selectorInGroup: 'chain',
    serializer: mapToString('chain'),
  },
  {
    name: 'Structure Location',
    selector: 'structures',
    selectorInGroup: 'structure_protein_locations',
    serializer: mapToString('structure_protein_locations', locationsToString),
  },
];
columns.structureProtein = [
  ...columns.structure,
  {
    name: 'Chains',
    selector: 'proteins',
    selectorInGroup: 'chain',
    serializer: mapToString('chain'),
  },
  {
    name: 'Proteins',
    selector: 'proteins',
    selectorInGroup: 'accession',

    serializer: mapToString('accession'),
  },
  {
    name: 'Structure Location',
    selector: 'proteins',
    selectorInGroup: 'structure_protein_locations',
    serializer: mapToString('structure_protein_locations', locationsToString),
  },
];
columns.structureEntry = [
  ...columns.structure,
  {
    name: 'Chains',
    selector: 'entries',
    selectorInGroup: 'chain',
    serializer: mapToString('chain'),
  },
  {
    name: 'Proteins',
    selector: 'entries',
    selectorInGroup: 'protein',
    serializer: mapToString('protein'),
  },
  {
    name: 'Protein Length',
    selector: 'entries',
    selectorInGroup: 'protein_length',
    serializer: mapToString('protein_length'),
  },
  {
    name: 'Structure Location',
    selector: 'entries',
    selectorInGroup: 'structure_protein_locations',
    serializer: mapToString('structure_protein_locations', locationsToString),
  },
  {
    name: 'matches',
    selector: 'entries',
    selectorInGroup: 'entry_protein_locations',
    serializer: mapToString('entry_protein_locations', locationsToString),
  },
];
columns.entryStructure = [
  ...columns.entry,
  {
    name: 'Chains',
    selector: 'structures',
    selectorInGroup: 'chain',
    serializer: mapToString('chain'),
  },
  {
    name: 'Proteins',
    selector: 'structures',
    selectorInGroup: 'protein',
    serializer: mapToString('protein'),
  },
  {
    name: 'Protein Length',
    selector: 'structures',
    selectorInGroup: 'protein_length',
    serializer: mapToString('protein_length'),
  },
  {
    name: 'Structure Location',
    selector: 'structures',
    selectorInGroup: 'structure_protein_locations',
    serializer: mapToString('structure_protein_locations', locationsToString),
  },
  {
    name: 'matches',
    selector: 'structures',
    selectorInGroup: 'entry_protein_locations',
    serializer: mapToString('entry_protein_locations', locationsToString),
  },
];
columns.entryProtein = [
  ...columns.entry,
  { name: 'Protein Accession', selector: 'proteins[0].accession' },
  { name: 'Protein Length', selector: 'proteins[0].protein_length' },
  {
    name: 'Matches',
    selector: 'proteins[0].entry_protein_locations',
    serializer: locationsToString,
  },
];

export const object2TSV = (
  object /*: Object */,
  selectors /*: Array<{selector: string, serializer?: function}> */,
) => {
  const arr = selectors.map(({ selector, serializer }) => {
    const value = get(object, selector);
    if (typeof serializer === 'function') {
      return serializer(value);
    }
    return value;
  });
  const text = Papa.unparse([arr], {
    delimiter: '\t',
  });
  return text;
};
