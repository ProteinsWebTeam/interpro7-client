// @flow
import fetch from 'isomorphic-fetch';

import {pkg} from 'config';

const SUCCESS_STATUS = 200;

const handleProgress = async (
  response/*: Response */,
  onProgress/*: (number) => void */,
) => {
  const total = +response.headers.get('Content-Length');
  let received = 0;
  if (!(response.clone)) return;// bail
  // Need to clone to create another independent ReadableStream
  const clone = response.clone();
  if (!(clone.body && clone.body.getReader)) return;// bail
  const reader = clone.body.getReader();
  while (true) {// eslint-disable-line no-constant-condition
    const {done, value} = await reader.read();
    if (done || !value) return;
    received += value.length;
    onProgress(received / total);
  }
};

export const cachedFetch = (url/*: string */, options/*: Object */ = {}) => {
  const {useCache, ...restOfOptions} = options;
  const key = `${pkg.name}-cachedFetch-${url}`;
  const cached = sessionStorage.getItem(key);

  if (useCache && cached) {
    return Promise.resolve(new Response(new Blob([cached])));
  }

  return fetch(url, restOfOptions).then(res => {
    if (useCache && res.status === SUCCESS_STATUS) {
      res.clone().text().then(text => sessionStorage.setItem(key, text));
    }
    return res;
  });
};

const commonCachedFetch = (responseType/*: 'json' | 'text' */ = 'json') =>
  async (
    url/*: string */,
    options/*: Object */,
    onProgress/*: (number) => void */,
  ) => {
    const response = await cachedFetch(url, options);
    if (onProgress && response.headers.get('Content-Length')) {
      handleProgress(response, onProgress);
    }
    let payloadP;
    if (responseType === 'text') {
      payloadP = response.text();
    } else {
      payloadP = response.json();
    }
    return {payload: await payloadP, status: response.status, ok: response.ok};
  };

export const cachedFetchText = commonCachedFetch('text');
export const cachedFetchJSON = commonCachedFetch('json');

export default cachedFetch;
