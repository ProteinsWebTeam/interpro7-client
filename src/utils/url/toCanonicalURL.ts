import { trimSlashes } from '.';

export const toCanonicalURL = (url: string) => {
  const urlObj = new URL(decodeURIComponent(url));
  if (!urlObj.search) return urlObj.pathname;
  const path = trimSlashes(
    urlObj.pathname.split('api/')?.[1] || urlObj.pathname,
  );
  return `${path}?${urlObj.search
    .slice(1)
    .split('&')
    .filter((arg) => arg.toLowerCase() !== 'page_size=20')

    .sort()
    .join('&')}`;
};

export default toCanonicalURL;
