type GlobalState = {
  customLocation: InterProLocation;
  settings: SettingsState;
  download: DownloadState;
  status: {
    servers: Record<string, ServerStatus>;
    browser: boolean;
  };
  jobs: Record<string, { metadata: IprscanMetaIDB }>;
  [other: string]: unknown;
}; // TODO: replace for redux state type

type Endpoint =
  | 'entry'
  | 'protein'
  | 'structure'
  | 'taxonomy'
  | 'proteome'
  | 'set';

type EndpointPlural =
  | 'entries'
  | 'proteins'
  | 'structures'
  | 'taxa'
  | 'proteomes'
  | 'sets';

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
type EndpointFilter = [endpoint: Endpoint, location: EndpointPartialLocation];

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

type InterProLocationSearch = Record<string, string | boolean | Array<string>>;
type InterProLocation = {
  description: InterProDescription;
  search: InterProLocationSearch;
  hash: string;
  state: Record<string, string>;
};
type InterProPartialLocation = {
  description: InterProPartialDescription;
  search?: Record<string, string | boolean>;
  hash?: string;
  state?: Record<string, string>;
};

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
type ParsedURLServer = {
  protocol: string;
  hostname: string;
  port: number;
  root: string;
  query: string;
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
type ServerStatus = {
  status: boolean;
  lastCheck: number;
};
