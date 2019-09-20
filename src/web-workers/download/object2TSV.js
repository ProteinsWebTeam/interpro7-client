import { get } from 'lodash-es';

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
