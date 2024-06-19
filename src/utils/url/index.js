// @flow

import { parse } from 'url';
const FINAL_SLASH = /\/*$/;
const START_SLASH = /^\/*/;

export const removeLastSlash = (str /*: string*/) =>
  str.replace(FINAL_SLASH, '');

export const removeStartSlash = (str /*: string*/) =>
  str.replace(START_SLASH, '');

export const trimSlashes = (str /*: string*/) =>
  removeLastSlash(removeStartSlash(str));
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
  const urlObj = parse(url, true);
  if (urlObj.query) {
    return urlObj.query.cursor;
  }
  return null;
};

// Function to use when an API URL needs to be exposed
export const toPublicAPI = (url /*: string */) => url.replace('wwwapi', 'api');
