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
declare module '*.svg' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
declare module '*.tmpl' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare module 'interpro-components' {
  let InterproHierarchy: InterProHierarchyProps;
  let InterproEntry: InterProEntryProps;
  let InterproType: InterProTypeProps;
}
declare module 'taxonomy-visualisation' {
  class TaxonomyVisualisation {
    tree: unknown;
    data: unknown;
    searchTerm: string;
    fisheye: boolean;
    constructor(x: unknown, options: {});
    addEventListener: (
      type: string,
      eventHandler: (event: Event) => void,
    ) => void;
    focusNodeWithID: (id?: string) => void;
    cleanup: () => void;
    resetZoom: () => void;
  }
  export default TaxonomyVisualisation;
}
declare module 'skylign' {
  let Skylign: SkylignProps;
}
interface SkylignProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  logo: string;
}

declare namespace JSX {
  interface IntrinsicElements {
    'interpro-type': InterProTypeProps;
    'interpro-hierarchy': InterProHierarchyProps;
    'interpro-entry': InterProEntryProps;
    'skylign-component': SkylignProps;
  }
}

type GlobalState = {
  customLocation: InterProLocation;
  settings: SettingsState;
  download: DownloadState;
  [other: string]: any;
}; // TODO: replace for redux state type

type Endpoint =
  | 'entry'
  | 'protein'
  | 'structure'
  | 'taxonomy'
  | 'proteome'
  | 'set';

type EndpointLocation = Required<EndpointPartialLocation>;
type EndpointPartialLocation = {
  isFilter?: boolean | null;
  db?: string | null;
  accession?: string | null;
  detail?: string | null;
  order?: number | null;
  integration?: string | null;
};
type InterProDescription = Required<
  InterProPartialDescription<EndpointLocation>
>;
type InterProPartialDescription<Location = EndpointPartialLocation> = {
  main?: {
    key: Endpoint | 'search' | 'result' | 'other';
    numberOfFilters?: 0;
  };
  entry?: Location & {
    integration?: string | null;
    memberDB?: string | null;
    memberDBAccession?: string | null;
  };
  protein?: Location;
  structure?: EndpointPartialLocation & {
    chain?: string | null;
  };
  taxonomy?: Location;
  proteome?: Location;
  set?: Location;
  search?: {
    type: string | null;
    value?: string | null;
  };
  result?: {
    type: string | null;
    accession?: string | null;
    detail?: string | null;
  };
  other?: string[];
};
type InterProLocation = {
  description: InterProDescription;
  search: Record<string, string | boolean>;
  hash: string;
  state: Record<string, string>;
};
type InterProPartialLocation = {
  description: InterProPartialDescription;
  search?: Record<string, string | boolean>;
  hash?: string;
  state?: Record<string, string>;
};
type EndpointFilter = [endpoint: Endpoint, location: EndpointPartialLocation];

type SettingsState = {
  navigation: {
    pageSize: number;
    secondsToRetry: number;
  };
  notifications: {
    showTreeToast: boolean;
    showConnectionStatusToast: boolean;
    showSettingsToast: boolean;
    showHelpToast: boolean;
    showCtrlToZoomToast: boolean;
  };
  ui: UISettings;
  cache: {
    enabled: boolean;
  };
  ebi: ParsedURLServer;
  api: ParsedURLServer;
  ipScan: ParsedURLServer;
  genome3d: ParsedURLServer;
  repeatsDB: ParsedURLServer;
  disprot: ParsedURLServer;
  wikipedia: ParsedURLServer;
  alphafold: ParsedURLServer;
  uniprot: ParsedURLServer;
  rfam: ParsedURLServer;
  proteinsAPI: ParsedURLServer;
};
type UISettings = {
  lowGraphics: boolean;
  colorDomainsBy: 'ACCESSION' | 'MEMBER_DB' | 'DOMAIN_RELATIONSHIP';
  labelContent: LabelUISettings;
  structureViewer: boolean;
  shouldHighlight: boolean;
  idaAccessionDB: string;
  isPIPEnabled: boolean;
};
type LabelUISettings = {
  accession: boolean;
  name: boolean;
  short: boolean;
};

type DownloadState = Record<string, DownloadProgress>;

type DownloadProgress = {
  progress: number;
  successful: null | boolean;
  blobURL: string;
  size: null | number;
  version: number;
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
  accession?: string;
  accessions: string | string[];
  displaymode: string;
  hideafter?: number;
  hrefroot: string | null;
  hierarchy?: InterProHierarchyType;
  _hierarchy?: InterProHierarchyType;
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
  medline_journal?: string;
  journal?: string;
  ISO_journal?: string;
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

type StructuredDescription = {
  text: string;
  llm: boolean;
  checked: boolean;
  updated: boolean;
};

type MetadataCounter =
  | number
  | {
      [db: string]: number;
    };
type MetadataCounters = {
  [resource: string]: MetadataCounter;
};
interface Metadata {
  accession: string;
  source_database: string;
  description: Array<string | StructuredDescription>;
  counters: MetadataCounters;
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
  | 'ncbifam'
  | 'antifam';

type NameObject = {
  name: string;
  short?: string;
};

interface EntryMetadata extends Metadata {
  name: NameObject;
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
  wikipedia?: Array<WikipediaEntry>;
  set_info?: {
    accession: string;
    name: string;
  };
  representative_structure?: {
    accession: string;
    name: string;
  };
  is_removed?: boolean;
  is_llm?: boolean;
  is_reviewed_llm?: boolean;
  is_updated_llm?: boolean;
  in_alphafold?: boolean;
  entry_annotations?: Record<string, unknown>;
}

type SourceOrganism = {
  fullName: string;
  taxId: number;
};
interface ProteinMetadata extends Metadata {
  id?: string;
  name: string;
  description: Array<string>;
  source_database: 'uniprot' | 'reviewed' | 'unreviewed';
  length: number;
  sequence: string;
  proteome: string;
  gene: string;
  protein_evidence: number;
  is_fragment: boolean;
  in_alphafold: boolean;
  ida_accession: string;
  source_organism: SourceOrganism;
}
interface StructureMetadata extends Metadata {
  name: NameObject | string;
  experiment_type: string;
  release_date: string;
  literature: Record<string, Reference>;
  chains: Array<string>;
  resolution: number;
}
type PayloadList<Payload> = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Array<Payload>;
};
type Fragment = {
  start: number;
  end: number;
  'dc-status'?: string;
};
type BaseLocation = {
  fragments: Array<Fragment>;
};
type ProteinEntryPayload = {
  metadata: ProteinMetadata;
  entries: Array<{
    accession: string;
    entry_protein_locations: Array<
      BaseLocation & {
        model: string | null;
        score: number | null;
        subfamily: { accession: string };
      }
    >;
    protein_length: number;
    source_database: string;
    entry_type: string;
    entry_integrated: string | null;
  }>;
};

interface TaxonomyMetadata extends Metadata {
  lineage: string;
  rank: string;
  children: Array<string>;
  parent: string;
  name: Required<NameObject>;
}
type WithNames = {
  names: Record<string, Required<NameObject>>;
};
type WithTaxonomyFilters = {
  children?: Record<
    string,
    {
      entries: number;
      proteomes: number;
      proteins: number;
      structures: number;
    }
  >;
};
interface ProteomeMetadata extends Metadata {
  is_reference: boolean;
  strain: string;
  assembly: string;
  taxonomy: string;
  lineage: string;
  name: NameObject | string;
  proteomeAccession?: string;
}
interface SetMetadata extends Omit<Metadata, 'description'> {
  id: string;
  name: NameObject;
  description: string;
  relationships: {
    nodes: Array<{
      accession: string;
      short_name: string;
      name: string;
      type: string;
      score: number;
    }>;
    links: Array<{
      source: string;
      target: string;
      score: number;
    }>;
  };
  authors: Array<string> | null;
  literature: Array<Reference>;
}

type StructureLinkedObject = {
  accession: string;
  name: string;
  short_name?: string;
  structure_protein_locations: Array<ProtVistaLocation>;
  entry_protein_locations: Array<ProtVistaLocation>;
  entry_structure_locations: Array<ProtVistaLocation>;

  protein_structure_mapping: Record<
    string,
    Array<{
      protein_start: number;
      protein_end: number;
      structure_start: number;
      structure_end: number;
      author_structure_start: number;
      author_structure_end: number;
    }>
  >;
  protein: string;
  protein_length: number;
  resolution: number;
  source_database: string;
  chain: string;
  experiment_type: string;
  type?: string;
  entry_type?: string;
  children?: Array<
    MinimalFeature & {
      entry_protein_locations: unknown;
      entry_structure_locations: unknown;
    }
  >;
  sequence: string;
  sequence_length: number;
};
type EntryStructurePayload = {
  metadata: EntryMetadata;
  structures: Array<StructureLinkedObject>;
};
type SecondaryStructure = {
  accession: string;
  locations: ProtVistaLocation[];
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
  headers?: Headers;
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

type EndpointPayload = Record<
  string,
  Record<string, number | Record<string, number>>
>;

type ConservationValue = {
  position: number;
  value: string | number | null;
  score: number;
};
type ConservationPayload = Record<
  string,
  {
    entries: Record<string, Array<Array<ConservationValue>>>;
    warnings: Array<string>;
  }
>;

type OpenAPIReference = {
  $ref?: string;
};

type OpenAPIParameterSchema = {
  type: string;
  enum?: Array<string>;
  allowReserved?: boolean;
  explode?: boolean;
  style?: string;
  pattern?: string;
};
type OpenAPIParameter = {
  description: string;
  in: string;
  name: string;
  schema: OpenAPIParameterSchema | OpenAPIReference;
  allowEmptyValue?: boolean;
};
type OpenAPIComponents = {
  parameters: Record<string, OpenAPIParameter>;
  responses: Record<string, unknown>;
  schemas: Record<
    string,
    {
      type: string;
      enum?: Array<string>;
    }
  >;
};
type OpenAPIPayload = {
  components: OpenAPIComponents;
  info: {
    description: string;
    title: string;
    version: string;
  };
  openapi: string;
  paths: Record<
    string,
    {
      get: {
        parameters: Array<{
          $ref?: string;
          description?: string;
          name?: string;
          in?: string;
          required?: boolean;
        }>;
        responses: unknown;
        summary: string;
        tags: Array<string>;
      };
    }
  >;
  servers: Array<{
    description: string;
    url: string;
  }>;
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

type UniProtProteomesPayload = {
  id: string;
  description: string;
  [key: string]: unknown;
};
type RfamPayload = {
  hitCount: number;
  entries: Array<unknown>;
  [key: string]: unknown;
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
type AlphafoldConfidencePayload = {
  residueNumber: Array<number>;
  confidenceScore: Array<number>;
  confidenceCategory: Array<string>;
};

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

type ErrorPayload = {
  detail: string;
};
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

type ProtVistaFragment = {
  start: number;
  end: number;
  color?: string;
  shape?: string;
  residues?: string;
  seq_feature?: string;
  fill?: string;
  representative?: boolean;
  protein_start?: number;
  protein_end?: number;
};

type ProtVistaLocation = {
  fragments: Array<ProtVistaFragment>;
  match?: string;
  model_acc?: string;
  subfamily?: {
    name: string;
    accession: string;
  };
  description?: string;
  accession?: string;
  [other: string]: unknown;
};
type MetadataWithLocations = Metadata & {
  entry_protein_locations?: Array<ProtVistaLocation>;
  protein_structure_locations?: Array<ProtVistaLocation>;
  entry_structure_locations?: Array<ProtVistaLocation>;
  coordinates?: Array<ProtVistaLocation>;
  sequence_length?: number;
  sequence?: string;
};

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
type ResidueMetadata = {
  accession: string;
  source_database: string;
  name: string;
  locations: Array<ProtVistaLocation>;
};
type ResiduesPayload = Record<string, ResidueMetadata>;

type TaxaPayload = {
  taxa: Taxon;
};
type Taxon = {
  id: string;
  rank: string;
  name: string;
  lineage?: Array<{
    name: string;
    id: string;
  }>;
  proteins: number;
  species: number;
  children: Array<Taxon>;
};

type IDAResult = {
  ida: string;
  ida_id: string;
  representative: {
    accession: string;
    length: number;
    domains: Array<{
      accession: string;
      name: string;
      coordinates: [
        {
          fragments: [
            {
              start: number;
              end: number;
            },
          ];
        },
      ];
    }>;
  };
  unique_proteins: number;
};
type IDAPayload = PayloadList<IDAResult>;

type Genome3DAnnotation = {
  accession: string;
  metadata: {
    source_database: string;
    name: string;
    resource: string;
    type: string;
    confidence: number;
  };
  length: number;
  locations: Array<ProtVistaLocation>;
};
type Genome3DProteinPayload = {
  data: {
    annotations: Array<Genome3DAnnotation>;
    sequence: string;
    gene_name: string;
    description: string;
    taxon_id: number;
    uniprot_acc: string;
  };
  message: string;
};
type Genome3DStructurePayload = {
  data: Array<{
    annotations: Array<{
      resource: string;
      uniprot_acc: string;
      confidence: number;
      segments: Array<{
        uniprot_start: number;
        uniprot_stop: number;
      }>;
    }>;
    sequence: string;
    gene_name: string;
    description: string;
    taxon_id: number;
  }>;
  message: string;
};
type RepeatsDBAnnotation = {
  start: number;
  end: number;
  classification: Array<string>;
  period: number;
};
type RepeatsDBPayload = Array<{
  uniprot_id: string;
  uniprot_name: string;
  uniprot_sequence: string;
  repeatsdb_consensus_majority: Array<RepeatsDBAnnotation>;
  reviewed_one: boolean;
  reviewed_all: boolean;
}>;
type DisprotRegion = {
  region_id: string;
  term_namespace: string;
  term_name: string;
  ec_name: string;
  acc: string;
  start: number;
  end: number;
  released: string;
};
type DisprotConsensusRegion = {
  start: number;
  end: number;
  type: string;
};
type DisprotConsensus = {
  full: Array<DisprotConsensusRegion>;
  'Structural state': Array<object>;
  'Structural transition': Array<object>;
  'Biological process': Array<object>;
};
type DisProtPayload = {
  acc: string;
  sequence: string;
  taxonomy: Array<string>;
  length: number;
  features: unknown;
  date: string;
  disprot_id: string;
  name: string;
  genes: Array<unknown>;
  number_ambiguous_regions: number;
  number_obsolete_regions: number;
  disorder_content: number;
  regions_counter: number;
  regions: Array<DisprotRegion>;
  disprot_consensus: DisprotConsensus;
};

type ExtraFeaturesPayload = Record<
  string,
  {
    accession: string;
    source_database: string;
    locations: Array<ProtVistaLocation>;
  }
>;
type MinimalFeature = {
  accession: string;
  source_database?: string;
  name?: string;
  protein_length?: number;
  locations?: Array<ProtVistaLocation>;
  children?: Array<{ accession: string; source_database: string }>;
  member_databases?: Record<string, unknown>;
};
type EndpointWithMatchesPayload<Meta = Metadata, Match = MatchI> = {
  metadata: Meta;
  extra_fields?: Record<string, unknown>;
} & {
  [matches: string]: Array<Match>;
};
type Data<Meta = Metadata, Match = MatchI> = {
  data?: RequestedData<PayloadList<EndpointWithMatchesPayload<Meta, Match>>>;
  endpoint: Endpoint;
};
type MatchI = {
  accession: string;
};
interface EntryProteinMatch extends MatchI {
  entry_protein_locations: Array<ProtVistaLocation>;
  protein_length: number;
  source_database: string;
  entry_type: string;
  entry_integrated: string | null;
}
interface StructureProteinMatch extends MatchI {
  entry_protein_locations: Array<ProtVistaLocation>;
  structure_protein_locations: Array<ProtVistaLocation>;
  protein_length: number;
  source_database: string;
  entry_type: string;
  chain: string;
  entry_integrated: string | null;
}
interface EntryStructureMatch extends MatchI {
  entry_structure_locations: Array<ProtVistaLocation>;
  protein_length: number;
  sequence_length: number;
  sequence: string;
  protein?: string;
  source_database: string;
  chain: string;
  entry_type: string;
  entry_integrated: string | null;
}

type AnyMatch = Partial<EntryProteinMatch> &
  Partial<EntryStructureMatch> &
  Partial<StructureProteinMatch>;

type Iprscan5Signature = {
  accession: string;
  description: string;
  name: string;
  signatureLibraryRelease: {
    library: string;
    version: string;
  };
  entry: Iprscan5Entry;
};
type Iprscan5Entry = {
  accession: string;
  name: string;
  description: string;
  type: string;
  goXRefs: unknown[];
  pathwayXRefs: unknown[];
};
type Iprscan5Location = {
  start: number;
  end: number;
  hmmStart: number;
  hmmEnd: number;
  hmmLength: number;
  hmmBounds: string;
  evalue: number;
  score: number;
  envelopeStart: number;
  envelopeEnd: number;
  postProcessed: true;
  'location-fragments': Array<Fragment>;
  representative?: boolean;
  sites?: Array<{
    label?: string;
    description?: string;
    siteLocations: Array<Fragment>;
  }>;
};
type Iprscan5Match = {
  signature: Iprscan5Signature;
  locations: Array<Iprscan5Location>;
  evalue?: number;
  score?: number;
  'model-ac'?: string;
  accession?: string;
  source_database?: string;
};
type Iprscan5Result = {
  sequence: string;
  md5: string;
  matches: Array<Iprscan5Match>;
  xref: Array<{
    name: string;
    id: string;
  }>;
};
type Iprscan5Payload = {
  'interproscan-version': string;
  results: Array<Iprscan5Result>;
};

type IprscanMetaIDB = {
  group: string;
  hasResults: boolean;
  saved: boolean;
  localID: string;
  remoteID: string;
  localTitle: string;
  status: string;
  type: string;
  times: Record<string, number>;
};
