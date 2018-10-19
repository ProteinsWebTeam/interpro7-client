/*:: import type { Description } from 'utils/processDescription/handlers'; */

// prettier-ignore
export default () /*: Description */ => Object.freeze({
  main: Object.seal({
    key: null,
    numberOfFilters: 0,
  }),
  entry: Object.seal({
    isFilter: null,
    integration: null,
    db: null,
    accession: null,
    memberDB: null,
    memberDBAccession: null,
    detail: null,
    order: null,
  }),
  protein: Object.seal({
    isFilter: null,
    db: null,
    accession: null,
    detail: null,
    order: null,
  }),
  structure: Object.seal({
    isFilter: null,
    db: null,
    accession: null,
    chain: null,
    detail: null,
    order: null,
  }),
  taxonomy: Object.seal({
    isFilter: null,
    db: null,
    accession: null,
    detail: null,
    order: null,
  }),
  proteome: Object.seal({
    isFilter: null,
    db: null,
    accession: null,
    detail: null,
    order: null,
  }),
  set: Object.seal({
    isFilter: null,
    db: null,
    accession: null,
    detail: null,
    order: null,
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
  other: [],
});
