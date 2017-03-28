// @flow
import fetch from 'isomorphic-fetch';

import {pkg} from 'config';

const SUCCESS_STATUS = 200;

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
  async (url/*: string */, options/*: Object */) => {
    const response = await cachedFetch(url, options);
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
