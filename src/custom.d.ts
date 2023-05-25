declare module '*.css' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
declare module '*.avif' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
declare module '*.png' {
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

type GlobalState = {
  customLocation: InterProLocation;
  [other: string]: any;
}; // TODO: replace for redux state type
type Endpoint =
  | 'entry'
  | 'protein'
  | 'structure'
  | 'taxonomy'
  | 'proteome'
  | 'set';

type EndpointLocation = {
  isFilter: boolean | null;
  db: string;
  accession: string;
  detail: string;
  order: number | null;
};
type InterProDescription = {
  main: {
    key: Endpoint | 'search' | 'result' | 'other';
    numberOfFilters: 0;
  };
  entry: EndpointLocation & {
    integration: string | null;
    memberDB: string | null;
    memberDBAccession: string | null;
  };
  protein: EndpointLocation;
  structure: EndpointLocation & {
    chain: string | null;
  };
  taxonomy: EndpointLocation;
  proteome: EndpointLocation;
  set: EndpointLocation;
  search: {
    type: string | null;
    value: string | null;
  };
  result: {
    type: string | null;
    accession: string | null;
    detail: string | null;
  };
  other: string[];
};
type InterProLocation = {
  description: InterProDescription;
  search: Record<string, string>;
  hash: string;
  state: Record<string, string>;
};

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

interface Metadata {
  accession: string;
  source_database: string;
  description: Array<string>;
  counters: {
    [resource: string]:
      | number
      | {
          [db: string]: number;
        };
  };
  go_terms?: Array<GOTerm>;
}

type MemberDB =
  | 'cathgene3d'
  | 'cdd'
  | 'hamap'
  | 'panther'
  | 'pfam'
  | 'pirsf'
  | 'prints'
  | 'prosite'
  | 'profile'
  | 'sfld'
  | 'smart'
  | 'ssf'
  | 'tigrfams'
  | 'ncbifam';
interface EntryMetadata extends Metadata {
  name: { name: string; short?: string };
  source_database: 'interpro' | MemberDB;
  type: string;
  integrated: string | null;
  member_databases: ContributingEntries;
  literature: LiteratureMetadata;
  hierarchy?: InterProHierarchyType;
  overlaps_with?: Array<{
    accession: string;
    name: string;
    type: string;
  }> | null;
  cross_references: Record<string, CrossReference>;
  wikipedia: WikipediaEntry;
  set_info?: {
    accession: string;
    name: string;
  };
  representative_structure?: {
    accession: string;
    name: string;
  };
}
interface ProteinMetadata extends Metadata {
  id?: string;
  name: string;
  source_database: 'uniprot' | 'reviewed' | 'unreviewed';
  length: number;
  sequence: string;
  proteome: string;
  gene: string;
  protein_evidence: number;
  is_fragment: boolean;
  ida_accession: string;
}
type PayloadList<Payload> = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Array<Payload>;
};
type ProteinEntryPayload = {
  metadata: ProteinMetadata;
  entries: Array<{
    accession: string;
    entry_protein_locations: [
      {
        fragments: Array<{
          start: 52;
          end: 127;
          'dc-status': 'CONTINUOUS';
        }>;
        model: string | null;
        score: number | null;
      }
    ];
    protein_length: number;
    source_database: string;
    entry_type: string;
    entry_integrated: string | null;
  }>;
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
  endpoints: Array<Endpoint>;
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
type AlphafoldPayload = Array<{
  entryId: string;
  gene: string;
  uniprotAccession: string;
  uniprotId: string;
  uniprotDescription: string;
  taxId: number;
  organismScientificName: string;
  uniprotStart: number;
  uniprotEnd: number;
  uniprotSequence: string;
  modelCreatedDate: string;
  latestVersion: number;
  allVersions: number[];
  cifUrl: string;
  bcifUrl: string;
  pdbUrl: string;
  paeImageUrl: string;
  paeDocUrl: string;
}>;

type ParsedURLServer = {
  protocol: string;
  hostname: string;
  port: number;
  root: string;
  query: string;
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
