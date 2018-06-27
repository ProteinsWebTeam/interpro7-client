// @flow
import config from 'config';

/**
 * List of the available pages(endpoints) in singular
 * @type {Array<string>}
 */
export const singular /*: Array<string> */ = Object.keys(config.pages);

/**
 * List of the available pages(endpoints) in plural
 * @type {Array<string>}
 */
export const plural /*: Array<string> */ = Object.entries(config.pages).map(
  ([key, value]) => {
    if (value && value.plural && typeof value.plural === 'string') {
      return value.plural;
    }
    return `${key}s`;
  },
);

/**
 * Regular expression to catch a “s” at the end of a string
 * @type {RegExp}
 */
const FINAL_S = /s$/i;

/**
 * Takes the text in singular of the page and returns the text in plural
 * @param {string} string text in singular
 * @param {number} [count = +Infinity] optional count to determine if need plural
 * @param {boolean} ignoreNonExisting optional count to determine if need plural
 * @returns {*} text in plural
 */
export const toPlural = (
  string /*: string */,
  count /*:: ?: number */ = +Infinity,
  ignoreNonExisting /*:: ?: boolean */,
) => {
  const _string = string.trim();
  for (let i = 0; i < singular.length; i++) {
    if (singular[i] === _string) {
      if (count > 1) return plural[i];
      return _string;
    }
  }
  if (ignoreNonExisting) {
    return _string.replace(FINAL_S, '') + (count > 1 ? 's' : '');
  }
  throw new Error('Not an existing page');
};
