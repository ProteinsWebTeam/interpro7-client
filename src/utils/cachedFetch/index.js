import fetch from 'isomorphic-fetch';

import {pkg, PROD} from 'config';

const SUCCESS_STATUS = 200;

const cachedFetch = (url, options) => {
  const key = `${pkg.name}-cachedFetch-${url}`;
  const cached = sessionStorage.getItem(key);

  if (PROD && cached) {
    return Promise.resolve(new Response(new Blob([cached])));
  }

  return fetch(url, options).then(res => {
    if (res.status === SUCCESS_STATUS) {
      res.clone().text().then(text => sessionStorage.setItem(key, text));
    }
    return res;
  });
};

export const cachedFetchJSON = url => cachedFetch(url).then(r => r.json());

export default cachedFetch;
