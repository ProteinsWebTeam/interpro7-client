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
  wikipedia: Array<WikipediaEntry>;
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

type MinimalFeature = {
  accession: string;
  source_database?: string;
  name?: string;
  protein_length?: number;
  locations?: Array<ProtVistaLocation>;
  children?: Array<{ accession: string; source_database: string }>;
  member_databases?: Record<string, unknown>;
};

type MatchI = {
  accession: string;
};

type EndpointWithMatchesPayload<Meta = Metadata, Match = MatchI> = {
  metadata: Meta;
  extra_fields?: Record<string, unknown>;
} & {
  [matches: string]: Array<Match>;
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
interface EntrySetMatch extends MatchI {
  entry_accession?: string;
}

type AnyMatch = Partial<EntryProteinMatch> &
  Partial<EntryStructureMatch> &
  Partial<StructureProteinMatch> &
  Partial<EntrySetMatch>;

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

type ExtraFeaturesPayload = Record<
  string,
  {
    accession: string;
    source_database: string;
    locations: Array<ProtVistaLocation>;
  }
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

type UtilsAccessionPayload = {
  endpoint: string;
  source_database: string;
  accession?: string;
  proteins?: Array<{
    accession: string;
    organism: string;
    tax_id: string;
  }>;
};

type ErrorPayload = {
  detail: string;
};
