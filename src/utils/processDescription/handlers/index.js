// @flow
import get from 'lodash-es/get';
import set from 'lodash-es/set';

import getEmptyDescription from 'utils/processDescription/emptyDescription';

/*:: type PossibleMain = (
  'entry' |
  'protein' |
  'structure' |
  'organism' |
  'set' |
  'search' |
  'job'
); */

/*:: export type Description = {|
  main: {|
    key: ?PossibleMain,
  |},
  entry: {|
    isFilter: ?boolean,
    integration: ?string,
    db: ?string,
    accession: ?string,
    memberDB: ?string,
    memberAccession: ?string,
    detail: ?string,
  |},
  protein: {|
    isFilter: ?boolean,
    db: ?string,
    accession: ?string,
    detail: ?string,
  |},
  structure: {|
    isFilter: ?boolean,
    db: ?string,
    accession: ?string,
    chain: ?string,
    detail: ?string,
  |},
  organism: {|
    isFilter: ?boolean,
    db: ?string,
    accession: ?string,
    proteomeDB: ?string,
    proteomeAccession: ?string,
  |},
  set: {|
    isFilter: ?boolean,
    db: ?string,
    accession: ?string,
    detail: ?string,
  |},
  search: {|
    type: ?string,
    value: ?string,
  |},
  job: {|
    type: ?string,
    accession: ?string,
    detail: ?string,
  |},
  other: Array<string>,
|}; */

/*:: export type Handler = {|
  name: string,
  children: Set<Handler>,
  key: ?Array<string>,
  getKey: Description => ?Array<string>,
  cleanedUp: ?string,
  cleanUp: (string, ?Description) => ?string,
  regexp: RegExp,
  match: (string, Description) => ?boolean,
  handle: (Description, string, ?string, Array<string>) => Description,
|}; */

/*:: type PropertiesObject = {|
  [string]: {|value: any|},
|}; */

// node templates
const templateHandler /*: Handler */ = {
  // can be used for debugging
  name: 'templateHandler',
  // set of all possible chil handlers
  children: new Set(),
  // accession key in the description object for this handler
  key: null,
  // return accession key depending on current state of description
  getKey: _description => null,
  // cleaned up version of the value for this handler
  cleanedUp: null,
  // returns cleaned up value
  cleanUp: (value, _description) => value.toLowerCase(),
  regexp: /.*/,
  // match function for this handler,
  // used after processing parent handler to choose which child
  // can handle the next value
  match(current, _description) {
    return this.regexp.test(current);
  },
  // main handle function, mutates description object, setting the cleaned up
  // value to the key in description
  handle(description, current, next, ...rest) {
    const key = this.key || this.getKey(description);
    if (key && current) {
      // eslint-disable-next-line no-param-reassign
      set(
        description,
        key,
        this.cleanedUp || this.cleanUp(current, description),
      );
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
    re: /^G3DSA:[0-9]{1}\.[0-9]{2,3}\.[0-9]{1,4}\.[0-9]{2,5}$/i,
  },
  { name: 'cdd', re: /^(?:c|s)d[0-9]{5}$/i },
  { name: 'hamap', re: /^MF_[0-9]{5}(_(A|B){1})?$/i },
  { name: 'panther', re: /^PTHR[0-9]{5}(:SF[0-9]{1,3})?$/i },
  { name: 'pfam', re: /^PF[0-9]{5}$/i },
  { name: 'pirsf', re: /^PIRSF[0-9]{6}$/i },
  { name: 'prints', re: /^PR[0-9]{5}$/i },
  { name: 'prodom', re: /^PD[A-Z0-9]{6}$/i },
  { name: 'prosite', re: /^PS[0-9]{5}$/i },
  { name: 'patterns', re: /^PS[0-9]{5}$/i },
  { name: 'profiles', re: /^PS[0-9]{5}$/i }, // TODO: check which one
  { name: 'profile', re: /^PS[0-9]{5}$/i }, // TODO: is correct
  { name: 'sfld', re: /^sfld[gf]\d{5}$/i },
  { name: 'smart', re: /^SM[0-9]{5}$/i },
  { name: 'ssf', re: /^SSF[0-9]{5,6}$/i },
  { name: 'tigrfams', re: /^TIGR[0-9]{5}$/i },
  { name: 'mobidblt', re: /^(\w|-)+$/ },
]);
const interPro = { name: 'InterPro', re: /IPR[0-9]{6}/i };

export const setDBs /*: Set<Object> */ = new Set([
  {
    name: 'pfam',
    re: /^CL[0-9]{4}$/,
    url_template: 'http://pfam.xfam.org/clan/{id}',
  },
  {
    name: 'cdd',
    re: /^cl[0-9]{5}$/,
    url_template:
      'https://www.ncbi.nlm.nih.gov/Structure/cdd/cddsrv.cgi?uid={id}',
  },
]);

const isEmpty = object => !Object.values(object).some(Boolean);

// Constructors
// prettier-ignore
const handlerConstructor = (
  propertiesObject /*: PropertiesObject */,
) /*: Handler */ => Object.create(templateHandler, propertiesObject);

// prettier-ignore
const typeConstructor = (type /*: PossibleMain */) /*: Handler */ =>
  handlerConstructor({
    name: {
      value: `${type}Handler`,
    },
    getKey: {
      value: ({ main: { key } }) => (key ? [type, 'isFilter'] : ['main', 'key']),
    },
    cleanUp: {
      value: (_, description) => get(description, ['main', 'key']) ? true : type,
    },
    match: {
      value: (current, { main: { key }, [type]: typeObject }) => {
        switch (typeof current) {
          case 'string':
            return current.toLowerCase() === type && isEmpty(typeObject);
          case 'boolean':
            return !!key && key !== type;
          default:
            return false;
        }
      },
    },
  });

// Entry handlers
export const entryHandler /*: Handler */ = typeConstructor('entry');

export const integrationHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'integrationHandler',
  },
  key: {
    value: ['entry', 'integration'],
  },
  regexp: {
    value: /^((un)?integrated|all)$/i,
  },
});

export const interProHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'interProHandler',
  },
  key: {
    value: ['entry', 'db'],
  },
  cleanedUp: {
    value: 'InterPro',
  },
  regexp: {
    value: /^interpro$/i,
  },
});

export const memberDBHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'memberDBHandler',
  },
  getKey: {
    value: ({ entry: { db, integration } }) => [
      'entry',
      integration || db === 'InterPro' ? 'memberDB' : 'db',
    ],
  },
  match: {
    value(current) {
      const _current = this.cleanUp(current);
      for (const { name } of memberDB) {
        if (name === _current) return true;
      }
    },
  },
});

export const interProAccessionHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'interProAccessionHandler',
  },
  key: {
    value: ['entry', 'accession'],
  },
  cleanUp: {
    value: value => value.toUpperCase(),
  },
  regexp: {
    value: interPro.re,
  },
});

export const memberDBAccessionHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'memberDBAccessionHandler',
  },
  getKey: {
    value: ({ entry: { db, integration } }) => [
      'entry',
      integration || db === 'InterPro' ? 'memberDBAccession' : 'accession',
    ],
  },
  cleanUp: {
    value: value => value.toUpperCase(),
  },
  match: {
    value(current) {
      const _current = this.cleanUp(current);
      for (const { re } of memberDB) {
        if (re.test(_current)) return true;
      }
    },
  },
});

// Protein handlers
export const proteinHandler /*: Handler */ = typeConstructor('protein');

export const proteinDBHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'proteinDBHandler',
  },
  key: {
    value: ['protein', 'db'],
  },
  cleanUp: {
    value: value => value.toLowerCase().replace('uniprot', 'UniProt'),
  },
  regexp: {
    value: /(un)?reviewed|uniprot/i,
  },
});

export const proteinAccessionHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'proteinAccessionHandler',
  },
  key: {
    value: ['protein', 'accession'],
  },
  cleanUp: {
    value: value => value.toUpperCase(),
  },
  regexp: {
    value: /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})$/i,
  },
});

// Structure handlers
export const structureHandler /*: Handler */ = typeConstructor('structure');

export const structureDBHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'structureDBHandler',
  },
  key: {
    value: ['structure', 'db'],
  },
  cleanedUp: {
    value: 'PDB',
  },
  match: {
    value(current) {
      return current.toUpperCase() === this.cleanedUp;
    },
  },
});

export const structureAccessionHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'structureAccessionHandler',
  },
  key: {
    value: ['structure', 'accession'],
  },
  regexp: {
    value: /^[A-Z0-9]{4}$/i,
  },
});

export const structureChainHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'structureChainHandler',
  },
  key: {
    value: ['structure', 'chain'],
  },
  cleanUp: {
    value: value => value.toUpperCase(),
  },
  regexp: {
    value: /^[A-Z0-9]+$/i,
  },
});

// Organism handlers
export const organismHandler /*: Handler */ = typeConstructor('organism');

export const taxonomyDBHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'taxonomyDBHandler',
  },
  key: {
    value: ['organism', 'db'],
  },
  cleanedUp: {
    value: 'taxonomy',
  },
  match: {
    value(current) {
      return current.toLowerCase() === this.cleanedUp;
    },
  },
});

export const taxonomyAccessionHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'taxonomyAccessionHandler',
  },
  key: {
    value: ['organism', 'accession'],
  },
  cleanUp: {
    value: value => value,
  },
  regexp: {
    value: /[1-9]\d*/,
  },
});

export const proteomeDBHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'proteomeDBHandler',
  },
  key: {
    value: ['organism', 'proteomeDB'],
  },
  cleanedUp: {
    value: 'proteome',
  },
  match: {
    value(current) {
      return current.toLowerCase() === this.cleanedUp;
    },
  },
});

export const proteomeAccessionHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'proteomeAccessionHandler',
  },
  key: {
    value: ['organism', 'proteomeAccession'],
  },
  cleanUp: {
    value: value => value.toUpperCase(),
  },
  regexp: {
    value: /UP\d{9}/i,
  },
});

// Set handlers
export const setHandler /*: Handler */ = typeConstructor('set');

export const setDBHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'setDBHandler',
  },
  key: {
    value: ['set', 'db'],
  },
  cleanUp: {
    value: value => value.toLowerCase().replace('interpro', 'InterPro'),
  },
  match: {
    value(current) {
      const _current = this.cleanUp(current);
      for (const { name } of setDBs) {
        if (name === _current) return true;
      }
      return _current === 'all' || _current === 'InterPro';
    },
  },
});

export const setAccessionHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'setAccessionHandler',
  },
  key: {
    value: ['set', 'accession'],
  },
  cleanUp: {
    value: value => value,
  },
  match: {
    value(current) {
      const _current = this.cleanUp(current);
      for (const { re } of setDBs) {
        if (re.test(_current)) return true;
      }
    },
  },
});

// Search handlers
export const searchHandler /*: Handler */ = typeConstructor('search');

export const searchTypeHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'searchTypeHandler',
  },
  key: {
    value: ['search', 'type'],
  },
  regexp: {
    value: /(text|sequence)/i,
  },
});

export const searchValueHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'searchValueHandler',
  },
  key: {
    value: ['search', 'value'],
  },
  cleanUp: {
    value: value => value,
  },
});

// Job handlers
export const jobHandler /*: Handler */ = typeConstructor('job');

export const jobTypeHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'jobTypeHandler',
  },
  key: {
    value: ['job', 'type'],
  },
  cleanedUp: {
    value: 'InterProScan',
  },
  regexp: {
    value: /interproscan/i,
  },
});

export const jobAccessionHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'jobAccessionHandler',
  },
  key: {
    value: ['job', 'accession'],
  },
  cleanUp: {
    value: value => value,
  },
  regexp: {
    value: /(iprscan5-[SRI]\d{8}-\d{6}-\d{4}-\d+-(es|hx|pg|oy|p[12]m)|internal-[1-9]\d*-\d+)/,
  },
});

// Common and other handlers
export const detailHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'detailHandler',
  },
  getKey: {
    value: ({ main: { key } }) => [key, 'detail'],
  },
});

export const otherHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'otherHandler',
  },
  getKey: {
    // if level 1 is already defined, send to second level
    value: ({ other: [first] }) => ['other', first ? 1 : 0],
  },
  match: {
    // stop at (arbitrary defined) second level, to avoid looping indefinitely
    value: (_, { other: [, second] }) => !second,
  },
});

export const rootHandler /*: Handler */ = handlerConstructor({
  name: {
    value: 'rootHandler',
  },
  handle: {
    value(
      description /*: Description */ = getEmptyDescription(),
      ...rest /*: Array<string> */
    ) {
      return templateHandler.handle.call(this, description, null, ...rest);
    },
  },
});

// Define edges of the directed graph of path part handlers
// -> link all handlers to their possible children

// Entry
entryHandler.children = new Set([
  integrationHandler,
  interProHandler,
  memberDBHandler,
]);

integrationHandler.children = new Set([memberDBHandler]);

interProHandler.children = new Set([
  proteinHandler,
  structureHandler,
  organismHandler,
  setHandler,
  interProAccessionHandler,
]);

memberDBHandler.children = new Set([
  proteinHandler,
  structureHandler,
  organismHandler,
  setHandler,
  memberDBAccessionHandler,
]);

interProAccessionHandler.children = new Set([
  proteinHandler,
  structureHandler,
  organismHandler,
  setHandler,
  memberDBHandler,
  detailHandler,
]);

memberDBAccessionHandler.children = new Set([
  proteinHandler,
  structureHandler,
  organismHandler,
  setHandler,
  detailHandler,
]);

// Protein
proteinHandler.children = new Set([proteinDBHandler]);

proteinDBHandler.children = new Set([
  entryHandler,
  structureHandler,
  organismHandler,
  setHandler,
  proteinAccessionHandler,
]);

proteinAccessionHandler.children = new Set([
  entryHandler,
  structureHandler,
  organismHandler,
  setHandler,
  detailHandler,
]);

// Structure
structureHandler.children = new Set([structureDBHandler]);

structureDBHandler.children = new Set([
  entryHandler,
  proteinHandler,
  organismHandler,
  setHandler,
  structureAccessionHandler,
]);

structureAccessionHandler.children = new Set([
  entryHandler,
  proteinHandler,
  organismHandler,
  setHandler,
  structureChainHandler,
  detailHandler,
]);

structureChainHandler.children = new Set([
  entryHandler,
  proteinHandler,
  organismHandler,
  setHandler,
  detailHandler,
]);

// Organism
organismHandler.children = new Set([taxonomyDBHandler, proteomeDBHandler]);

taxonomyDBHandler.children = new Set([
  entryHandler,
  proteinHandler,
  structureHandler,
  setHandler,
  taxonomyAccessionHandler,
]);

taxonomyAccessionHandler.children = new Set([
  proteomeDBHandler,
  entryHandler,
  proteinHandler,
  structureHandler,
  setHandler,
  detailHandler,
]);

proteomeDBHandler.children = new Set([
  entryHandler,
  proteinHandler,
  structureHandler,
  setHandler,
  proteomeAccessionHandler,
]);

proteomeAccessionHandler.children = new Set([
  entryHandler,
  proteinHandler,
  structureHandler,
  setHandler,
  detailHandler,
]);

// Set
setHandler.children = new Set([setDBHandler]);

setDBHandler.children = new Set([
  entryHandler,
  proteinHandler,
  structureHandler,
  organismHandler,
  setAccessionHandler,
]);

setAccessionHandler.children = new Set([
  entryHandler,
  proteinHandler,
  structureHandler,
  organismHandler,
  detailHandler,
]);

// Search
searchHandler.children = new Set([searchTypeHandler]);

searchTypeHandler.children = new Set([searchValueHandler]);

// Job
jobHandler.children = new Set([jobTypeHandler]);

jobTypeHandler.children = new Set([jobAccessionHandler]);

jobAccessionHandler.children = new Set([entryHandler, detailHandler]);

// Common and other
otherHandler.children = new Set([otherHandler]);

rootHandler.children = new Set([
  entryHandler,
  proteinHandler,
  structureHandler,
  organismHandler,
  setHandler,
  searchHandler,
  jobHandler,
  otherHandler,
]);
