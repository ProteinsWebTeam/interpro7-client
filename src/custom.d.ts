declare module '*.css' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
declare module 'interpro-components' {
  let InterproHierarchy: InterProHierarchyProps;
  let InterproEntry: InterProEntryProps;
  let InterproType: InterProTypeProps;
}

declare namespace JSX {
  interface IntrinsicElements {
    'interpro-type': InterProTypeProps;
    'interpro-hierarchy': InterProHierarchyProps;
    'interpro-entry': InterProEntryProps;
  }
}

type GlobalState = Record<string, any>; // TODO: replace for redux state type

interface InterProTypeProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  type: string;
  dimension: string;
}
interface InterProEntryProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  type: string;
  dimension: string;
}

interface InterProHierarchyProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  accession: string;
  accessions: string | string[];
  displaymode: string;
  hideafter: number;
  hrefroot: string | null;
  hierarchy?: InterProHierarchyType;
}

type InterProHierarchyType = {
  accession: string;
  name: string;
  type: string;
  children: Array<InterProHierarchyType> | null;
};

type GOTerm = {
  identifier: string;
  name: string;
  category: {
    code: string;
    name: string;
  };
  category_name?: string;
  category_code?: string;
};
type Reference = {
  PMID: number;
  ISBN: string | null;
  volume: string;
  issue: string;
  year: number;
  title: string;
  URL: string | null;
  raw_pages?: string;
  rawPages?: string;
  medline_journal: string;
  ISO_journal: string;
  authors: Array<string>;
  DOI_URL: string | null;
};

type WikipediaEntry = {
  title: string;
  extract: string;
  thumbnail: string;
};

type ContributingEntries = {
  [db: string]: {
    [accession: string]: string;
  };
} | null;

type CrossReference = {
  displayName: string;
  description: string;
  rank: number;
  accessions: Array<{
    accession: string;
    url: string;
  }>;
};
type LiteratureMetadata = {
  [PubID: string]: Reference;
};
type EntryMetadata = {
  accession: string;
  name: { name: string; short?: string };
  source_database: string;
  type: string;
  integrated: string | null;
  member_databases: ContributingEntries;
  go_terms: Array<GOTerm>;
  description: Array<string>;
  literature: LiteratureMetadata;
  hierarchy?: InterProHierarchyType;
  overlaps_with?: Array<{
    accession: string;
    name: string;
    type: string;
  }> | null;
  cross_references: Record<string, CrossReference>;
  wikipedia: WikipediaEntry;
  counters: {
    [resource: string]:
      | number
      | {
          [db: string]: number;
        };
  };
  set_info?: {
    accession: string;
    name: string;
  };
  representative_structure?: {
    accession: string;
    name: string;
  };
};

type DBInfo = {
  canonical: string;
  name: string;
  description: string;
  version: string;
  releaseDate: string;
  type: string;
};

type DBsInfo = Record<string, DBInfo>;

type RequestedData<Payload> = {
  loading: boolean;
  progress: number;
  ok: boolean;
  status: null | number;
  payload: null | Payload;
  url: string;
};

type RootAPIPayload = {
  databases: DBsInfo;
  endpoints: Array<string>;
  sources: {
    mysql: {
      server: string;
      status: string;
    };
    elasticsearch: {
      server: string;
      status: string;
    };
  };
};
type WikipediaPayload = {
  parse: {
    title: string;
    pageid: number;
    parsetree: {
      '*': string;
      [node: string]: string;
    };
  };
};

type ParsedURLServer = {
  protocol: string;
  hostname: string;
  port: number;
  root: string;
};

type FetchOptions = {
  method?: string;
  responseType?: string;
};

type CancelableRequest<Response = BasicResponse> = {
  promise: Promise<Response>;
  canceled: boolean;
  cancel(): void;
};

type BasicResponse = {
  status: number;
  ok: boolean;
  headers: Set<string>;
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
// Props to be injected in the wrapped component
type LoadDataProps<Payload = unknown> = {
  [k: DataKey]: RequestedData<Payload>;
  [k: IsStaleKey]: boolean;
};

type GetUrl<Props = unknown> = (
  params: Record<string, unknown>,
  props?: Props
) => string | null;
