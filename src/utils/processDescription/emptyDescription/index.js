// @flow
//:: import type { Description } from 'utils/processDescription/handlers';

// prettier-ignore
export default () /*: Description */ => Object.freeze({
  main: Object.seal({
    key: null,
  }),
  entry: Object.seal({
    integration: null,
    db: null,
    accession: null,
    memberDB: null,
    memberDBAccession: null,
    detail: null,
  }),
  protein: Object.seal({
    db: null,
    accession: null,
    detail: null,
  }),
  structure: Object.seal({
    db: null,
    accession: null,
    chain: null,
    detail: null,
  }),
  organism: Object.seal({
    taxonomyDB: null,
    taxonomyAccession: null,
    proteomeDB: null,
    proteomeAccession: null,
  }),
  set: Object.seal({
    db: null,
    accession: null,
    detail: null,
  }),
  search: Object.seal({
    type: null,
    value: null,
  }),
  job: Object.seal({
    type: null,
    accession: null,
    detail: null,
  }),
  other: {
    0: null,
    1: null,
  },
});
