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
 * Takes the text in singular of the page and returns the text in plural
 * @param {string}s text in singular
 * @param {number} [count = +Infinity] optional count to determine if need plural
 * @returns {*} text in plural
 */
export const toPlural = (
  s /*: string */,
  count /*:: ?: number */ = +Infinity,
) => {
  for (let i = 0; i < singular.length; i++) {
    if (singular[i] === s) {
      if (count > 1) return plural[i];
      return s;
    }
  }
  throw new Error('Not an existing page');
};
