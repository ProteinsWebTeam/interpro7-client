// @flow

import { parse } from 'url';
const FINAL_SLASH = /\/*$/;

export const removeLastSlash = (str /*: string*/) =>
  str.replace(FINAL_SLASH, '');

// Builds a new absolute URL from the current one, keeping everything before
// the 'from' parameter and adding everything that is passed as 'to' parameters.
export const buildLink = (
  pathname /*: string */,
  from /*: ?string */,
  ...to /*: Array<string> */
) => {
  const path = removeLastSlash(pathname);
  if (from) {
    let replacement = `/${from}/`;
    if (to.length) {
      replacement += `${to.join('/')}/`;
    }
    return path.replace(new RegExp(`\/?${from}.*$`, 'i'), replacement);
  }
  let output = `${path}/`;
  if (to.length) {
    output += `${to.join('/')}/`;
  }
  return output;
};

export const buildAnchorLink = (
  pathname /*: string */,
  anchor /*: string */ = '',
) => `${pathname}#${anchor}`;

export const getCursor = (url /*: string */) => {
  if (!url) return null;
  const ulrObj = parse(url);
  for (const attr of ulrObj.query.split('&')) {
    if (attr.toLowerCase().startsWith('cursor=')) return attr.split('=')[1];
  }
  return null;
};
