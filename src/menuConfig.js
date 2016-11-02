export const EBI = [
  {
    to: 'https://www.ebi.ac.uk',
    icon: 'H',
    name: 'EMBL-EBI',
  },
  {
    to: 'https://www.ebi.ac.uk/services',
    icon: '(',
    name: 'Services',
  },
  {
    to: 'https://www.ebi.ac.uk/research',
    icon: ')',
    name: 'Research',
  },
  {
    to: 'https://www.ebi.ac.uk/training',
    icon: 't',
    name: 'Training',
  },
  {
    to: 'https://www.ebi.ac.uk/about',
    icon: 'i',
    name: 'About us',
  },
];

export const entities = [
  {
    to: '/entry/interpro/',
    name: 'Entry',
  },
  {
    to: '/protein/uniprot/',
    name: 'Protein',
  },
  {
    to: '/structure/pdb/',
    name: 'Structure',
  },
  {
    to: '/proteome/',
    name: 'Proteome',
  },
  {
    to: '/pathway/',
    name: 'Pathway',
  },
];

export const singleEntity = [
  {
    to: '/',
    name: 'overview',
  },
  {
    to: '/entry/',
    name: 'entries',
    counter: 'entries',
  },
  {
    to: '/protein/',
    name: 'proteins',
    counter: 'proteins',
  },
  {
    to: '/structure/',
    name: 'structures',
    counter: 'structures',
  },
  {
    to: '/species/',
    name: 'species',
    counter: 'species',
  },
  {
    to: '/domain_architecture/',
    name: 'domain architectures',
  },
  {
    to: '/hmm_models/',
    name: 'HMM models',
  },
];

export const InterPro = [
  {
    to: '/',
    icon: 'H',
    name: 'Home',
  },
  {
    to: '/search/',
    icon: '1',
    name: 'Search',
    iconClass: 'functional',
  },
  {
    to: '/browse/',
    icon: 'b',
    name: 'Browse',
    iconClass: 'functional',
    options: entities,
  },
  {
    to: '/release_notes/',
    icon: '0',
    name: 'Release Notes',
    iconClass: 'functional',
  },
  {
    to: '/download/',
    icon: '=',
    name: 'Download',
    iconClass: 'functional',
  },
  {
    to: '/help/',
    icon: '?',
    name: 'Help',
  },
  {
    to: '/about/',
    icon: 'i',
    name: 'About',
  },
  {
    to: '/settings/',
    icon: 's',
    name: 'Settings',
    iconClass: 'functional',
  },
];
