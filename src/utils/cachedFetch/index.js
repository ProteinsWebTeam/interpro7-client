import fetch from 'isomorphic-fetch';

import {pkg} from 'config';

const SUCCESS_STATUS = 200;

const cachedFetch = (url, options = {}) => {
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

export const cachedFetchJSON = async (url, options) => {
  const r = await cachedFetch(url, options);
  return await r.json();
};

export default cachedFetch;
