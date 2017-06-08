import qs from 'query-string';

const locationRE = /^([^?#]*)(\?([^#]*))?(#.*)?$/;
const multipleSlash = /\/+/g;

const cleanPathname = (pathname/*: string */ = '') => (
  pathname.replace(multipleSlash, '/')
);

/*:: type Location = {
  pathname: string,
  search: ?string | Object,
  hash: ?string,
}; */

export default (location/*: string | Location */) => {
  if (typeof location !== 'string') {
    return {...location, pathname: cleanPathname(location.pathname)};
  }
  const [, pathname, , search = '', , hash = ''] = (
    location.match(locationRE) || []
  );
  return {pathname: cleanPathname(pathname), search: qs.parse(search), hash};
};
