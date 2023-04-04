import { noop } from 'lodash-es';

import * as defaults from '../defaults';

// getUrl
const extractGetUrl = <Props = Record<string, unknown>>(
  getUrl: string | GetUrl<Props> = defaults.getUrlForApi
) => {
  if (typeof getUrl === 'string') {
    return defaults.getUrl(getUrl);
  }
  return getUrl;
};

export type Params<Props = unknown> =
  | {
      getUrl?: GetUrl<Props>;
      fetchOptions?: FetchOptions;
      propNamespace?: string;
      weight?: number;
      mapStateToProps?:
        | ((state: unknown, props: unknown) => Props)
        | typeof noop;
      mapDispatchToProps?: Record<string, unknown>;
    }
  | string
  | GetUrl<Props>;

export type ExtractedParams<Props = unknown> = {
  getUrl: GetUrl<Props>;
  fetchOptions: FetchOptions;
  propNamespace: string;
  weight: number;
  mapStateToProps:
    | ((state: unknown, props: unknown) => Record<string, unknown>)
    | typeof noop;
  mapDispatchToProps: Record<string, unknown>;
};

export default <Props = unknown>(params?: Params<Props>) => {
  const extracted: ExtractedParams<Props> = {
    getUrl: defaults.getUrlForApi as GetUrl<Props>,
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
