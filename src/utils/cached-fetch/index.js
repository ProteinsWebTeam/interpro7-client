// @flow
import fetch from 'isomorphic-fetch';

import dropCacheIfVersionMismatch from './utils/drop-cache-if-version-mismatch';
import { getMismatchedFavourites } from 'utils/compare-favourites';

import config, { pkg } from 'config';

const SUCCESS_STATUS = 200;
const TIMEOUT_STATUS = 408;
const A_BIT = 2000;

const MIN_LENGTH_TO_COMPRESS = 40000;

const handleProgress = async (
  response /*: Response */,
  onProgress /*: (number) => void */,
) => {
  const total = +response.headers.get('Content-Length');
  let received = 0;
  // $FlowFixMe method-unbinding
  if (!response.clone) return; // bail
  // Need to clone to create another independent ReadableStream
  const clone = response.clone();
  if (!(clone.body && clone.body.getReader)) return; // bail
  const reader = clone.body.getReader();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done || !value) return;
    received += value.length;
    onProgress(received / total);
  }
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cachedFetch = async (
  url /*: string */,
  options /*: Object */ = {},
  addToast,
) => {
  const { useCache = true, ...restOfOptions } = options;
  const key = `${pkg.name}-cachedFetch-${url}`;
  const zipKey = `zip-${pkg.name}-cachedFetch-${url}`;

  let cached = sessionStorage.getItem(key);
  if (!cached) {
    const zipCached = sessionStorage.getItem(zipKey);
    if (useCache && zipCached) {
      const pako = await import(/* webpackChunkName: "pako" */ 'pako');
      const strArray = zipCached.split(',');
      const intArray = Uint8Array.from(strArray.map(Number));
      cached = pako.inflate(intArray, { to: 'string' });
    }
  }

  if (useCache && cached) {
    return Promise.resolve(
      new Response(new Blob([cached]), {
        status: SUCCESS_STATUS,
        statusText: 'OK',
        headers: { 'Client-Cache': 'true' },
      }),
    );
  }

  return fetch(url, restOfOptions).then((response) => {
    if (response.status === TIMEOUT_STATUS) {
      console.log(response.status);
      return wait(A_BIT).then(() => response);
    }
    const shouldCache =
      config.cache.enabled && useCache && response.status === SUCCESS_STATUS;
    if (response.clone) {
      const hasVersionChanged = dropCacheIfVersionMismatch(response.headers);
      if (hasVersionChanged) {
        getMismatchedFavourites({ notify: true, addToast });
      }
      if (shouldCache)
        response
          .clone()
          .text()
          .then(async (text) => {
            if (text.length < MIN_LENGTH_TO_COMPRESS) {
              sessionStorage.setItem(key, text);
            } else {
              const pako = await import(/* webpackChunkName: "pako" */ 'pako');
              const compressed = pako.deflate(text);
              sessionStorage.setItem(zipKey, compressed);
            }
          });
    }
    return response;
  });
};

/*:: export type FetchOutput = {|
  status: number,
  ok: boolean,
  headers: Headers,
  payload?: Object,
  loading?: boolean,
  url?: string,
|}; */

const commonCachedFetch =
  (responseType /*: ?string */) =>
  async (
    url /*: string */,
    {
      method = 'GET',
      headers = new Headers(),
      signal,
      ...options
    } /*: Object */ = {},
    onProgress /*:: ?: (number) => void */,
    versionChanged /*: function */,
  ) /*: Promise<FetchOutput> */ => {
    // modify options as needed
    options.method = method;
    if (responseType === 'json' && !headers.get('Accept')) {
      headers.set('Accept', 'application/json');
    }
    if (responseType === 'gzip' && !headers.get('Accept')) {
      headers.set('Content-Type', 'text/plain');
      headers.set('Accept-Encoding', 'gzip');
    }
    // if (responseType === 'yaml' && !headers.get('Accept')) {
    //   headers.set('Accept', 'application/x-yaml');
    // }
    options.headers = headers;
    // Casting to object to avoid flow error
    const response /*: Object */ = await cachedFetch(
      url,
      options,
      versionChanged,
    );
    if (onProgress && response.headers.get('Content-Length')) {
      handleProgress(response, onProgress);
    }
    let payloadP;
    if (responseType && typeof response[responseType] === 'function') {
      payloadP = response[responseType]();
    } else if (responseType === 'gzip') {
      payloadP = response.text();
    } else if (responseType === 'yaml') {
      const yaml = await import(/* webpackChunkName: "js-yaml" */ 'js-yaml');
      payloadP = yaml.load(await response.text(), { json: true });
    } else if (responseType === 'xml') {
      const { XMLParser } = await import(
        /* webpackChunkName: "fast-xml-parser" */ 'fast-xml-parser'
      );
      const xmlParser = new XMLParser();
      payloadP = xmlParser.parse(await response.text());
    }
    const output /*: FetchOutput */ = {
      status: response.status,
      ok: response.ok,
      headers: response.headers,
    };
    try {
      output.payload = await payloadP;
    } catch {
      /**/
    } finally {
      return output;
    }
  };

export const cachedFetchText = commonCachedFetch('text');
export const cachedFetchJSON = commonCachedFetch('json');
export const cachedFetchYAML = commonCachedFetch('yaml');
export const cachedFetchGZIP = commonCachedFetch('gzip');
export const cachedFetchXML = commonCachedFetch('xml');

export default commonCachedFetch();
