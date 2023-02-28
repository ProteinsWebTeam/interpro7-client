import { noop } from 'lodash-es';

import * as defaults from '../defaults';

// getUrl
const extractGetUrl = (getUrl = defaults.getUrlForApi) => {
  if (typeof getUrl === 'string') {
    return defaults.getUrl(getUrl);
  }
  return getUrl;
};

type GetUrl = (
  params: Record<string, unknown>,
  props?: Record<string, unknown>
) => string;

export type Params =
  | {
      getUrl?: GetUrl;
      fetchOptions?: FetchOptions;
      propNamespace?: string;
      weight?: number;
      mapStateToProps?: (
        state: unknown,
        props: unknown
      ) => Record<string, unknown>;
      mapDispatchToProps?: Record<string, unknown>;
    }
  | string
  | GetUrl;

export default (params?: Params) => {
  const extracted: Params = {
    getUrl: defaults.getUrlForApi,
    fetchOptions: {},
    propNamespace: '',
    weight: 1,
    mapStateToProps: noop,
    mapDispatchToProps: {},
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
  extracted.mapStateToProps =
    params.mapStateToProps || extracted.mapStateToProps;
  extracted.mapDispatchToProps =
    params.mapDispatchToProps || extracted.mapDispatchToProps;
  return extracted;
};
