import { get } from 'lodash-es';

const mapToString = (selector, serializer) => list =>
  list
    .map(item => {
      const value = selector ? get(item, selector) : item;
      return serializer ? serializer(value) : value;
    })
    .join(';');

const locationsToString = locations =>
  locations
    ? locations
        .map(({ fragments }) =>
          fragments.map(({ start, end }) => `${start}..${end}`).join(','),
        )
        .join(',')
    : '';

export const columns = {
  entry: [
    { name: 'Accession', selector: 'metadata.accession' },
    { name: 'Name', selector: 'metadata.name' },
    { name: 'Source Database', selector: 'metadata.source_database' },
    { name: 'Type', selector: 'metadata.type' },
    { name: 'Integrated Into', selector: 'metadata.integrated' },
    {
      name: 'Integrated Signatures',
      selector: 'metadata.member_databases',
      serializer: dbs =>
        dbs
          ? Object.keys(dbs)
              .map(db => Object.keys(dbs[db]).join(','))
              .join(',')
          : '',
    },
    {
      name: 'GO Terms',
      selector: 'metadata.go_terms',
      serializer: terms =>
        terms ? terms.map(t => t.identifier).join(',') : '',
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
      serializer: children => (children ? children.join(',') : ''),
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
  { name: 'Structure Accession', selector: 'structures[0].accession' },
  { name: 'Chain', selector: 'structures[0].chain' },
  {
    name: 'Structure Location',
    selector: 'structures[0].structure_protein_locations',
    serializer: locationsToString,
  },
];
columns.structureProtein = [
  ...columns.structure,
  { name: 'Chains', selector: 'proteins', serializer: mapToString('chain') },
  {
    name: 'Proteins',
    selector: 'proteins',
    serializer: mapToString('accession'),
  },
  {
    name: 'Structure Location',
    selector: 'proteins',
    serializer: mapToString('structure_protein_locations', locationsToString),
  },
];
columns.structureEntry = [
  ...columns.structure,
  { name: 'Chains', selector: 'entries', serializer: mapToString('chain') },
  { name: 'Proteins', selector: 'entries', serializer: mapToString('protein') },
  {
    name: 'Protein Length',
    selector: 'entries',
    serializer: mapToString('protein_length'),
  },
  {
    name: 'Structure Location',
    selector: 'entries',
    serializer: mapToString('structure_protein_locations', locationsToString),
  },
  {
    name: 'matches',
    selector: 'entries',
    serializer: mapToString('entry_protein_locations', locationsToString),
  },
];
columns.entryStructure = [
  ...columns.entry,
  { name: 'Chains', selector: 'structures', serializer: mapToString('chain') },
  {
    name: 'Proteins',
    selector: 'structures',
    serializer: mapToString('protein'),
  },
  {
    name: 'Protein Length',
    selector: 'structures',
    serializer: mapToString('protein_length'),
  },
  {
    name: 'Structure Location',
    selector: 'structures',
    serializer: mapToString('structure_protein_locations', locationsToString),
  },
  {
    name: 'matches',
    selector: 'structures',
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

export const object2TSV = (object, selectors) => {
  return selectors
    .map(({ selector, serializer }) => {
      const value = get(object, selector);
      if (typeof serializer === 'function') {
        return serializer(value);
      }
      return value;
    })
    .join('\t');
};
