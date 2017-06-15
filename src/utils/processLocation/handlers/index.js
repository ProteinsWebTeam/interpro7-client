// @flow
import {getEmptyDescription} from 'utils/processLocation/utils';

/*:: type Description = {|
 other: ?string,
 mainType: ?string,
 mainIntegration: ?string,
 mainDB: ?string,
 mainAccession: ?string,
 mainChain: ?string,
 mainMemberDB: ?string,
 mainMemberDBAccession: ?string,
 mainDetail: ?string,
 focusType: ?string,
 focusIntegration: ?string,
 focusDB: ?string,
 focusAccession: ?string,
 focusChain: ?string,
 focusMemberDB: ?string,
 focusMemberDBAccession: ?string,
|}; */

/* :: type Handler = {
  children: Set<Handler>,
  key: ?string,
  getKey: Description => ?string,
  cleanedUp: ?string,
  cleanUp: string => ?string,
  match: (string, Description) => ?boolean,
  handle: Function,
}; */


// node templates
const handler/*: Handler */ = {
  children: new Set(),
  key: null,
  getKey: _description => null,
  cleanedUp: null,
  cleanUp: value => value.toLowerCase(),
  match: (_current, _description) => true,
  handle(description = getEmptyDescription(), current, next, ...rest) {
    const key = this.key || this.getKey(description);
    if (key && current) {
      // eslint-disable-next-line no-param-reassign
      description[key] = this.cleanedUp || this.cleanUp(current);
    }
    if (!next) return description;
    for (const child of this.children) {
      if (child.match(next, description)) {
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
  {name: 'patterns', re: /PS[0-9]{5}/i, type: 'entry'},
  {name: 'profiles', re: /PS[0-9]{5}/i, type: 'entry'}, // TODO: check which one
  {name: 'profile', re: /PS[0-9]{5}/i, type: 'entry'}, // TODO: is correct
  {name: 'sfld', re: /sfldg\d{5}/i, type: 'entry'},
  {name: 'smart', re: /SM[0-9]{5}/i, type: 'entry'},
  {name: 'ssf', re: /SSF[0-9]{5,6}/i, type: 'entry'},
  {name: 'tigrfams', re: /TIGR[0-9]{5}/i, type: 'entry'},
  {name: 'mobidblt', re: /\w+/, type: 'entry'},
]);
const interPro = {name: 'interpro', re: /IPR[0-9]{6}/i, type: 'entry'};

export const mainDetailHandler/*: Handler */ = Object.create(handler, {
  key: {
    value: 'mainDetail',
  },
  match: {
    value: (value/*: string */, {mainType, focusType}/*: Description */) => (
      !focusType && value.toLowerCase() !== mainType
    ),
  },
});

export const memberDBAccessionHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: (description/*: Description */) => {
      const position = description.focusType ? 'focus' : 'main';
      return `${position}${
        (description[`${position}Accession`] ? 'MemberDB' : '')
      }Accession`;
    },
  },
  cleanUp: {
    value: (value/*: string */) => value.toUpperCase(),
  },
  match: {
    value: (current/*: string */, _description/*: Description */) => {
      for (const {re} of memberDB) {
        if (re.test(current)) return true;
      }
    },
  },
});

export const memberDBHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: (description/*: Description */) => {
      const position = description.focusType ? 'focus' : 'main';
      return `${position}${
        (description[`${position}Accession`] ? 'Member' : '')
      }DB`;
    },
  },
  match: {
    value(current/*: string */, {mainType, mainDB}/*: Description */) {
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

export const interProAccessionHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({mainAccession}/*: Description */) => (
      `${mainAccession ? 'focus' : 'main'}Accession`
    ),
  },
  cleanUp: {
    value: (value/*: string */) => value.toUpperCase(),
  },
  match: {
    value: (current/*: string */, _description/*: Description */) => (
      interPro.re.test(current)
    ),
  },
});

export const interProHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({mainDB}/*: Description */) => `${mainDB ? 'focus' : 'main'}DB`,
  },
  cleanedUp: {
    value: 'InterPro',
  },
  match: {
    value: (current/*: string */, _description/*: Description */) => (
      current.toLowerCase() === interPro.name
    ),
  },
});

export const integrationHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({mainIntegration}/*: Description */) => (
      `${mainIntegration ? 'focus' : 'main'}Integration`
    ),
  },
  match: {
    value: (current/*: string */, {mainType}/*: Description */) => (
      (mainType === 'entry') && /^(un)?integrated$/i.test(current)
    ),
  },
});

export const structureChainHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({focusType}/*: Description */) => (
      `${focusType ? 'focus' : 'main'}Chain`
    ),
  },
  cleanUp: {
    // keep the same as it is case-sensitive
    value: (value/*: string */) => value,
  },
  match: {
    value: (current/*: string */) => /^[a-z0-9]{1,4}$/i.test(current),
  },
});

export const structureAccessionHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({mainAccession}/*: Description */) => (
      `${mainAccession ? 'focus' : 'main'}Accession`
    ),
  },
  match: {
    value: (current/*: string */) => /^[a-z0-9]{4}$/i.test(current),
  },
});

export const structureDBHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({mainDB}/*: Description */) => `${mainDB ? 'focus' : 'main'}DB`,
  },
  cleanedUp: {
    value: 'PDB',
  },
  match: {
    value: (current/*: string */, _description/*: Description */) => (
      current.toLowerCase() === 'pdb'
    ),
  },
});

export const structureHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({mainType}/*: Description */) => (
      `${mainType ? 'focus' : 'main'}Type`
    ),
  },
  match: {
    value: (current/*: string */, {mainType}/*: Description */) => (
      (mainType !== 'structure') && (current.toLowerCase() === 'structure')
    ),
  },
});

export const proteinAccessionHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({mainAccession}/*: Description */) => (
      `${mainAccession ? 'focus' : 'main'}Accession`
    ),
  },
  cleanUp: {
    value: (value/*: string */) => value.toUpperCase(),
  },
  match: {
    value: (current/*: string */) => (
      // eslint-disable-next-line max-len
      /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})$/i.test(
        current
      )
    ),
  },
});

export const proteinDBHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({mainDB}/*: Description */) => `${mainDB ? 'focus' : 'main'}DB`,
  },
  match: {
    value: (current/*: string */) => (
      /^((uni|swiss\-?)prot|trembl)$/i.test(current)
    ),
  },
});

export const proteinHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({mainType}/*: Description */) => (
      `${mainType ? 'focus' : 'main'}Type`
    ),
  },
  match: {
    value: (current/*: string */, {mainType}/*: Description */) => (
      (mainType !== 'protein') && (current.toLowerCase() === 'protein')
    ),
  },
});

export const proteomeHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({mainType}/*: Description */) => (
      `${mainType ? 'focus' : 'main'}Type`
    ),
  },
  match: {
    value: (current/*: string */, {mainType}/*: Description */) => (
      (mainType !== 'proteome') && (current.toLowerCase() === 'proteome')
    ),
  },
});

export const pathwayHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({mainType}/*: Description */) => (
      `${mainType ? 'focus' : 'main'}Type`
    ),
  },
  match: {
    value: (current/*: string */, {mainType}/*: Description */) => (
      (mainType !== 'pathway') && (current.toLowerCase() === 'pathway')
    ),
  },
});

export const entryHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: ({mainType}/*: Description */) => (
      `${mainType ? 'focus' : 'main'}Type`
    ),
  },
  match: {
    value: (current/*: string */, {mainType}/*: Description */) => (
      (mainType !== 'entry') && (current.toLowerCase() === 'entry')
    ),
  },
});

export const valueTextSearchHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: () => 'mainAccession',
  },
  cleanUp: {
    value: (value/*: string */) => value,
  },
});

export const textSearchHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: () => 'mainDB',
  },
  cleanedUp: {
    value: 'text',
  },
  match: {
    value: (current/*: string */, {mainDB}/*: Description */) => (
      !mainDB && (current.toLowerCase() === 'text')
    ),
  },
});

export const jobSequenceSearchHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: () => 'mainAccession',
  },
  cleanUp: {
    value: (value/*: string */) => value,
  },
  match: {
    value: (current/*: string */) => (
      /iprscan5-S\d{8}-\d{6}-\d{4}-\d{8}-(pg|oy)/.test(current)
    ),
  },
});

export const sequenceSearchHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: () => 'mainDB',
  },
  cleanedUp: {
    value: 'sequence',
  },
  match: {
    value: (current/*: string */, {mainDB}/*: Description */) => (
      !mainDB && (current.toLowerCase() === 'sequence')
    ),
  },
});

export const searchHandler/*: Handler */ = Object.create(handler, {
  getKey: {
    value: () => 'mainType',
  },
  cleanedUp: {
    value: 'search',
  },
  match: {
    value: (current/*: string */, {mainType}/*: Description */) => (
      !mainType && (current.toLowerCase() === 'search')
    ),
  },
});

export const otherHandler/*: Handler */ = Object.create(handler, {
  key: {
    value: 'other',
  },
  match: {
    value: (_current/*: string */, {mainType}/*: Description */) => !mainType,
  },
});

export const rootHandler/*: Handler */ = Object.create(handler, {
  handle: {
    value(
      description/*: Description */ = getEmptyDescription(),
      ...rest/*: Array<string> */
    ) {
      return handler.handle.call(this, description, null, ...rest);
    },
  },
});
