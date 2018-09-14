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
    icon: '',
    name: 'EMBL-EBI',
    iconClass: 'common',
  },
  {
    href: 'https://www.ebi.ac.uk/services',
    icon: '',
    name: 'Services',
    iconClass: 'common',
  },
  {
    href: 'https://www.ebi.ac.uk/research',
    icon: '',
    name: 'Research',
    iconClass: 'common',
  },
  {
    href: 'https://www.ebi.ac.uk/training',
    icon: '',
    name: 'Training',
    iconClass: 'common',
  },
  {
    href: 'https://www.ebi.ac.uk/about',
    icon: '',
    name: 'About EBI',
    iconClass: 'common',
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
    icon: '',
    name: 'Search',
    iconClass: 'common',
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
    iconClass: 'common',
  },
  {
    to({
      description: {
        job: { type },
      },
    }) {
      return { description: { main: { key: 'job' }, job: { type } } };
    },
    icon: '*',
    name: 'Jobs',
    iconClass: 'common',
  },
  {
    to: { description: { other: ['release_notes'] } },
    icon: '',
    name: 'Release\xa0Notes',
    iconClass: 'common',
  },
  {
    to: { description: { other: ['download'] } },
    icon: '=',
    name: 'Download',
    iconClass: 'common',
  },
  {
    to: { description: { other: ['help'] } },
    icon: '',
    name: 'Help',
    iconClass: 'common',
  },
  {
    to: { description: { other: ['about'] } },
    icon: '',
    name: 'About',
    iconClass: 'common',
  },
  {
    to: { description: { other: ['settings'] } },
    icon: '',
    name: 'Settings',
    iconClass: 'common',
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
