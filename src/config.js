// @flow
/* eslint-env node */
/* eslint no-process-env: 0 */
/* eslint operator-linebreak: 0 */
import url from 'url';
import _config from '../config.yml';
import _pkg from '../package.json';

const config/*: {
  root: {
    website: string,
    API: string,
  },
  pages: {[key: string]: ?{plural: string}},
  pagination: {pageSize: number}
} */ = _config;

for (const [key, value] of Object.entries(config.root)) {
  if (typeof value === 'string') {
    config.root[key] = url.parse(
      `${value.startsWith('//') ? 'http:' : ''}${value}`
    );
  }
}

export default config;

export const pkg = _pkg;

export const PROD = process.env.NODE_ENV === 'production';

export const DEV = !PROD;
