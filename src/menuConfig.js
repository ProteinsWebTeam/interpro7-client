// @flow
import getEmptyDescription from 'utils/processDescription/emptyDescription';

import f from 'styles/foundation';

/* ::
  type Location = {|
    description: {|[key: string]: string|},
    search: {|[key: string]: string|},
    hash: string,
  |};
*/

export const EBI /*: Array<Object> */ = [
  {
    href: 'https://www.ebi.ac.uk',
    icon: 'H',
    name: 'EMBL-EBI',
  },
  {
    href: 'https://www.ebi.ac.uk/services',
    icon: '(',
    name: 'Services',
  },
  {
    href: 'https://www.ebi.ac.uk/research',
    icon: ')',
    name: 'Research',
  },
  {
    href: 'https://www.ebi.ac.uk/training',
    icon: 't',
    name: 'Training',
  },
  {
    href: 'https://www.ebi.ac.uk/about',
    icon: 'i',
    name: 'About EBI',
  },
];

export const entities /*: Array<Object> */ = [
  {
    to(location) {
      return {
        description: {
          main: { key: 'entry' },
          entry: {
            db:
              location.description.entry.integration ||
              location.description.entry.db ||
              'InterPro',
          },
        },
      };
    },
    name: 'Entry',
  },
  {
    to(location) {
      return {
        description: {
          main: { key: 'protein' },
          protein: { db: 'UniProt' },
        },
      };
    },
    name: 'Protein',
  },
  {
    to(location) {
      return {
        description: {
          main: { key: 'structure' },
          structure: { db: 'PDB' },
        },
      };
    },
    name: 'Structure',
  },
  {
    to(location) {
      return {
        description: {
          main: { key: 'organism' },
          organism: { db: 'taxonomy' },
        },
      };
    },
    name: 'Organism',
  },
  {
    to(location) {
      return {
        description: {
          main: { key: 'set' },
          set: { db: 'all' },
        },
      };
    },
    name: 'Set',
  },
];

export const singleEntity /*: Map<string, Object> */ = new Map([
  [
    'overview',
    {
      to(location) {
        const { key } = location.description.main.key;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...location.description[key],
              detail: null,
            },
          },
        };
      },
      name: 'Overview',
    },
  ],
  [
    'entry',
    {
      to(location) {
        const { key } = location.description.main.key;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...location.description[key],
              detail: null,
            },
            entry: {
              isFilter: true,
              db: key === 'set' ? location.description[key].db : 'all',
            },
          },
        };
      },
      name: 'Entries',
      counter: 'entries',
    },
  ],
  [
    'protein',
    {
      to(location) {
        const { key } = location.description.main.key;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...location.description[key],
              detail: null,
            },
            protein: {
              isFilter: true,
              db: 'UniProt',
            },
          },
        };
      },
      name: 'Proteins',
      counter: 'proteins',
    },
  ],
  [
    'structure',
    {
      to(location) {
        const { key } = location.description.main.key;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...location.description[key],
              detail: null,
            },
            structure: {
              isFilter: true,
              db: 'PDB',
            },
          },
        };
      },
      name: 'Structures',
      counter: 'structures',
    },
  ],
  [
    'organism',
    {
      to(location) {
        const { key } = location.description.main.key;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...location.description[key],
              detail: null,
            },
            organism: {
              isFilter: true,
              db: 'taxonomy',
            },
          },
        };
      },
      name: 'Organisms',
      counter: 'organisms',
    },
  ],
  [
    'set',
    {
      to(location) {
        const { key } = location.description.main.key;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...location.description[key],
              detail: null,
            },
            set: {
              isFilter: true,
              db: location.description[key].db,
            },
          },
        };
      },
      name: 'Sets',
      counter: 'sets',
    },
  ],
  [
    'sequence',
    {
      to(location) {
        const { key } = location.description.main.key;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...location.description[key],
              detail: 'sequence',
            },
          },
        };
      },
      name: 'Sequence',
    },
  ],
  [
    'domain_architecture',
    {
      to(location) {
        const { key } = location.description.main.key;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...location.description[key],
              detail: 'domain_architecture',
            },
          },
        };
      },
      name: 'Domain Architectures',
    },
  ],
  [
    'logo',
    {
      to(location) {
        const { key } = location.description.main.key;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...location.description[key],
              detail: 'logo',
            },
          },
        };
      },
      name: 'Signature',
    },
  ],
  [
    'proteome',
    {
      to(location) {
        const { key } = location.description.main.key;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...location.description[key],
              proteomeDB: 'proteome',
            },
          },
        };
      },
      name: 'Proteomes',
      counter: 'proteomes',
    },
  ],
]);

export const InterPro /*: Array<Object> */ = [
  {
    to: { description: {} },
    icon: 'H',
    name: 'Home',
    activeClass({ description: { main, other } } /*: Location */) {
      if (!(main.key || other.length)) return f('is-active');
    },
  },
  {
    to: { description: { main: { key: 'search' } } },
    icon: '1',
    name: 'Search',
    iconClass: 'functional',
  },
  {
    to(location) {
      const { key } = location.description.main;
      if (!key || key === 'search' || key === 'job') {
        return {
          description: {
            ...getEmptyDescription(),
            main: { key: 'entry' },
            entry: { db: 'InterPro' },
          },
        };
      }
      if (location.description.set.accession) {
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            set: { db: 'all' },
            entry: { isFilter: true, db: location.description.set.db },
          },
        };
      }
      return {
        description: {
          ...getEmptyDescription(),
          main: { key },
          [key]: { db: location.description[key].db },
          entry: {
            isFilter: true,
            db: location.description.entry.db || 'InterPro',
          },
        },
      };
    },
    activeClass({ description: { main } } /*: Location */) {
      if (main.key && main.key !== 'search') return f('is-active');
    },
    icon: 'b',
    name: 'Browse',
    iconClass: 'functional',
  },
  {
    to: { description: { other: ['release_notes'] } },
    icon: '0',
    name: 'Release\xa0Notes',
    iconClass: 'functional',
  },
  {
    to: { description: { other: ['download'] } },
    icon: '=',
    name: 'Download',
    iconClass: 'functional',
  },
  {
    to: { description: { other: ['help'] } },
    icon: '?',
    name: 'Help',
  },
  {
    to: { description: { other: ['about'] } },
    icon: 'i',
    name: 'About',
  },
  {
    to: { description: { other: ['settings'] } },
    icon: 's',
    name: 'Settings',
    iconClass: 'functional',
  },
];
