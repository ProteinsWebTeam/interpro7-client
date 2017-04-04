// @flow
import lodashGet from 'lodash-es/get';

import * as defaults from './defaults';

// getUrl
const extractGetUrl = (getUrl = defaults.getUrlForApi) => {
  if (typeof getUrl === 'string') {
    return defaults.getUrl(getUrl);
  }
  return getUrl;
};
/* ::
  type Selector = function | string;
*/
// selector
const defaultSelector = (payload/*: any */) => payload;
const extractSelector = (selector/*: ?Selector */) => {
  if (!selector) return defaultSelector;
  if (typeof selector === 'string') {
    return payload => lodashGet(payload, selector);
  }
  return selector;
};
/* ::
  type Params = {
    getUrl: ?function,
    fetchOptions: ?Object,
    selector: ?Selector,
    propNamespace: ?string,
  } | string;
*/
export default (params/*: ?Params */) => {
  const extracted = {
    getUrl: defaults.getUrlForApi,
    fetchOptions: {},
    selector: defaultSelector,
    propNamespace: '',
  };
  if (!params) return extracted;
  if (typeof params !== 'object') {
    extracted.getUrl = (
      typeof params === 'string' ? defaults.getUrl(params) : params
    );
    return extracted;
  }
  extracted.getUrl = extractGetUrl(params.getUrl);
  extracted.fetchOptions = params.fetchOptions || {};
  extracted.propNamespace = params.propNamespace || '';
  extracted.selector = extractSelector(params.selector);
  return extracted;
};
