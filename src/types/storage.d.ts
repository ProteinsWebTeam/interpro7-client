type IprscanMetaIDB = {
  group?: string;
  hasResults: boolean;
  saved: boolean;
  localID?: string;
  remoteID?: string;
  localTitle?: string;
  status: JobStatus;
  type: string;
  times: JobTimes;
  entries?: number;
};
type JobTimes = {
  created?: number;
  submitted?: number;
  importing?: number;
  lastUpdate: number;
};
type JobStatus =
  | 'created'
  | 'submitted'
  | 'failed'
  | 'importing'
  | 'imported file'
  | 'saved in browser'
  | 'running'
  | 'finished'
  | 'queued';

type IprscanDataIDB = {
  localID: string;
  applications: Array<string>;
  'interproscan-version': string;
  input: string;
  originalInput: string;
  results: Array<Iprscan5Result>;
};

type LocalPayload = Iprscan5Result & {
  group?: string;
  orf?: string;
  applications?: Array<string>;
  goterms?: Array<string>;
  pathways?: Array<string>;
  'interproscan-version'?: string;
};
