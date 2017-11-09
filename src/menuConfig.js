// @flow
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
    newTo(location) {
      return {
        description: {
          ...location.description,
          mainType: 'entry',
          mainDB:
            location.description.focusIntegration ||
            location.description.focusDB ||
            (location.description.mainType === 'entry' &&
              location.description.mainDB) ||
            'InterPro',
          focusType: null,
          focusDB: null,
          focusIntegration: null,
        },
      };
    },
    name: 'Entry',
  },
  {
    newTo(location) {
      let { focusType, focusDB } = location.description;
      if (location.description.mainType === 'entry') {
        focusType = 'entry';
        focusDB = location.description.mainDB;
      }
      return {
        description: {
          ...location.description,
          mainType: 'protein',
          mainDB: 'UniProt',
          focusType,
          focusDB,
        },
      };
    },
    name: 'Protein',
  },
  {
    newTo(location) {
      let { focusType, focusDB } = location.description;
      if (location.description.mainType === 'entry') {
        focusType = 'entry';
        focusDB = location.description.mainDB;
      }
      return {
        description: {
          ...location.description,
          mainType: 'structure',
          mainDB: 'PDB',
          focusType,
          focusDB,
        },
      };
    },
    name: 'Structure',
  },
  {
    newTo(location) {
      let { focusType, focusDB } = location.description;
      if (location.description.mainType === 'entry') {
        focusType = 'entry';
        focusDB = location.description.mainDB;
      }
      return {
        description: {
          ...location.description,
          mainType: 'organism',
          mainDB: 'taxonomy',
          focusType,
          focusDB,
        },
      };
    },
    name: 'Organism',
  },
  {
    newTo(location) {
      let { focusType, focusDB } = location.description;
      if (location.description.mainType === 'entry') {
        focusType = 'entry';
        focusDB = location.description.mainDB;
      }
      return {
        ...location,
        description: {
          mainType: 'set',
          mainDB: 'all',
          focusType,
          focusDB,
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
      newTo(location /*: Location */) {
        return {
          description: {
            ...location.description,
            mainDetail: null,
            focusType: null,
            focusDB: null,
            mainMemberDB: null,
            focusIntegration: null,
          },
        };
      },
      name: 'Overview',
    },
  ],
  [
    'entry',
    {
      newTo(location /*: Location */) {
        return {
          description: {
            ...location.description,
            mainDetail: null,
            mainMemberDB: null,
            focusType: 'entry',
            focusDB:
              location.description.mainType === 'set'
                ? location.description.mainDB
                : null,
            focusIntegration: 'all',
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
      newTo(location /*: Location */) {
        return {
          description: {
            ...location.description,
            mainDetail: null,
            mainMemberDB: null,
            focusType: 'protein',
            focusDB: 'UniProt',
            focusIntegration: null,
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
      newTo(location /*: Location */) {
        return {
          description: {
            ...location.description,
            mainDetail: null,
            mainMemberDB: null,
            focusType: 'structure',
            focusDB: 'PDB',
            focusIntegration: null,
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
      newTo(location /*: Location */) {
        return {
          description: {
            ...location.description,
            mainDetail: null,
            focusType: 'organism',
            focusDB: 'taxonomy',
            focusIntegration: null,
            mainMemberDB: null,
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
      newTo(location /*: Location */) {
        return {
          description: {
            ...location.description,
            mainDetail: null,
            focusType: 'set',
            focusDB: 'pfam',
            mainMemberDB: null,
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
      newTo(location /*: Location */) {
        return {
          description: {
            ...location.description,
            focusType: null,
            focusDB: null,
            focusIntegration: null,
            mainDetail: 'sequence',
            mainMemberDB: null,
          },
        };
      },
      name: 'Sequence',
    },
  ],
  [
    'domain_architecture',
    {
      newTo(location /*: Location */) {
        return {
          description: {
            ...location.description,
            focusType: null,
            focusDB: null,
            focusIntegration: null,
            mainDetail: 'domain_architecture',
            mainMemberDB: null,
          },
        };
      },
      name: 'Domain Architectures',
    },
  ],
  [
    'logo',
    {
      newTo(location /*: Location */) {
        return {
          description: {
            ...location.description,
            focusType: null,
            focusDB: null,
            focusIntegration: null,
            mainDetail: 'logo',
            mainMemberDB: null,
          },
        };
      },
      name: 'Signature',
    },
  ],
  [
    'proteome',
    {
      newTo(location /*: Location */) {
        return {
          description: {
            ...location.description,
            focusType: null,
            focusDB: null,
            focusIntegration: null,
            mainDetail: null,
            mainMemberDB: 'proteome',
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
    newTo: { description: {} },
    icon: 'H',
    name: 'Home',
    activeClass({ description: { mainType, other } } /*: Location */) {
      if (!(mainType || other)) return f('is-active');
    },
  },
  {
    newTo: { description: { mainType: 'search' } },
    icon: '1',
    name: 'Search',
    iconClass: 'functional',
  },
  {
    newTo: { description: { mainType: 'entry', mainDB: 'InterPro' } },
    icon: 'b',
    name: 'Browse',
    iconClass: 'functional',
  },
  {
    newTo: { description: { other: 'release_notes' } },
    icon: '0',
    name: 'Release\xa0Notes',
    iconClass: 'functional',
  },
  {
    newTo: { description: { other: 'download' } },
    icon: '=',
    name: 'Download',
    iconClass: 'functional',
  },
  {
    newTo: { description: { other: 'help' } },
    icon: '?',
    name: 'Help',
  },
  {
    newTo: { description: { other: 'about' } },
    icon: 'i',
    name: 'About',
  },
  {
    newTo: { description: { other: 'settings' } },
    icon: 's',
    name: 'Settings',
    iconClass: 'functional',
  },
];
