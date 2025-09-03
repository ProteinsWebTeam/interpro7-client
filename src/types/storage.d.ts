type IprscanMetaIDB = {
  group?: string;
  hasResults: boolean;
  saved: boolean;
  localID?: string;
  remoteID?: string;
  localTitle?: string | null;
  status: JobStatus;
  type: string;
  times: JobTimes;
  entries?: number;
  aboveThreshold?: boolean;
  seqtype?: 'p' | 'n';
};

type JobTimes = {
  [status in JobStatus]?: number;
} & {
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
  | 'queued'
  | 'error';

type IprscanDataIDB = {
  localID: string;
  applications: Array<string> | string;
  'interproscan-version'?: string;
  'interpro-version'?: string;
  input?: string;
  originalInput?: string;
  results: Array<Iprscan5Result>;
};

type IprscanNucleotideDataIDB = IprscanDataIDB & {
  results: Array<Iprscan5NucleotideResult>;
};

type LocalPayload = (Iprscan5Result | Iprscan5NucleotideResult) & {
  applications?: Array<string>;
  goterms?: Array<string>;
  pathways?: Array<string>;
  'interproscan-version'?: string;
  'interpro-version'?: string;
  sequence?: string;
  length?: number;
};
