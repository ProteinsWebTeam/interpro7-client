type Iprscan5Signature = {
  accession: string;
  description: string;
  name: string;
  signatureLibraryRelease: {
    library: string;
    version: string;
  };
  entry: Iprscan5Entry;
  type?: string;
};
type Iprscan5Entry = {
  accession: string;
  name: string;
  description: string;
  type: string;
  goXRefs: Array<IPrscan5GO>;
  pathwayXRefs: unknown[];
};
type IPrscan5GO = { id: string; category: string; name: string };
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
  goXRefs?: Array<IPrscan5GO>;
};
type Iprscan5Result = {
  sequence: string;
  sequenceLength?: number;
  md5: string;
  matches: Array<Iprscan5Match>;
  xref: Array<{
    name: string;
    id: string;
  }>;
  crossReferences?: Array<{
    name: string;
    id: string;
  }>;
};
type Iprscan5NucleotideResult = {
  id: number;
  crossReferences: Array<{
    id: string;
    name: string;
    nucleotideSequence: number;
  }>;
  md5: string;
  openReadingFrames: Array<Iprscan5ORFResult>;
};
type Iprscan5ORFResult = {
  id: number;
  start: number;
  end: number;
  nucleotideSequence: number;
  strand: string;
  protein: Iprscan5Result;
};

type Iprscan5Payload = {
  'interproscan-version'?: string;
  'interpro-version'?: string;
  results: Array<Iprscan5Result>;
};

type ProteinsAPIProteomics = {
  accession: string;
  start: number;
  end: number;
  features: [];
};

type InterProN_Match = MinimalFeature & {
  type: string;
  is_preferred: boolean;
  integrated: MinimalFeature | ExtendedFeature | string;
  entry_protein_locations: FeatureLocation[];
};

type InterProNMatches = Record<string, InterProN_Match>;

type IprscanParameterValue = {
  label: string;
  value: string;
  defaultValue: boolean;
  properties: {
    properties: Array<{
      key: string;
      value: string;
    }>;
    empty: boolean;
  };
};

type IprscanParametersDetailsPayload = {
  name: string;
  description: string;
  values: {
    values: Array<IprscanParameterValue>;
  };
};

type EBISearchEntry = {
  accession: string;
  fields: {
    name: Array<string>;
    source_database: Array<string>;
  };
};
type EBISearchPayload = {
  entries: Array<EBISearchEntry>;
  hitCount: number;
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
  uniprotAccession: string;
  uniprotId: string;
  uniprotDescription: string;
  taxId: number;
  organismScientificName: string;
  uniprotSequence: string;
  modelCreatedDate: string;
  cifUrl: string;
  pdbUrl: string;
}>;
type AlphafoldConfidencePayload = {
  residueNumber: Array<number>;
  confidenceScore: Array<number>;
  confidenceCategory: Array<string>;
};

type RepeatsDBAnnotation = {
  start: number;
  end: number;
  class: string;
  type: string;
};

type RepeatsDBItem = {
  content: {
    chain: {
      structure: string;
    };
    loci: Array<RepeatsDBAnnotation>;
  };
};

type RepeatsDBPayload = {
  items: {
    [key: number]: RepeatsDBItem;
  };
};

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
type TEDDomain = {
  ted_id: string;
  uniprot_acc: string;
  consensus_level: string;
  chopping: string;
  cath_label: string;
};
type TEDPayload = {
  data: Array<TEDDomain>;
};
