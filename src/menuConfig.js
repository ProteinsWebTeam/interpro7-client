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
    newTo: {
      description: {
        mainType: 'entry',
        mainDB: 'InterPro',
      },
    },
    name: 'Entry',
  },
  {
    newTo: {
      description: {
        mainType: 'protein',
        mainDB: 'reviewed',
      },
    },
    name: 'Protein',
  },
  {
    newTo: {
      description: {
        mainType: 'structure',
        mainDB: 'PDB',
      },
    },
    name: 'Structure',
  },
  {
    newTo: {
      description: {
        mainType: 'organism',
        mainDB: 'taxonomy',
      },
    },
    name: 'Organism',
  },
];

export const singleEntity /*: Array<Object> */ = [
  {
    newTo(location /*: Location */) {
      return {
        ...location,
        description: {
          ...location.description,
          mainDetail: null,
          focusType: null,
          focusDB: null,
        },
      };
    },
    name: 'overview',
  },
  {
    newTo(location /*: Location */) {
      return {
        ...location,
        description: {
          ...location.description,
          mainDetail: null,
          focusType: 'entry',
          focusDB: 'InterPro',
        },
      };
    },
    type: 'entry',
    name: 'entries',
    counter: 'entries',
  },
  {
    newTo(location /*: Location */) {
      return {
        ...location,
        description: {
          ...location.description,
          mainDetail: null,
          focusType: 'protein',
          focusDB: 'UniProt',
        },
      };
    },
    type: 'protein',
    name: 'proteins',
    counter: 'proteins',
  },
  {
    newTo(location /*: Location */) {
      return {
        ...location,
        description: {
          ...location.description,
          mainDetail: null,
          focusType: 'structure',
          focusDB: 'PDB',
        },
      };
    },
    type: 'structure',
    name: 'structures',
    counter: 'structures',
  },
  {
    newTo(location /*: Location */) {
      return {
        ...location,
        description: {
          ...location.description,
          focusType: null,
          focusDB: null,
          mainDetail: 'species',
        },
      };
    },
    type: 'protein',
    name: 'species',
    counter: 'species',
  },
  {
    newTo(location /*: Location */) {
      return {
        ...location,
        description: {
          ...location.description,
          focusType: null,
          focusDB: null,
          mainDetail: 'domain_architecture',
        },
      };
    },
    name: 'domain architectures',
  },
  {
    newTo(location /*: Location */) {
      return {
        ...location,
        description: {
          ...location.description,
          focusType: null,
          focusDB: null,
          mainDetail: 'hmm_models',
        },
      };
    },
    name: 'hmm models',
  },
];

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
    options: entities,
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
