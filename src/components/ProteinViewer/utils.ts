import { useMemo } from 'react';
import { toPlural } from 'utils/pages/toPlural';
import { NOT_MEMBER_DBS } from 'menuConfig';
import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import {
  Feature,
  FeatureLocation,
} from 'node_modules/@nightingale-elements/nightingale-track/dist';

export type Residue = {
  locations: Array<
    FeatureLocation & {
      accession: string;
      description: string;
    }
  >;
};

export type ExtendedFeatureLocation = {
  fragments: Array<{
    start: number;
    end: number;
    [annotation: string]: unknown;
  }>;
} & {
  representative?: boolean;
  confidence?: number;
  description?: string;
  seq_feature?: string;
  color?: string;
};

export type ExtendedFeature = Feature & {
  data?: unknown;
  representative?: boolean;
  entry_protein_locations?: Array<ExtendedFeatureLocation>;
  locations?: Array<ExtendedFeatureLocation>;
  name?: string;
  short_name?: string;
  source_database?: string;
  entry_type?: string;
  residues?: Array<Residue>;
  location2residue?: unknown;
  chain?: string;
  protein?: string;
  integrated?: string;
  children?: Array<ExtendedFeature>;
  warnings?: Array<string>;
};

export const typeNameToSectionName: Record<string, string> = {
  'bfvd confidence': 'BFVD Confidence',
  'alphafold confidence': 'AlphaFold Confidence',
  family: 'Families',
  domain: 'Domains',
  'pathogenic and likely pathogenic variants':
    'Pathogenic and Likely Pathogenic Variants',
  'intrinsically disordered regions': 'Intrinsically Disordered Regions',
  'spurious proteins': 'Spurious Proteins',
  residues: 'Conserved Residues',
  unintegrated: 'Unintegrated',
  'conserved site': 'Conserved Site',
  'active site': 'Active Site',
  'binding site': 'Binding Site',
  PTM: 'Post-translational Modifications',
  ptm: 'Post-translational Modifications',
  'match conservation': 'Match Conservation',
  'coiled-coils, signal peptides, transmembrane regions':
    'Coiled-coils, Signal Peptides and Transmembrane Regions',
  'short linear motifs': 'Short Linear Motifs',
  'pfam-n': 'Pfam-N',
  funfam: 'FunFam',
  'cath-funfam': 'FunFam',
  'external sources': 'External Sources',
  'secondary structure': 'Secondary Structure',
};

export const firstHideCategories = {
  'secondary structure': false,
  family: false,
  domain: false,
  repeat: false,
  'conserved site': false,
  residues: false,
  'active site': false,
  'binding site': false,
  ptm: false,
  'match conservation': false,
  'coiled-coils, signal peptides, transmembrane regions': false,
  'short linear motifs': false,
  'pfam-n': false,
  funfam: false,
};

export type PTM = {
  position: number;
  name: string;
  sources: string[];
};

export type PTMFeature = {
  begin: string;
  end: string;
  peptide: string;
  ptms: PTM[];
};

export type PTMData = {
  accession: string;
  features: PTMFeature[];
};

export type PTMFragment = {
  [annotation: string]: unknown;
  start: number;
  end: number;
};

export const selectRepresentativeData = (
  entries: Record<string, unknown>[],
  locationKey: string,
  type: string,
) => {
  const flatRepresentativeData = [];
  const types =
    type === 'domain'
      ? ['domain', 'repeat', 'homologous_superfamily']
      : ['family'];
  for (const entry of entries) {
    const {
      accession,
      short_name,
      name,
      source_database,
      integrated,
      chain,
      children,
    } = entry;

    if (entry[locationKey] === null || !types.includes(entry.type as string)) {
      continue;
    }
    for (const location of entry[locationKey] as Array<ProtVistaLocation>) {
      for (const fragment of location.fragments) {
        const { start, end } = fragment;
        const representative = location.representative;
        if (location.representative) {
          flatRepresentativeData.push({
            accession,
            chain,
            short_name,
            name,
            source_database,
            integrated,
            representative,
            start,
            end,
            color: getTrackColor({ source_database }, EntryColorMode.MEMBER_DB),
            length: end - start + 1,
          });
        }
      }
    }
  }

  return flatRepresentativeData;
};

export const useProcessData = <M = Metadata>(
  results: EndpointWithMatchesPayload<M, MatchI>[] | undefined,
  endpoint: Endpoint,
) =>
  useMemo(() => {
    return processData(results || [], endpoint);
  }, [results, endpoint]);

const processData = <M = Metadata>(
  dataResults: EndpointWithMatchesPayload<M>[],
  endpoint: Endpoint,
) => {
  const results: Record<string, unknown>[] = [];

  for (const item of dataResults) {
    results.splice(
      0,
      0,
      ...item[toPlural(endpoint)].map((match) => {
        const structureAccession = item.structures?.[0]['accession'];
        return {
          structureAccession,
          ...match,
          ...item.metadata,
          ...(item.extra_fields || {}),
        };
      }),
    );
  }

  const interpro = results.filter(
    (entry) =>
      (entry as unknown as Metadata).source_database.toLowerCase() ===
      'interpro',
  );

  const interproMap = new Map();

  interpro.map((ipro) => {
    const integratedUnder = Object.values(ipro.member_databases as {})
      .map((entryDict) => Object.keys(entryDict as object))
      .flat();

    const interproK = integratedUnder.map((entryAccession) => {
      return `${ipro.accession}-${entryAccession}-${ipro.chain}-${
        endpoint === 'structure' ? ipro.structureAccession : ''
      }`;
    });
    interproK.map((k) => {
      interproMap.set(k, ipro);
    });
  });

  const locationKey =
    endpoint === 'structure'
      ? 'entry_structure_locations'
      : 'entry_protein_locations';

  const representativeData = {
    domain: selectRepresentativeData(results, locationKey, 'domain'),
    family: selectRepresentativeData(results, locationKey, 'family'),
  };

  const representativeDomains = representativeData['domain'];
  const representativeFamilies = representativeData['family'];

  const integrated = results.filter((entry) => entry.integrated);

  const unintegrated = results.filter(
    (entry) =>
      interpro.concat(integrated).indexOf(entry) === -1 &&
      !NOT_MEMBER_DBS.has(
        (entry as unknown as Metadata).source_database.toLowerCase(),
      ),
  );

  integrated.forEach((entry) => {
    const ipro: Record<string, unknown> & {
      children?: Array<Record<string, unknown>>;
    } =
      interproMap.get(
        `${entry.integrated}-${entry.accession}-${entry.chain}-${
          endpoint === 'structure' ? entry.structureAccession : ''
        }`,
      ) || {};

    if (!ipro.children) ipro.children = [];
    if (ipro.children.indexOf(entry) === -1) ipro.children.push(entry);
  });

  integrated.sort((a, b) =>
    a.chain ? (a.chain as string).localeCompare(b.chain as string) : -1,
  );

  return {
    interpro,
    unintegrated,
    representativeDomains,
    representativeFamilies,
    other: [],
  };
};

export const ptmFeaturesFragments = (features: PTMFeature[]): PTMFragment[] => {
  const ptmFragments: PTMFragment[] = [];

  features.map((feature) => {
    feature.ptms.map((ptm) => {
      const ptmFragment: PTMFragment = {
        start: parseInt(feature.begin) + ptm.position - 1, // Absolute modification pos
        end: parseInt(feature.begin) + ptm.position - 1, // Absolute modification pos
        relative_pos: ptm.position - 1,
        ptm_type: ptm.name,
        peptide: feature.peptide,
        peptide_start: parseInt(feature.begin),
        peptide_end: parseInt(feature.end),
        source: ptm.sources.join(', '),
      };

      ptmFragments.push(ptmFragment);
    });
  });
  return ptmFragments;
};

export const standardizePTMData = (
  entries: ExtendedFeature[],
  protein: { accession: string },
): ExtendedFeature[] => {
  const ptmFragmentsGroupedByModification: {
    [type: string]: PTMFragment[];
  } = {};

  // PTMs coming from APIs
  entries
    .filter((entry) => entry.source_database === 'proteinsAPI')
    .map((entry) => {
      const fragments = ptmFeaturesFragments((entry.data as PTMData).features);
      fragments.map((fragment) => {
        if (ptmFragmentsGroupedByModification[fragment.ptm_type as string]) {
          ptmFragmentsGroupedByModification[fragment.ptm_type as string].push(
            fragment,
          );
        } else {
          ptmFragmentsGroupedByModification[fragment.ptm_type as string] = [
            fragment,
          ];
        }
      });
    });

  const ptmsEntriesGroupedByModification: ExtendedFeature[] = [];
  Object.entries(ptmFragmentsGroupedByModification).map((ptmData) => {
    const modificationType: string = ptmData[0]; // Key
    const fragments: PTMFragment[] = ptmData[1]; // Key
    const newFeature: ExtendedFeature = {
      accession: protein.accession,
      name: modificationType,
      type: 'ptm',
      source_database: 'ptm',
      locations: [{ fragments: fragments }],
    };

    ptmsEntriesGroupedByModification.push(newFeature);
  });

  // PTMs coming from InterPro and external API should be in the same section but require different processing due to different structure (see above)
  entries = ptmsEntriesGroupedByModification.concat(
    entries.filter((entry) => entry.source_database === 'interpro'),
  );

  return [...entries];
};
