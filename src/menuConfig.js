// @flow
import getEmptyDescription from 'utils/processDescription/emptyDescription';

import f from 'styles/foundation';

/* ::
  type Location = {|
    description: {|[key: string]: {|[key: string | number]: string | boolean|}|},
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

const getEntryForFilter = ({ entry }) => {
  if (entry.db) {
    return { ...entry, isFilter: true };
  }
};
const getTaxonomyForFilter = ({ taxonomy, main }) => {
  if (main.key !== 'taxonomy' && taxonomy.db) {
    return { ...taxonomy, isFilter: true };
  }
};

export const entities /*: Array<Object> */ = [
  // for Browse menu
  {
    to(customLocation) {
      return {
        description: {
          main: { key: 'entry' },
          entry: {
            db: customLocation.description.entry.db || 'InterPro',
            integration: customLocation.description.entry.integration,
          },
        },
        hash: customLocation.hash,
      };
    },
    name: 'Entry',
  },
  {
    to(customLocation) {
      return {
        description: {
          main: { key: 'protein' },
          protein: { db: customLocation.description.protein.db || 'UniProt' },
          entry: getEntryForFilter(customLocation.description),
          taxonomy: getTaxonomyForFilter(customLocation.description),
        },
        hash: customLocation.hash,
      };
    },
    name: 'Protein',
  },
  {
    to(customLocation) {
      return {
        description: {
          main: { key: 'structure' },
          structure: { db: 'PDB' },
          entry: getEntryForFilter(customLocation.description),
        },
        hash: customLocation.hash,
      };
    },
    name: 'Structure',
  },
  {
    to(customLocation) {
      return {
        description: {
          main: { key: 'taxonomy' },
          taxonomy: {
            db: customLocation.description.taxonomy.db || 'uniprot',
          },
          entry: getEntryForFilter(customLocation.description),
        },
        hash: customLocation.hash,
      };
    },
    name: 'Taxonomy',
  },
  {
    to(customLocation) {
      return {
        description: {
          main: { key: 'proteome' },
          proteome: {
            db: customLocation.description.proteome.db || 'uniprot',
          },
          entry: getEntryForFilter(customLocation.description),
        },
        hash: customLocation.hash,
      };
    },
    name: 'Proteome',
  },
  {
    to(customLocation) {
      return {
        description: {
          main: { key: 'set' },
          set: { db: 'all' },
          entry: getEntryForFilter(customLocation.description),
        },
        hash: customLocation.hash,
      };
    },
    name: 'Set',
  },
];

export const singleEntity /*: Map<string, Object> */ = new Map([
  [
    'overview',
    {
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: null,
            },
          },
        };
      },
      name: 'Overview',
      exact: true,
    },
  ],
  [
    'entry',
    {
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: null,
            },
            entry: {
              isFilter: true,
              db:
                key === 'set' ? customLocation.description.set.db : 'InterPro',
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
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
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
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
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
    'taxonomy',
    {
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: null,
            },
            taxonomy: {
              isFilter: true,
              db: 'uniprot',
            },
          },
        };
      },
      name: 'Taxonomy',
      counter: 'taxa',
    },
  ],
  [
    'proteome',
    {
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: null,
            },
            proteome: {
              isFilter: true,
              db: 'uniprot',
            },
          },
        };
      },
      name: 'Proteomes',
      counter: 'proteomes',
    },
  ],
  [
    'set',
    {
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: null,
            },
            set: {
              isFilter: true,
              db: customLocation.description[key].db,
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
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
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
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: 'domain_architecture',
            },
          },
        };
      },
      name: 'Domain Architectures',
      counter: 'domain_architectures',
    },
  ],
  [
    'logo',
    {
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: 'logo',
            },
          },
        };
      },
      name: 'Signature',
    },
  ],
  // [
  //   'proteome',
  //   {
  //     to(customLocation) {
  //       const { key } = customLocation.description.main;
  //       return {
  //         description: {
  //           ...getEmptyDescription(),
  //           main: { key },
  //           [key]: {
  //             ...customLocation.description[key],
  //             proteomeDB: 'proteome',
  //           },
  //         },
  //       };
  //     },
  //     name: 'Proteomes',
  //     counter: 'proteomes',
  //   },
  // ],
]);

export const InterPro /*: Array<Object> */ = [
  {
    to: { description: {} },
    icon: 'H',
    name: 'Home',
    exact: true,
  },
  {
    to: { description: { main: { key: 'search' } } },
    icon: '1',
    name: 'Search',
    iconClass: 'functional',
  },
  {
    to(customLocation) {
      const { key } = customLocation.description.main;
      if (!key || key === 'search' || key === 'job') {
        return {
          description: {
            ...getEmptyDescription(),
            main: { key: 'entry' },
            entry: { db: 'InterPro' },
          },
        };
      }
      if (customLocation.description.set.accession) {
        return {
          description: {
            ...getEmptyDescription(),
            main: { key: 'set' },
            set: { db: 'all' },
            entry: { isFilter: true, db: customLocation.description.set.db },
          },
        };
      }
      return {
        description: {
          ...getEmptyDescription(),
          main: { key },
          [key]: { db: customLocation.description[key].db },
          entry: {
            isFilter: key !== 'entry',
            db: customLocation.description.entry.db || 'InterPro',
          },
        },
      };
    },
    activeClass(
      {
        description: { main },
      } /*: Location */,
    ) {
      if (main.key && main.key !== 'search' && main.key !== 'job') {
        return f('is-active');
      }
    },
    icon: 'b',
    name: 'Browse',
    iconClass: 'functional',
  },
  {
    to({
      description: {
        job: { type },
      },
    }) {
      return { description: { main: { key: 'job' }, job: { type } } };
    },
    icon: '1',
    name: 'Jobs',
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

export const NOT_MEMBER_DBS /*: Set<string> */ = new Set([
  'COILS',
  'MOBIDB',
  'MOBIDB_LITE',
  'SIGNALP',
  'SIGNALP_EUK',
  'SIGNALP_GRAM_POSITIVE',
  'SIGNALP_GRAM_NEGATIVE',
  'PHOBIUS',
  'TMHMM',
]);
