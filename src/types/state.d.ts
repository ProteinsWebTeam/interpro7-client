type GlobalState = {
  customLocation: InterProLocation;
  dataProgress: DataProgress;
  download: DownloadState;
  favourites: FavouritesState;
  jobs: JobsState;
  settings: SettingsState;
  status: {
    servers: Record<Server, ServerStatus>;
    browser: boolean;
  };
  toasts: ToastsState;
  ui: UIState;
};

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
};
type EntryLocation = EndpointPartialLocation & {
  integration?: string | null;
  memberDB?: string | null;
  memberDBAccession?: string | null;
};
type InterProDescription = Required<
  InterProPartialDescription<EndpointLocation>
>;
type EndpointFilter = [endpoint: Endpoint, location: EndpointPartialLocation];

type InterProPartialDescription<Location = EndpointPartialLocation> = {
  main?: {
    key: Endpoint | 'search' | 'result' | 'other' | null;
    numberOfFilters?: number;
  };
  entry?: Location & EntryLocation;
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
    job?: string | null;
    detail?: string | null;
  };
  other?: string[];
};

type InterProLocationSearch = {
  // Pagination
  page?: number;
  page_size?: number;
  // API
  extra_fields?: string;
  // IDA search
  ida_search?: string;
  ida_ignore?: string;
  ordered?: boolean;
  exact?: boolean;
  [key: string]: string | boolean | number | Array<string> | undefined;
};

type InterProLocation = {
  description: InterProDescription;
  search: InterProLocationSearch;
  hash: string;
  state: Record<string, string>;
};
type InterProPartialLocation = {
  description: InterProPartialDescription;
  search?: InterProLocationSearch;
  hash?: string;
  state?: Record<string, string>;
};

type JobsState = Record<string, { metadata: MinimalJobMetadata }>;
type MinimalJobMetadata = {
  localID: string;
  type: string;
} & Partial<IprscanMetaIDB>;
type InitialJobData = {
  input: string;
  applications?: Array<string>;
};
type SettingsState = {
  navigation: NavigationSettings;
  notifications: NotificationsSettings;
  ui: UISettings;
  cache: CacheSettings;
  ebi: ParsedURLServer;
  api: ParsedURLServer;
  ipScan: ParsedURLServer;
  repeatsDB: ParsedURLServer;
  disprot: ParsedURLServer;
  wikipedia: ParsedURLServer;
  alphafold: ParsedURLServer;
  bfvd: ParsedURLServer;
  uniprot: ParsedURLServer;
  rfam: ParsedURLServer;
  proteinsAPI: ParsedURLServer;
  ted: ParsedURLServer;
};
type ParsedURLServer = {
  protocol: string;
  hostname: string;
  port: number;
  root: string;
  query: string;
};

type NavigationSettings = {
  pageSize: number;
  secondsToRetry: number;
};
type NotificationsSettings = {
  showTreeToast: boolean;
  showConnectionStatusToast: boolean;
  showSettingsToast: boolean;
  showHelpToast: boolean;
  showCtrlToZoomToast: boolean;
};
type UISettings = {
  lowGraphics: boolean;
  colorDomainsBy: 'ACCESSION' | 'MEMBER_DB' | 'DOMAIN_RELATIONSHIP';
  showMoreSettings: boolean;
  labelContent: LabelUISettings;
  matchTypeSettings: 'hmm' | 'dl' | 'hmm_and_dl' | 'best';
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

type MatchTypeUISettings = 'hmm' | 'dl' | 'hmm_and_dl' | 'best';

type CacheSettings = {
  enabled: boolean;
};
type DownloadState = Record<string, DownloadProgress | CompletedDownload>;

type DownloadProgress = {
  progress: number;
  successful?: null | boolean;
  blobURL: string;
  size: null | number;
  version: number;
  fileType: DownloadFileTypes;
  date?: Date;
  length?: number;
  subset?: boolean;
  originURL?: string;
};

type CompletedDownload = DownloadProgress & {
  blob: Blob;
  date: Date;
  length: number;
  subset: boolean;
  originURL?: string;
};

type Server =
  | 'api'
  | 'ebi'
  | 'ipScan'
  | 'wikipedia'
  | 'alphafold'
  | 'bfvd'
  | 'repeatsDB'
  | 'disprot'
  | 'proteinsAPI';
type ServerStatus = {
  status: boolean | null;
  lastCheck: number | null;
};

type DownloadFileTypes =
  | 'txt'
  | 'accession'
  | 'fasta'
  | 'json'
  | 'ndjson'
  | 'tsv'
  | 'xml';

type DataProgress = Record<string, DatumProgress>;
type DatumProgress = {
  progress: number;
  weight: number;
};

type FavouritesState = {
  entries: Array<string>;
};

type ToastsState = Record<string, ToastData>;

type ToastData = {
  paused?: boolean;
  className?: string;
  title: string;
  body?: string;
  link?: { to: InterProPartialLocation; children: string };
  action?: {
    text: string;
    fn: () => void;
  };
  ttl?: number;
  checkBox?: {
    label: string;
    fn: () => void;
  };
  // handleClose?: () => void;
};

type UIState = {
  emblMapNav: boolean;
  sideNav: boolean;
  stuck: boolean;
};
