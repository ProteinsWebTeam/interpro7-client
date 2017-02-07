import qs from 'query-string';

const locationRE = /^([^?#]*)(\?([^#]*))?(#.*)?$/;

export default location => {
  if (typeof location !== 'string') return location;
  const [, pathname, , search = '', , hash = ''] = location.match(locationRE);
  return {pathname, search: qs.parse(search), hash};
};
