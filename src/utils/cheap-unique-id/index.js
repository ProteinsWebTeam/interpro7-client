// @flow
let i = 0;

export default (ns /*:: ?: string | number*/) =>
  `${ns === undefined ? '' : `${ns}-`}${i++}`;
