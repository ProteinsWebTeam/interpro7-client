export const EBI = [
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
    name: 'About us',
  },
];

export const entities = [
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
        mainDB: 'UniProt',
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
        mainType: 'proteome',
      },
    },
    name: 'Proteome',
  },
  {
    newTo: {
      description: {
        mainType: 'pathway',
      },
    },
    name: 'Pathway',
  },
];

export const singleEntity = [
  {
    newTo(location) {
      return {
        ...location,
        description: {
          ...location.description,
          focusType: null,
          focusDB: null,
        },
      };
    },
    name: 'overview',
  },
  {
    newTo(location) {
      return {
        ...location,
        description: {
          ...location.description,
          focusType: 'entry',
          focusDB: 'InterPro',
        },
      };
    },
    name: 'entries',
    counter: 'entries',
  },
  {
    newTo(location) {
      return {
        ...location,
        description: {
          ...location.description,
          focusType: 'protein',
          focusDB: 'UniProt',
        },
      };
    },
    name: 'proteins',
    counter: 'proteins',
  },
  {
    newTo(location) {
      return {
        ...location,
        description: {
          ...location.description,
          focusType: 'structure',
          focusDB: 'PDB',
        },
      };
    },
    name: 'structures',
    counter: 'structures',
  },
  {
    newTo(location) {
      return {
        ...location,
        description: {
          ...location.description,
          mainDetail: 'species',
        },
      };
    },
    name: 'species',
    counter: 'species',
  },
  {
    newTo(location) {
      return {
        ...location,
        description: {
          ...location.description,
          mainDetail: 'domain_architectures',
        },
      };
    },
    name: 'domain architectures',
  },
  {
    newTo(location) {
      return {
        ...location,
        description: {
          ...location.description,
          mainDetail: 'hmm_models',
        },
      };
    },
    name: 'HMM models',
  },
];

export const InterPro = [
  {
    newTo: {description: {}},
    icon: 'H',
    name: 'Home',
  },
  {
    newTo: {description: {mainType: 'search'}},
    icon: '1',
    name: 'Search',
    iconClass: 'functional',
  },
  {
    newTo: {description: {mainType: 'entry', mainDB: 'InterPro'}},
    icon: 'b',
    name: 'Browse',
    iconClass: 'functional',
    options: entities,
  },
  {
    newTo: {description: {other: 'release_notes'}},
    icon: '0',
    name: 'Release Notes',
    iconClass: 'functional',
  },
  {
    newTo: {description: {other: 'download'}},
    icon: '=',
    name: 'Download',
    iconClass: 'functional',
  },
  {
    newTo: {description: {other: 'help'}},
    icon: '?',
    name: 'Help',
  },
  {
    newTo: {description: {other: 'about'}},
    icon: 'i',
    name: 'About',
  },
  {
    newTo: {description: {other: 'settings'}},
    icon: 's',
    name: 'Settings',
    iconClass: 'functional',
  },
];
