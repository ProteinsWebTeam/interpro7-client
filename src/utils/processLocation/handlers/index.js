// @flow
import { getEmptyDescription } from 'utils/processLocation/utils';

/*:: type Description = {|
 other?: ?string,
 mainType?: ?string,
 mainIntegration?: ?string,
 mainDB?: ?string,
 mainAccession?: ?string,
 mainChain?: ?string,
 mainMemberDB?: ?string,
 mainMemberDBAccession?: ?string,
 mainDetail?: ?string,
 focusType?: ?string,
 focusIntegration?: ?string,
 focusDB?: ?string,
 focusAccession?: ?string,
 focusChain?: ?string,
 focusMemberDB?: ?string,
 focusMemberDBAccession?: ?string,
|}; */

/* :: export type Handler = {
  name: string,
  children: Set<Handler>,
  key: ?string,
  getKey: Description => ?string,
  cleanedUp: ?string,
  cleanUp: string => ?string,
  match: (string, Description) => ?boolean,
  handle: Function,
}; */

// node templates
const handler /*: Handler */ = {
  name: 'defaultHandler',
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
  { name: 'cdd', re: /(?:c|s)d[0-9]{5}/i, type: 'entry' },
  { name: 'hamap', re: /MF_[0-9]{5}(_(A|B){1})?/i, type: 'entry' },
  { name: 'panther', re: /PTHR[0-9]{5}(:SF[0-9]{1,3})?/i, type: 'entry' },
  { name: 'pfam', re: /PF[0-9]{5}/i, type: 'entry' },
  { name: 'pirsf', re: /PIRSF[0-9]{6}/i, type: 'entry' },
  { name: 'prints', re: /PR[0-9]{5}/i, type: 'entry' },
  { name: 'prodom', re: /PD[A-Z0-9]{6}/i, type: 'entry' },
  { name: 'prosite', re: /PS[0-9]{5}/i, type: 'entry' },
  { name: 'patterns', re: /PS[0-9]{5}/i, type: 'entry' },
  { name: 'profiles', re: /PS[0-9]{5}/i, type: 'entry' }, // TODO: check which one
  { name: 'profile', re: /PS[0-9]{5}/i, type: 'entry' }, // TODO: is correct
  { name: 'sfld', re: /sfld[gf]\d{5}/i, type: 'entry' },
  { name: 'smart', re: /SM[0-9]{5}/i, type: 'entry' },
  { name: 'ssf', re: /SSF[0-9]{5,6}/i, type: 'entry' },
  { name: 'tigrfams', re: /TIGR[0-9]{5}/i, type: 'entry' },
  { name: 'mobidblt', re: /\w+/, type: 'entry' },
]);
const interPro = { name: 'interpro', re: /IPR[0-9]{6}/i, type: 'entry' };

export const setDB /*: Set<Object> */ = new Set([
  {
    name: 'pfam',
    re: /CL[0-9]{4}/,
    url_template: 'http://pfam.xfam.org/clan/{id}',
  },
]);

export const mainDetailHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'mainDetailHandler',
  },
  key: {
    value: 'mainDetail',
  },
  match: {
    value: (value /*: string */, { mainType, focusType } /*: Description */) =>
      !focusType && value.toLowerCase() !== mainType,
  },
});

export const memberDBAccessionHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'memberDBAccessionHandler',
  },
  getKey: {
    value: (description /*: Description */) => {
      const position = description.focusType ? 'focus' : 'main';
      return `${position}${description[`${position}Accession`]
        ? 'MemberDB'
        : ''}Accession`;
    },
  },
  cleanUp: {
    value: (value /*: string */) => value.toUpperCase(),
  },
  match: {
    value: (current /*: string */, _description /*: Description */) => {
      for (const { re } of memberDB) {
        if (re.test(current)) return true;
      }
    },
  },
});

export const memberDBHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'memberDBHandler',
  },
  getKey: {
    value: (description /*: Description */) => {
      const position = description.focusType ? 'focus' : 'main';
      return `${position}${description[`${position}Accession`]
        ? 'Member'
        : ''}DB`;
    },
  },
  match: {
    value(current /*: string */, { mainType, mainDB } /*: Description */) {
      const _current = this.cleanUp(current);
      if (mainType === 'entry' && mainDB === 'interpro') {
        for (const { name, type } of memberDB) {
          if (name === current && type !== 'entry') return false;
        }
      }
      for (const { name } of memberDB) {
        if (name === _current) return true;
      }
    },
  },
});

export const interProAccessionHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'interProAccessionHandler',
  },
  getKey: {
    value: ({ focusDB } /*: Description */) =>
      `${focusDB ? 'focus' : 'main'}Accession`,
  },
  cleanUp: {
    value: (value /*: string */) => value.toUpperCase(),
  },
  match: {
    value: (current /*: string */, _description /*: Description */) =>
      interPro.re.test(current),
  },
});

export const interProHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'interProHandler',
  },
  getKey: {
    value: ({ mainDB } /*: Description */) => `${mainDB ? 'focus' : 'main'}DB`,
  },
  cleanedUp: {
    value: 'InterPro',
  },
  match: {
    value: (current /*: string */, _description /*: Description */) =>
      current.toLowerCase() === interPro.name,
  },
});

export const integrationHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'integrationHandler',
  },
  getKey: {
    value: ({ focusType } /*: Description */) =>
      `${focusType ? 'focus' : 'main'}Integration`,
  },
  match: {
    value: (
      current /*: string */,
      { mainType, focusType } /*: Description */,
    ) =>
      (mainType === 'entry' || focusType === 'entry') &&
      /^(((un)?integrated)|all)$/i.test(current),
  },
});

export const structureChainHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'structureChainHandler',
  },
  getKey: {
    value: ({ focusType } /*: Description */) =>
      `${focusType ? 'focus' : 'main'}Chain`,
  },
  cleanUp: {
    // keep the same as it is case-sensitive
    value: (value /*: string */) => value,
  },
  match: {
    value: (current /*: string */) => /^[a-z0-9]{1,4}$/i.test(current),
  },
});

export const structureAccessionHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'structureAccessionHandler',
  },
  getKey: {
    value: ({ focusDB } /*: Description */) =>
      `${focusDB ? 'focus' : 'main'}Accession`,
  },
  match: {
    value: (current /*: string */) => /^[a-z0-9]{4}$/i.test(current),
  },
});

export const structureDBHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'structureDBHandler',
  },
  getKey: {
    value: ({ mainDB } /*: Description */) => `${mainDB ? 'focus' : 'main'}DB`,
  },
  cleanedUp: {
    value: 'PDB',
  },
  match: {
    value: (current /*: string */, _description /*: Description */) =>
      current.toLowerCase() === 'pdb',
  },
});

export const structureHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'structureHandler',
  },
  getKey: {
    value: ({ mainType } /*: Description */) =>
      `${mainType ? 'focus' : 'main'}Type`,
  },
  match: {
    value: (current /*: string */, { mainType } /*: Description */) =>
      mainType !== 'structure' && current.toLowerCase() === 'structure',
  },
});

export const proteomeAccessionHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'proteomeAccessionHandler',
  },
  getKey: {
    value: (description /*: Description */) => {
      const position = description.focusType ? 'focus' : 'main';
      return `${position}${description[`${position}Accession`]
        ? 'MemberDB'
        : ''}Accession`;
    },
  },
  cleanUp: {
    value: (value /*: string */) => value.toUpperCase(),
  },
  match: {
    value: (current /*: string */, _description /*: Description */) =>
      /UP\d{9}/i.test(current),
  },
});

export const proteomeHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'proteomeHandler',
  },
  getKey: {
    value: (description /*: Description */) => {
      const position = description.focusType ? 'focus' : 'main';
      return `${position}${description[`${position}Accession`]
        ? 'Member'
        : ''}DB`;
    },
  },
  match: {
    value: (current /*: string */, _description /*: Description */) =>
      current.toLowerCase() === 'proteome',
  },
});

export const taxonomyAccessionHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'taxonomyAccessionHandler',
  },
  getKey: {
    value: ({ focusDB } /*: Description */) =>
      `${focusDB ? 'focus' : 'main'}Accession`,
  },
  match: {
    value: (current /*: string */, _description /*: Description */) =>
      /(all)|(\d+)/i.test(current),
  },
});

export const taxonomyHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'taxonomyHandler',
  },
  getKey: {
    value: ({ mainDB } /*: Description */) => `${mainDB ? 'focus' : 'main'}DB`,
  },
  match: {
    value: (current /*: string */, _description /*: Description */) =>
      current.toLowerCase() === 'taxonomy',
  },
});

export const proteinAccessionHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'proteinAccessionHandler',
  },
  getKey: {
    value: ({ focusDB } /*: Description */) =>
      `${focusDB ? 'focus' : 'main'}Accession`,
  },
  cleanUp: {
    value: (value /*: string */) => value.toUpperCase(),
  },
  match: {
    value: (current /*: string */) =>
      // eslint-disable-next-line max-len
      /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})$/i.test(
        current,
      ),
  },
});

export const proteinDBHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'proteinDBHandler',
  },
  getKey: {
    value: ({ mainDB } /*: Description */) => `${mainDB ? 'focus' : 'main'}DB`,
  },
  cleanUp: {
    value: v => v.toLowerCase().replace('uniprot', 'UniProt'),
  },
  match: {
    value: (current /*: string */) =>
      /^((un)?reviewed)|(uniprot)$/i.test(current),
  },
});

export const proteinHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'proteinHandler',
  },
  getKey: {
    value: ({ mainType } /*: Description */) =>
      `${mainType ? 'focus' : 'main'}Type`,
  },
  match: {
    value: (current /*: string */, { mainType } /*: Description */) =>
      mainType !== 'protein' && current.toLowerCase() === 'protein',
  },
});

export const organismHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'organismHandler',
  },
  getKey: {
    value: ({ mainType } /*: Description */) =>
      `${mainType ? 'focus' : 'main'}Type`,
  },
  match: {
    value: (current /*: string */, { mainType } /*: Description */) =>
      mainType !== 'organism' && current.toLowerCase() === 'organism',
  },
});

export const setHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'setHandler',
  },
  getKey: {
    value: ({ mainType } /*: Description */) =>
      `${mainType ? 'focus' : 'main'}Type`,
  },
  match: {
    value: (current /*: string */, { mainType } /*: Description */) =>
      mainType !== 'set' && current.toLowerCase() === 'set',
  },
});

export const setAccessionHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'setAccessionHandler',
  },
  getKey: {
    value: ({ focusDB } /*: Description */) =>
      `${focusDB ? 'focus' : 'main'}Accession`,
  },
  cleanUp: {
    value: (value /*: string */) => value.toUpperCase(),
  },
  match: {
    value: (current /*: string */, _description /*: Description */) => {
      for (const { re } of setDB) {
        if (re.test(current)) return true;
      }
    },
  },
});

export const setDBHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'setDBHandler',
  },
  getKey: {
    value: ({ mainDB } /*: Description */) => `${mainDB ? 'focus' : 'main'}DB`,
  },
  match: {
    value: (current /*: string */) =>
      new RegExp(
        Array.of(setDB)
          .map(db => db.name)
          .join('|') + '|all',
        'i',
      ).test(current),
  },
});

export const entryHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'entryHandler',
  },
  getKey: {
    value: ({ mainType } /*: Description */) =>
      `${mainType ? 'focus' : 'main'}Type`,
  },
  match: {
    value: (current /*: string */, { mainType } /*: Description */) =>
      mainType !== 'entry' && current.toLowerCase() === 'entry',
  },
});

export const valueTextSearchHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'valueTextSearchHandler',
  },
  getKey: {
    value: () => 'mainAccession',
  },
  cleanUp: {
    value: (value /*: string */) => value,
  },
});

export const textSearchHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'textSearchHandler',
  },
  getKey: {
    value: () => 'mainDB',
  },
  cleanedUp: {
    value: 'text',
  },
  match: {
    value: (current /*: string */, { mainDB } /*: Description */) =>
      !mainDB && current.toLowerCase() === 'text',
  },
});

export const jobSequenceSearchHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'jobSequenceSearchHandler',
  },
  getKey: {
    value: () => 'mainAccession',
  },
  cleanUp: {
    value: (value /*: string */) => value,
  },
  match: {
    value: (current /*: string */) =>
      /iprscan5-[SRI]\d{8}-\d{6}-\d{4}-\d{8}-(es|hx|pg|oy|p[12]m)/.test(
        current,
      ),
  },
});

export const sequenceSearchHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'sequenceSearchHandler',
  },
  getKey: {
    value: () => 'mainDB',
  },
  cleanedUp: {
    value: 'sequence',
  },
  match: {
    value: (current /*: string */, { mainDB } /*: Description */) =>
      !mainDB && current.toLowerCase() === 'sequence',
  },
});

export const searchHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'searchHandler',
  },
  getKey: {
    value: () => 'mainType',
  },
  cleanedUp: {
    value: 'search',
  },
  match: {
    value: (current /*: string */, { mainType } /*: Description */) =>
      !mainType && current.toLowerCase() === 'search',
  },
});

export const otherHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'otherHandler',
  },
  key: {
    value: 'other',
  },
  match: {
    value: (_current /*: string */, { mainType } /*: Description */) =>
      !mainType,
  },
});

export const rootHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'rootHandler',
  },
  handle: {
    value(
      description /*: Description */ = getEmptyDescription(),
      ...rest /*: Array<string> */
    ) {
      return handler.handle.call(this, description, null, ...rest);
    },
  },
});
