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
  'interproscan-version': string;
  results: Array<Iprscan5Result>;
};

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
