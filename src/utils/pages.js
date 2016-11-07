// @flow
import config from 'config';
/**
 * List of the available pages(endpoints) in singular
 * @type {Array<string>}
 */
export const singular/*: Array<string> */ = Object.keys(config.pages);

/**
 * List of the available pages(endpoints) in plural
 * @type {Array<string>}
 */
export const plural/*: Array<string> */ = Object.entries(config.pages)
  .map(([key, value]) => {
    if (value && value.plural && typeof value.plural === 'string') {
      return value.plural;
    }
    return `${key}s`;
  });

/**
 * Takes the text in singular of the page and returns the text in plural
 * @param {string}s text in singular
 * @returns {*} text in plural
 */
export const toPlural = (s/*: string */) => {
  for (let i = 0; i < singular.length; i++) {
    if (singular[i] === s) return plural[i];
  }
  throw new Error('Not an existing page');
};
