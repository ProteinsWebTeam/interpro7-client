declare module '*.css' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    'interpro-type': InterProTypeProps;
  }
}

interface InterProTypeProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  type: string;
  dimension: string;
}

type InterProHierarchy = {
  accession: string;
  name: string;
  type: string;
  children: Array<InterProHierarchy> | null;
};
type GOTerm = {
  identifier: string;
  name: string;
  category: {
    code: string;
    name: string;
  };
};
type Reference = {
  PMID: number;
  ISBN: string | null;
  volume: string;
  issue: string;
  year: number;
  title: string;
  URL: string | null;
  raw_pages: string;
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

type EntryMetadata = {
  accession: string;
  name: { name: string; short?: string };
  source_database: string;
  type: string;
  integrated: string | null;
  member_databases: {
    [db: string]: {
      [accession: string]: string;
    };
  } | null;
  go_terms: Array<GOTerm>;
  description: Array<string>;
  literature: {
    [PubID: string]: Reference;
  };
  hierarchy?: InterProHierarchy;
  overlaps_with?: Array<{
    accession: string;
    name: string;
    type: string;
  }> | null;
  cross_references: {
    [source: string]: {
      displayName: string;
      description: string;
      rank: number;
      accessions: Array<{
        accession: string;
        url: string;
      }>;
    };
  };
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
