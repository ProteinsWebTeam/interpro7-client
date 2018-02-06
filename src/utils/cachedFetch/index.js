// @flow
import fetch from 'isomorphic-fetch';

import config, { pkg } from 'config';

const SUCCESS_STATUS = 200;

const handleProgress = async (
  response /*: Response */,
  onProgress /*: (number) => void */,
) => {
  const total = +response.headers.get('Content-Length');
  let received = 0;
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

const cachedFetch = (url /*: string */, options /*: Object */ = {}) => {
  const { useCache = true, ...restOfOptions } = options;
  const key = `${pkg.name}-cachedFetch-${url}`;
  const cached = sessionStorage.getItem(key);

  if (useCache && cached) {
    return Promise.resolve(new Response(new Blob([cached])));
  }

  return fetch(url, restOfOptions).then(response => {
    const shouldCache =
      config.cache.enabled && useCache && response.status === SUCCESS_STATUS;
    if (shouldCache && 'clone' in response) {
      response
        .clone()
        .text()
        .then(text => sessionStorage.setItem(key, text));
    }
    return response;
  });
};

const commonCachedFetch = (responseType /*: ?string */) => async (
  url /*: string */,
  { method = 'GET', headers = new Headers(), ...options } /*: Object */,
  onProgress /*: (number) => void */,
) => {
  // modify options as needed
  options.method = method;
  if (responseType === 'json' && !headers.get('Accept')) {
    headers.set('Accept', 'application/json');
  }
  options.headers = headers;
  // Casting to object to avoid flow error
  const response /*: Object */ = await cachedFetch(url, options);
  if (onProgress && response.headers.get('Content-Length')) {
    handleProgress(response, onProgress);
  }
  let payloadP;
  if (responseType && typeof response[responseType] === 'function') {
    payloadP = response[responseType]();
  }
  return { payload: await payloadP, status: response.status, ok: response.ok };
};

export const cachedFetchText = commonCachedFetch('text');
export const cachedFetchJSON = commonCachedFetch('json');

export default commonCachedFetch();
