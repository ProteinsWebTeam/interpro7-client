// @flow
let i = 0;

export default (ns /*?: string | number */) =>
  `${ns}${ns === undefined ? '' : '-'}${i++}`;
