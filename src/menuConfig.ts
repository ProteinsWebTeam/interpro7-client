import getEmptyDescription from 'utils/processDescription/emptyDescription';

import cssBinder from 'styles/cssBinder';
const css = cssBinder();

export type ActiveClass =
  | string
  | ((customLocation: InterProLocation) => string | boolean);

export type MenuItemProps = {
  href?: string;
  icon?: string;
  name: string;
  iconClass?: string;
  to?:
    | InterProPartialLocation
    | ((customLocation: InterProLocation) => InterProPartialLocation);
  activeClass?: ActiveClass;
  exact?: boolean;
  counter?: string;
  entities?: Array<MenuItemProps>;
};

export const EBI: Array<MenuItemProps> = [
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

const getEntryForFilter = ({ entry }: InterProDescription) => {
  if (entry.db) {
    return { db: entry.db, isFilter: true };
  }
  // Default to selecting the InterPro DB, making ALl proteins a manual chioce.
  return { db: 'InterPro', isFilter: true };
};

const getTaxonomyForFilter = ({ taxonomy, main }: InterProDescription) => {
  if (main.key !== 'taxonomy' && taxonomy.db) {
    return { ...taxonomy, isFilter: true };
  }
};

export const entities: Array<MenuItemProps> = [
  // for Browse menu
  {
    to(customLocation: InterProLocation) {
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
    to(customLocation: InterProLocation) {
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
    to(customLocation: InterProLocation) {
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
    to(customLocation: InterProLocation) {
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
    to(customLocation: InterProLocation) {
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
    to(customLocation: InterProLocation) {
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
    to(customLocation: InterProLocation) {
      return {
        description: {
          main: { key: 'set' },
          set: { db: 'all' },
          entry: {
            isFilter: true,
            db: ['cdd', 'panther', 'pfam', 'pirsf'].includes(
              (customLocation.description?.entry?.db || '').toLowerCase(),
            )
              ? customLocation.description.entry.db
              : 'Pfam',
          },
        },
        hash: customLocation.hash,
      };
    },
    name: 'By Clan/Set',
  },
];

export const singleEntity: Map<string, MenuItemProps> = new Map([
  [
    'overview',
    {
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
          search:
            typeof customLocation.search.orf !== 'undefined'
              ? { orf: String(customLocation.search.orf) }
              : undefined,
        };
      },
      name: 'Entries',
      counter: 'entries',
    },
  ],
  [
    'protein',
    {
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
              db: customLocation.description[key as Endpoint].db,
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
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: 'sequence',
            },
          },
          search:
            typeof customLocation.search.orf !== 'undefined'
              ? { orf: String(customLocation.search.orf) }
              : undefined,
        };
      },
      name: 'Sequence',
    },
  ],
  [
    'domain_architecture',
    {
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
      name: 'Profile HMM',
    },
  ],
  [
    'alphafold',
    {
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
    'bfvd',
    {
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
        return {
          description: {
            ...getEmptyDescription(),
            main: { key },
            [key]: {
              ...customLocation.description[key],
              detail: 'bfvd',
            },
          },
        };
      },
      name: 'BFVD',
      counter: 'structural_models.bfvd',
    },
  ],
  [
    'entry_alignments',
    {
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
      to(customLocation: InterProLocation) {
        const key = customLocation.description.main.key as Endpoint;
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
    'subfamilies',
    {
      to(customLocation: InterProLocation) {
        return {
          description: {
            ...getEmptyDescription(),
            main: { key: 'entry' },
            entry: {
              ...customLocation.description.entry,
              detail: 'subfamilies',
            },
          },
        };
      },
      name: 'Subfamilies',
      counter: 'subfamilies',
    },
  ],
  /*[
    'curation',
    {
      to(customLocation: InterProLocation) {
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
  ],*/
]);

const search: Array<MenuItemProps> = [
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
      return type === 'InterProScan' && css('is-active');
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
      return type === 'download' && css('is-active');
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
      return type === 'download' && css('is-active');
    },
  },
];

const results: Array<MenuItemProps> = [
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
      return type === 'InterProScan' && css('is-active');
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
      return type === 'download' && css('is-active');
    },
  },
];

const help: Array<MenuItemProps> = [
  {
    name: 'Tutorials & Webinars',
    to: { description: { other: ['help', 'tutorial'] } },
    activeClass: css('is-active'),
  },
  {
    name: 'Training',
    to: { description: { other: ['help', 'training'] } },
    activeClass: css('is-active'),
  },
  {
    name: 'FAQs',
    to: { description: { other: ['help', 'faqs'] } },
    activeClass: css('is-active'),
  },
  {
    name: 'Protein families game',
    to: { description: { other: ['help', 'protein_families_game'] } },
    activeClass: css('is-active'),
  },
  {
    name: 'Documentation',
    to: { description: { other: ['help', 'documentation'] } },
    activeClass: css('is-active'),
  },
];
const about: Array<MenuItemProps> = [
  {
    name: 'InterPro',
    to: { description: { other: ['about', 'interpro'] } },
    activeClass: css('is-active'),
  },
  {
    name: 'InterProScan',
    to: { description: { other: ['about', 'interproscan'] } },
    activeClass: css('is-active'),
  },
  {
    name: 'The InterPro Consortium',
    to: { description: { other: ['about', 'consortium'] } },
    activeClass: css('is-active'),
  },
  {
    name: 'Funding',
    to: { description: { other: ['about', 'funding'] } },
    activeClass: css('is-active'),
  },
  {
    name: 'License',
    to: { description: { other: ['about', 'license'] } },
    activeClass: css('is-active'),
  },
  {
    name: 'Privacy',
    to: { description: { other: ['about', 'privacy'] } },
    activeClass: css('is-active'),
  },
  {
    name: 'Team',
    to: { description: { other: ['about', 'team'] } },
    activeClass: css('is-active'),
  },
];
export const InterPro: Array<MenuItemProps> = [
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
    to(customLocation: InterProLocation) {
      const key = customLocation.description.main.key;
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
          [key]: {
            db: customLocation.description[key as Endpoint].db,
          },
          entry: {
            isFilter: key !== 'entry',
            db: customLocation.description.entry.db || 'InterPro',
          },
        },
      };
    },
    activeClass({ description: { main } }) {
      if (main.key && main.key !== 'search' && main.key !== 'result') {
        return css('is-active');
      }
      return false;
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
  'MOBIDB-LITE',
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
  'FUNFAM',
  'CATH-FUNFAM',
  'PFAM-N',
  'ALPHAFOLD',
  'BFVD',
  'ELM',
];

export const NOT_MEMBER_DBS = new Set(
  _NOT_MEMBER_DBS.concat(_NOT_MEMBER_DBS.map((x) => x.toLowerCase())),
);
