// @flow
/* eslint-env node */
/* eslint no-process-env: 0 */
/* eslint operator-linebreak: 0 */
import url from 'url';
import _config from '../config.yml';
import _pkg from '../package.json';

const HTTPS_DEFAULT_PORT = '443';
const HTTP_DEFAULT_PORT = '80';

const config /*: {
  root: {
    website: {pathname: string, port: string, protocol: string, href: string},
    API: {pathname: string, port: string, protocol: string},
    EBIsearch: {pathname: string, port: string, protocol: string},
    IPScan: {pathname: string, port: string, protocol: string},
  },
  pages: {[key: string]: {plural?: string, subPages: Array<string>}},
  pagination: {pageSize: number}
} */ = _config;

for (const [key, value] of Object.entries(config.root)) {
  if (typeof value === 'string') {
    const urlObj = (config.root[key] = url.parse(value, true, true));
    if (!urlObj.protocol && global.location) {
      urlObj.protocol = global.location.protocol;
    }
    if (!urlObj.port) {
      urlObj.port = (urlObj.protocol || '').includes('s')
        ? HTTPS_DEFAULT_PORT
        : HTTP_DEFAULT_PORT;
    }
  }
}

export default config;

export const pkg = _pkg;

export const PROD = process.env.NODE_ENV === 'production';

export const STAGING = process.env.STAGING;

export const PERF = process.env.PERF;

export const DEV = !PROD;
