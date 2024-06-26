import { parse } from 'url';
import { trimSlashes } from '.';

export const toCanonicalURL = (url: string) => {
  const ulrObj = parse(decodeURIComponent(url));
  if (!ulrObj.search) return ulrObj.pathname;
  const path = trimSlashes(
    (ulrObj.pathname || '').split('api/')?.[1] || ulrObj.pathname,
  );
  return `${path}?${ulrObj.search
    .slice(1)
    .split('&')
    .filter((arg) => arg.toLowerCase() !== 'page_size=20')

    .sort()
    .join('&')}`;
};

export default toCanonicalURL;
