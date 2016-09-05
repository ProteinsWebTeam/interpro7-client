/* @flow */
import config from 'config';

export const singular/*: Array<string> */ = Object.keys(config.pages);
export const plural/*: Array<string> */ = Object.entries(config.pages)
  .map(([key, value]) => {
    if (!(value && value.plural)) return `${key}s`;
    return value.plural;
  });

export const toPlural = (s/*: string */) => {
  for (let i = 0; i < singular.length; i++) {
    if (singular[i] === s) return plural[i];
  }
  throw new Error('Not an existing page');
};
