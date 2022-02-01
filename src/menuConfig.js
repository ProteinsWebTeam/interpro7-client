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
    return { db: entry.db, isFilter: true };
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
            db: 'InterPro',
          },
        },
        hash: customLocation.hash,
      };
    },
    name: 'By InterPro',
  },
  {
    to(customLocation) {
      const db = customLocation.description.entry.db?.toLowerCase();
      return {
        description: {
          main: { key: 'entry' },
          entry: {
            db: db === 'interpro' ? 'Pfam' : db || 'Pfam',
            integration: customLocation.description.entry.integration,
          },
        },
        hash: customLocation.hash,
      };
    },
    name: 'By Member DB',
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
    name: 'By Protein',
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
    name: 'By Structure',
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
    name: 'By Taxonomy',
  },
  {
    to(customLocation) {
      return {
        description: {
          main: { key: 'proteome' },
          proteome: {
            db: customLocation.description.proteome.db || 'uniprot',
          },
          entry: { db: 'interpro', isFilter: true },
        },
        hash: customLocation.hash,
      };
    },
    name: 'By Proteome',
  },
  {
    to(customLocation) {
      return {
        description: {
          main: { key: 'set' },
          set: { db: 'all' },
          entry: {
            isFilter: true,
            db: ['cdd', 'panther', 'pfam', 'pirsf'].includes(
              customLocation.description?.entry?.db?.toLowerCase(),
            )
              ? customLocation.description.entry.db
              : 'All',
          },
        },
        hash: customLocation.hash,
      };
    },
    name: 'By Set',
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
    'similar_proteins',
    {
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: 'similar_proteins',
            },
          },
        };
      },
      name: 'Similar Proteins',
      counter: 'similar_proteins',
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
  [
    'rosettafold',
    {
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: 'rosettafold',
            },
          },
        };
      },
      name: 'RoseTTAFold',
      counter: 'structural_models.RoseTTAFold',
    },
  ],
  [
    'alphafold',
    {
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: 'alphafold',
            },
          },
        };
      },
      name: 'AlphaFold',
      counter: 'structural_models.alphafold',
    },
  ],
  [
    'entry_alignments',
    {
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: 'entry_alignments',
            },
          },
        };
      },
      name: 'Alignment',
    },
  ],
  [
    'interactions',
    {
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: 'interactions',
            },
          },
        };
      },
      name: 'Interactions',
      counter: 'interactions',
    },
  ],
  [
    'pathways',
    {
      to(customLocation) {
        const { key } = customLocation.description.main;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: 'pathways',
            },
          },
        };
      },
      name: 'Pathways',
      counter: 'pathways',
    },
  ],
  [
    'alignments',
    {
      to(customLocation) {
        return {
          description: {
            ...getEmptyDescription(),
            main: { key: 'set' },
            set: {
              ...customLocation.description.set,
              detail: 'alignments',
            },
          },
        };
      },
      name: 'Alignments',
    },
  ],
  [
    'genome3d',
    {
      to(customLocation) {
        return {
          description: {
            ...getEmptyDescription(),
            main: { key: 'entry' },
            entry: {
              ...customLocation.description.entry,
              detail: 'genome3d',
            },
          },
        };
      },
      name: 'Genome3D',
    },
  ],
  [
    'curation',
    {
      to(customLocation) {
        return {
          description: {
            ...getEmptyDescription(),
            main: { key: 'entry' },
            entry: {
              ...customLocation.description.entry,
              detail: 'curation',
            },
          },
        };
      },
      name: 'Curation',
    },
  ],
]);

const search = [
  {
    name: 'By Sequence',
    to: {
      description: {
        main: { key: 'search' },
        search: { type: 'sequence' },
      },
    },
    activeClass({
      description: {
        search: { type },
      },
    }) {
      return type === 'InterProScan' && f('is-active');
    },
  },
  {
    name: 'By Text',
    to: {
      description: {
        main: { key: 'search' },
        search: { type: 'text' },
      },
    },
    activeClass({
      description: {
        search: { type },
      },
    }) {
      return type === 'download' && f('is-active');
    },
  },
  {
    name: 'By Domain Architecture',
    to: {
      description: {
        main: { key: 'search' },
        search: { type: 'ida' },
      },
    },
    activeClass({
      description: {
        search: { type },
      },
    }) {
      return type === 'download' && f('is-active');
    },
  },
];

const results = [
  {
    to: {
      description: {
        main: { key: 'result' },
        result: { type: 'InterProScan' },
      },
    },
    activeClass({
      description: {
        result: { type },
      },
    }) {
      return type === 'InterProScan' && f('is-active');
    },
    name: 'Your InterProScan searches',
  },
  {
    name: 'Your downloads',
    to: {
      description: {
        main: { key: 'result' },
        result: { type: 'download' },
      },
    },
    activeClass({
      description: {
        result: { type },
      },
    }) {
      return type === 'download' && f('is-active');
    },
  },
];

const help = [
  {
    name: 'Tutorials & Webinars',
    to: { description: { other: ['help', 'tutorial'] } },
    activeClass: f('is-active'),
  },
  {
    name: 'Training',
    to: { description: { other: ['help', 'training'] } },
    activeClass: f('is-active'),
  },
  {
    name: 'FAQs',
    to: { description: { other: ['help', 'faqs'] } },
    activeClass: f('is-active'),
  },
  {
    name: 'Documentation',
    to: { description: { other: ['help', 'documentation'] } },
    activeClass: f('is-active'),
  },
];
const about = [
  {
    name: 'InterPro',
    to: { description: { other: ['about', 'interpro'] } },
    activeClass: f('is-active'),
  },
  {
    name: 'InterProScan',
    to: { description: { other: ['about', 'interproscan'] } },
    activeClass: f('is-active'),
  },
  {
    name: 'The InterPro Consortium',
    to: { description: { other: ['about', 'consortium'] } },
    activeClass: f('is-active'),
  },
  {
    name: 'Funding',
    to: { description: { other: ['about', 'funding'] } },
    activeClass: f('is-active'),
  },
  {
    name: 'Privacy',
    to: { description: { other: ['about', 'privacy'] } },
    activeClass: f('is-active'),
  },
  {
    name: 'Team',
    to: { description: { other: ['about', 'team'] } },
    activeClass: f('is-active'),
  },
];
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
    entities: search,
  },
  {
    to(customLocation) {
      const { key } = customLocation.description.main;
      if (!key || key === 'search' || key === 'result') {
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
    activeClass({ description: { main } } /*: Location */) {
      if (main.key && main.key !== 'search' && main.key !== 'result') {
        return f('is-active');
      }
    },
    icon: 'b',
    name: 'Browse',
    iconClass: 'common',
    entities,
  },
  {
    to({
      description: {
        result: { type },
      },
    }) {
      return { description: { main: { key: 'result' }, result: { type } } };
    },
    icon: '*',
    name: 'Results',
    iconClass: 'common',
    entities: results,
  },
  {
    to: { description: { other: ['release_notes'] } },
    icon: '',
    name: 'Release\xa0notes',
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
    entities: help,
  },
  {
    to: { description: { other: ['about'] } },
    icon: '',
    name: 'About',
    iconClass: 'common',
    entities: about,
  },
  {
    to: { description: { other: ['settings'] } },
    icon: '',
    name: 'Settings',
    iconClass: 'common',
  },
];

const _NOT_MEMBER_DBS = [
  'PRODOM',
  'COILS',
  'SCOP',
  'MOBIDB',
  'MOBIDB_LITE',
  'MOBIDBLT',
  'SIGNALP',
  'SIGNALP_E',
  'SIGNALP_G-',
  'SIGNALP_G+',
  'SIGNALP_EUK',
  'SIGNALP_GRAM_POSITIVE',
  'SIGNALP_GRAM_NEGATIVE',
  'PHOBIUS',
  'TMHMM',
  'CATH',
  'SWISS-MODEL',
  'MODBASE',
  'SMODEL',
];
export const NOT_MEMBER_DBS /*: Set<string> */ = new Set(
  _NOT_MEMBER_DBS.concat(_NOT_MEMBER_DBS.map((x) => x.toLowerCase())),
);
