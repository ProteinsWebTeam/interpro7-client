/*:: import type { Description } from 'utils/processDescription/handlers'; */

// prettier-ignore
export default () /*: Description */ => Object.freeze({
  main: Object.seal({
    key: null,
  }),
  entry: Object.seal({
    isFilter: null,
    integration: null,
    db: null,
    accession: null,
    memberDB: null,
    memberDBAccession: null,
    detail: null,
  }),
  protein: Object.seal({
    isFilter: null,
    db: null,
    accession: null,
    detail: null,
  }),
  structure: Object.seal({
    isFilter: null,
    db: null,
    accession: null,
    chain: null,
    detail: null,
  }),
  organism: Object.seal({
    isFilter: null,
    db: null,
    accession: null,
    proteomeDB: null,
    proteomeAccession: null,
    detail: null,
  }),
  set: Object.seal({
    isFilter: null,
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
