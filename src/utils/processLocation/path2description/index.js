// @flow
const getEmptyDescription = () => ({
  other: null,
  mainType: null,
  mainIntegration: null,
  mainDB: null,
  mainAccession: null,
  mainChain: null,
  mainMemberDB: null,
  mainMemberDBAccession: null,
  mainDetail: null,
  focusType: null,
  focusIntegration: null,
  focusDB: null,
  focusAccession: null,
  focusChain: null,
  focusMemberDB: null,
  focusMemberDBAccession: null,
});

// describe parsing of the path as a directed graph of handlers

// node templates
const handler = {
  children: new Set(),
  key: null,
  getKey: (_description/*: {[key: string]: ?string} */) => null,
  cleanedUp: null,
  cleanUp: (value/*: string */) => value.toLowerCase(),
  match: (
    _current/*: string */,
    _description/*: {[key: string]: ?string} */
  ) => true,
  handle(
    description/*: {[key: string]: ?string} */,
    current/*: ?string */,
    next/*: ?string */,
    ...rest/*: Array<string> */
  ) {
    const key = this.key || this.getKey(description);
    if (key && current) {
      // eslint-disable-next-line no-param-reassign
      description[key] = this.cleanedUp || this.cleanUp(current);
    }
    if (!next) return description;
    for (const child of this.children) {
      const matched = typeof child.match === 'function' ?
        child.match(next, description) :
        child.match.test(next);
      if (matched) {
        return child.handle(description, next, ...rest);
      }
    }
    throw new Error('404');
  },
};

// nodes
const memberDB = new Set([
  {
    name: 'gene3d',
    re: /G3DSA:[0-9]{1}\.[0-9]{2,3}\.[0-9]{1,4}\.[0-9]{2,4}/i,
    type: 'entry',
  },
  {name: 'cdd', re: /(?:c|s)d[0-9]{5}/i, type: 'entry'},
  {name: 'hamap', re: /MF_[0-9]{5}(_(A|B){1})?/i, type: 'entry'},
  {name: 'panther', re: /PTHR[0-9]{5}(:SF[0-9]{1,3})?/i, type: 'entry'},
  {name: 'pfam', re: /PF[0-9]{5}/i, type: 'entry'},
  {name: 'pirsf', re: /PIRSF[0-9]{6}/i, type: 'entry'},
  {name: 'prints', re: /PR[0-9]{5}/i, type: 'entry'},
  {name: 'prodom', re: /PD[A-Z0-9]{6}/i, type: 'entry'},
  {name: 'prosite', re: /PS[0-9]{5}/i, type: 'entry'},
  {name: 'sfld', re: /sfldg\d{5}/i, type: 'entry'},
  {name: 'smart', re: /SM[0-9]{5}/i, type: 'entry'},
  {name: 'ssf', re: /SSF[0-9]{5,6}/i, type: 'entry'},
  {name: 'tigrfams', re: /TIGR[0-9]{5}/i, type: 'entry'},
]);
const interPro = {name: 'interpro', re: /IPR[0-9]{6}/i, type: 'entry'};

const mainDetailHandler = Object.create(handler, {
  key: {
    value: 'mainDetail',
  },
  match: {
    value: (value, {mainType, focusType}) => (
      !focusType && value.toLowerCase() !== mainType
    ),
  },
});

const memberDBAccessionHandler = Object.create(handler, {
  getKey: {
    value: description => {
      const position = description.focusType ? 'main' : 'focus';
      return `${position}${
        (description[`${position}Accession`] ? 'MemberDB' : '')
      }Accession`;
    },
  },
  cleanUp: {
    value: (value/*: string */) => value.toUpperCase(),
  },
  match: {
    value: (current, _description) => {
      for (const {re} of memberDB) {
        if (re.test(current)) return true;
      }
    },
  },
});

const memberDBHandler = Object.create(handler, {
  getKey: {
    value: description => {
      const position = description.focusType ? 'main' : 'focus';
      return `${position}${
        (description[`${position}Accession`] ? 'Member' : '')
      }DB`;
    },
  },
  match: {
    value(current, {mainType, mainDB}) {
      const _current = this.cleanUp(current);
      if (mainType === 'entry' && mainDB === 'interpro') {
        for (const {name, type} of memberDB) {
          if (name === current && type !== 'entry') return false;
        }
      }
      for (const {name} of memberDB) {
        if (name === _current) return true;
      }
    },
  },
});

const interProAccessionHandler = Object.create(handler, {
  getKey: {
    value: ({mainAccession}) => `${mainAccession ? 'focus' : 'main'}Accession`,
  },
  cleanUp: {
    value: (value/*: string */) => value.toUpperCase(),
  },
  match: {
    value: (current, _description) => interPro.re.test(current),
  },
});

const interProHandler = Object.create(handler, {
  getKey: {
    value: ({mainDB}) => `${mainDB ? 'focus' : 'main'}DB`,
  },
  cleanedUp: {
    value: 'InterPro',
  },
  match: {
    value: (current, _description) => current.toLowerCase() === interPro.name,
  },
});

const integrationHandler = Object.create(handler, {
  getKey: {
    value: ({mainIntegration}) => (
      `${mainIntegration ? 'focus' : 'main'}Integration`
    ),
  },
  match: {
    value: (current, {mainType}) => (
      (mainType === 'entry') && /^(un)?integrated$/i.test(current)
    ),
  },
});

const structureChainHandler = Object.create(handler, {
  getKey: {
    value: ({focusType}) => `${focusType ? 'focus' : 'main'}Chain`,
  },
  cleanUp: {
    // keep the same as it is case-sensitive
    value: (value/*: string */) => value,
  },
  match: {
    value: /^[a-z0-9]{1,4}$/i,
  },
});

const structureAccessionHandler = Object.create(handler, {
  getKey: {
    value: ({mainAccession}) => `${mainAccession ? 'focus' : 'main'}Accesion`,
  },
  cleanUp: {
    value: (value/*: string */) => value.toUpperCase(),
  },
  match: {
    value: /^[a-z0-9]{4}$/i,
  },
});

const structureDBHandler = Object.create(handler, {
  getKey: {
    value: ({mainDB}) => `${mainDB ? 'focus' : 'main'}DB`,
  },
  cleanedUp: {
    value: 'PDB',
  },
  match: {
    value: (current, _description) => current.toLowerCase() === 'pdb',
  },
});

const structureHandler = Object.create(handler, {
  getKey: {
    value: ({mainType}) => `${mainType ? 'focus' : 'main'}Type`,
  },
  match: {
    value: (current, {mainType}) => (
      (mainType !== 'structure') && (current.toLowerCase() === 'structure')
    ),
  },
});

const proteinAccessionHandler = Object.create(handler, {
  getKey: {
    value: ({mainAccession}) => `${mainAccession ? 'focus' : 'main'}Accession`,
  },
  cleanUp: {
    value: (value/*: string */) => value.toUpperCase(),
  },
  match: {
    value: /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})$/i,
  },
});

const proteinDBHandler = Object.create(handler, {
  getKey: {
    value: ({mainDB}) => `${mainDB ? 'focus' : 'main'}DB`,
  },
  match: {
    value: /^((uni|swiss\-)prot|trembl)$/i,
  },
});

const proteinHandler = Object.create(handler, {
  getKey: {
    value: ({mainType}) => `${mainType ? 'focus' : 'main'}Type`,
  },
  match: {
    value: (current, {mainType}) => (
      (mainType !== 'protein') && (current.toLowerCase() === 'protein')
    ),
  },
});

const entryHandler = Object.create(handler, {
  getKey: {
    value: ({mainType}) => `${mainType ? 'focus' : 'main'}Type`,
  },
  match: {
    value: (current, {mainType}) => (
      (mainType !== 'entry') && (current.toLowerCase() === 'entry')
    ),
  },
});

const otherHandler = Object.create(handler, {
  key: {
    value: 'other',
  },
  match: {
    value: (_current, {mainType}) => !mainType,
  },
});

const rootHandler = Object.create(handler, {
  handle: {
    value(description = getEmptyDescription(), ...rest) {
      return handler.handle.call(this, description, null, ...rest);
    },
  },
});

// define edges
mainDetailHandler.children = new Set([
  entryHandler,
  proteinHandler,
  structureHandler,
]);
memberDBAccessionHandler.children = new Set([
  proteinHandler,
  structureHandler,
  mainDetailHandler,
]);
memberDBHandler.children = new Set([
  memberDBAccessionHandler,
  proteinHandler,
  structureHandler,
]);
interProAccessionHandler.children = new Set([
  memberDBHandler,
  proteinHandler,
  structureHandler,
  mainDetailHandler,
]);
interProHandler.children = new Set([
  interProAccessionHandler,
  memberDBHandler,
  proteinHandler,
  structureHandler,
]);
integrationHandler.children = new Set([
  memberDBHandler,
  proteinHandler,
  structureHandler,
]);
structureChainHandler.children = new Set([
  entryHandler,
  proteinHandler,
  mainDetailHandler,
]);
structureAccessionHandler.children = new Set([
  structureChainHandler,
  entryHandler,
  proteinHandler,
  mainDetailHandler,
]);
structureDBHandler.children = new Set([
  structureAccessionHandler,
  entryHandler,
  proteinHandler,
]);
structureHandler.children = new Set([
  structureDBHandler,
  entryHandler,
  proteinHandler,
]);
proteinAccessionHandler.children = new Set([
  entryHandler,
  structureHandler,
  mainDetailHandler,
]);
proteinDBHandler.children = new Set([
  proteinAccessionHandler,
  entryHandler,
  structureHandler,
]);
proteinHandler.children = new Set([
  proteinDBHandler,
  entryHandler,
  structureHandler,
]);
entryHandler.children = new Set([
  interProHandler,
  memberDBHandler,
  integrationHandler,
]);
rootHandler.children = new Set([
  entryHandler,
  proteinHandler,
  structureHandler,
  otherHandler,
]);

const MULTIPLE_SLASHES = /\/+/;
const notFalsy = x => x;

export default (path/*: string */) => {
  const description = getEmptyDescription();
  const parts = path.split(MULTIPLE_SLASHES).filter(notFalsy);
  return rootHandler.handle(description, ...parts);
};
