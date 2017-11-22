// @flow
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
    integration: ?string,
    db: ?string,
    accession: ?string,
    memberDB: ?string,
    memberAccession: ?string,
    detail: ?string,
  |},
  protein: {|
    db: ?string,
    accession: ?string,
    detail: ?string,
  |},
  structure: {|
    db: ?string,
    accession: ?string,
    chain: ?string,
    detail: ?string,
  |},
  organism: {|
    db: ?string,
    accession: ?string,
    proteomeDB: ?string,
    proteomeAccession: ?string,
  |},
  set: {|
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

/* :: export type Handler = {
  name: string,
  children: Set<Handler>,
  key: ?string,
  getKey: Description => ?string,
  cleanedUp: ?string,
  cleanUp: string => ?string,
  match: (string, Description) => ?boolean,
  handle: (Description, string, ?string, Array<string>) => Description,
}; */

// node templates
const handler /*: Handler */ = {
  // use for debugging
  name: 'defaultHandler',
  // set of all possible chil handlers
  children: new Set(),
  // accession key in the description object for this handler
  key: null,
  // return accession key depending on current state of description
  getKey: _description => null,
  // cleaned up version of the value for this handler
  cleanedUp: null,
  // returns cleaned up value
  cleanUp: value => value.toLowerCase(),
  // match function for this handler,
  // used after processing parent handler to choose which child
  // can handle the next value
  match: (_current, _description) => true,
  // main handle function, mutates description object, setting the cleaned up
  // value to the key in description
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

export const entryHandler /*: Handler */ = Object.create(handler, {
  name: {
    value: 'entryHandler',
  },
});
