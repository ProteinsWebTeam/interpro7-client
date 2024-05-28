type RequestedData<Payload> = {
  loading: boolean;
  progress: number;
  ok: boolean;
  status: null | number;
  payload: null | Payload;
  url: string;
  headers?: Headers;
};

type FetchOptions = {
  method?: string;
  responseType?: string;
  useCache?: boolean;
};

type CancelableRequest<Response = BasicResponse> = {
  promise: Promise<Response>;
  canceled: boolean;
  cancel(): void;
};

type BasicResponse = {
  status: number;
  ok: boolean;
  headers: Headers;
};

type BaseLinkProps = {
  id: string | number;
  target?: string;
  className?: string;
  children?: React.ReactNode;
};

type ActiveClassProp = string | ((location: unknown) => string);

type DataKey = `data${string}`;
type IsStaleKey = `isStale${string}`;

type LoadDataPropsBase<Payload = unknown> = {
  data?: RequestedData<Payload>;
  isStale?: boolean;
};
type LoadDataProps<Payload = unknown, Namespace extends string = ''> = {
  [Property in keyof LoadDataPropsBase<Payload> as `${Property}${Namespace}`]: LoadDataPropsBase<Payload>[Property];
};

type GetUrl<Props = unknown> = (
  params: GlobalState | {},
  props?: Props,
) => string | null;

type ProteinViewerData<Feature = unknown> = Array<
  | [string, Array<Feature>]
  | [
      string,
      Array<Feature>,
      { component: string; attributes: Record<string, string> },
    ]
>;
type ProteinViewerDataObject<Feature = unknown> = Record<
  string,
  Array<Feature>
>;
type LoadDataParameters<Props = unknown> =
  | {
      getUrl?: GetUrl<Props>;
      fetchOptions?: FetchOptions;
      propNamespace?: string;
      weight?: number;
      mapStateToProps?:
        | ((state: unknown, props: unknown) => Props)
        | ((...args: unknown[]) => void);
      mapDispatchToProps?: Record<string, unknown>;
    }
  | string
  | GetUrl<Props>;
