// @flow
import * as defaults from '../defaults';

// getUrl
const extractGetUrl = (getUrl = defaults.getUrlForApi) => {
  if (typeof getUrl === 'string') {
    return defaults.getUrl(getUrl);
  }
  return getUrl;
};

/* ::
  type GetUrl = Object => string;
  type Params = {|
    getUrl: ?GetUrl,
    fetchOptions: ?Object,
    propNamespace: ?string,
    weight: ?number,
  |} | string;
*/
export default (params /*: ?Params */) => {
  const extracted = {
    getUrl: defaults.getUrlForApi,
    fetchOptions: {},
    propNamespace: '',
    weight: 1,
  };
  if (!params) return extracted;
  if (typeof params !== 'object') {
    extracted.getUrl =
      typeof params === 'string' ? defaults.getUrl(params) : params;
    return extracted;
  }
  extracted.getUrl = extractGetUrl(params.getUrl);
  extracted.fetchOptions = params.fetchOptions || extracted.fetchOptions;
  extracted.propNamespace = params.propNamespace || extracted.propNamespace;
  extracted.weight = params.weight || extracted.weight;
  return extracted;
};
