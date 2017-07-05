// @flow
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
  anchor /*: string */ = ''
) => `${pathname}#${anchor}`;

export const searchParamsToUrl = (search /*: {[key: string]: string} */) => {
  const entries = Object.entries(search || {});
  if (!entries.length) return '';
  return entries
    .reduce((acc, [key, value]) => {
      if (!value && value !== 0) return acc;
      if (isNaN(value) || typeof value === 'object' || value === true) {
        return `${acc}&${key}`;
      }
      if (typeof value === 'string' || typeof value === 'number') {
        `${acc}&${key}=${value}`;
      }
      return acc;
    }, '')
    .slice(1);
};
