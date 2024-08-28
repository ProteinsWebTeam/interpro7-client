import React, { PropsWithChildren } from 'react';
import { addConfidenceTrack } from 'components/Structure/ViewerAndEntries/ProteinViewerForAlphafold';
import loadable from 'higherOrder/loadable';
import { groupByEntryType } from 'components/Related/DomainsOnProtein';
import { ProteinsAPIVariation } from '@nightingale-elements/nightingale-variation/dist/proteinAPI';
import { ExtendedFeature } from 'components/ProteinViewer';

const ProteinViewer = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
  loading: null,
});

// 0A017SEX7 is a good example
const UNDERSCORE = /_/g;

const FIRST_IN_ORDER = [
  'alphafold_confidence',
  'representative_domains',
  'representative_families',
  'pathogenic_variants',
  'disordered_regions',
  'residues',
];

const LASTS_IN_ORDER = [
  'family',
  'secondary_structure',
  'domain',
  'homologous_superfamily',
  'repeat',
  'conserved_site',
  'active_site',
  'binding_site',
  'ptm',
  'unintegrated',
  'other_features',
  'other_residues',
  'features',
  'predictions',
  'match_conservation',
];

export const byEntryType = (
  [a, _]: [string, unknown],
  [b, __]: [string, unknown],
) => {
  for (const label of FIRST_IN_ORDER) {
    if (a.toLowerCase() === label) return -1;
    if (b.toLowerCase() === label) return 1;
  }
  for (const l of LASTS_IN_ORDER) {
    if (a.toLowerCase() === l) return -1;
    if (b.toLowerCase() === l) return 1;
  }
  return a > b ? 1 : 0;
};
type tracksProps = {
  interpro: Array<{ accession: string; type: string }>;
  unintegrated: Array<MinimalFeature>;
  other?: Array<MinimalFeature>;
  representativeDomains?: Array<MinimalFeature>;
  representativeFamilies?: Array<MinimalFeature>;
  disorderedRegions?: Array<MinimalFeature>;
};

function getMatchOrTrackStart(item: ExtendedFeature | ExtendedFeature[]) {
  if (Array.isArray(item)) {
    return item[0].entry_protein_locations?.[0].fragments?.[0].end;
  }
  return item.entry_protein_locations?.[0].fragments?.[0].end;
}

function sortTracksByMatchesPosition(
  a: ExtendedFeature[] | ExtendedFeature,
  b: ExtendedFeature[] | ExtendedFeature,
) {
  const aPos = getMatchOrTrackStart(a);
  const bPos = getMatchOrTrackStart(b);

  if (aPos && bPos) return aPos > bPos ? 1 : -1;
  return 0;
}

const getMemberDBMatches = (
  interpro: Array<MinimalFeature>,
): Array<MinimalFeature> => {
  const dbMatches: Array<MinimalFeature> = [];
  interpro.forEach((entry) => {
    if (entry.children) {
      entry.children.forEach((memberDBMatch) => {
        dbMatches.push(memberDBMatch);
      });
    }
  });
  return dbMatches;
};

export const makeTracks = ({
  interpro,
  unintegrated,
  other,
  representativeDomains,
  representativeFamilies,
  disorderedRegions,
}: tracksProps): ProteinViewerDataObject<MinimalFeature> => {
  /* Logic to highlight matches from member DBs, not InterPro entries
      1. Remove Intepro entries as the "parent" of matches from member DBs.
      2. Merge unintegrated with result from (1.);
      3. Sort matches in tracks based on their position but, if integrated, 
      maintaining grouping for the same InterPro entry.
  */

  // 1. and 2.
  const integratedMatches = getMemberDBMatches(interpro);
  const allMatches = integratedMatches.concat(unintegrated);

  // this was const groups = groupByEntryType(interpro)
  const groups = groupByEntryType(
    allMatches as { accession: string; type: string }[],
  );

  /* 3. 
        Group matches of the same type (e.g domain) by IntePro accession
        sort matches by position within the same group, 
        sort all the groups based on first fragment of group.

        Note: Object.groupBy not available in this TypeScript version, implementing it. 
  */

  Object.keys(groups).map((key) => {
    const uniqueInterproAccessions = [
      ...new Set(groups[key].map((match: ExtendedFeature) => match.integrated)),
    ];
    const allMatchesGroupedByEntry = [];

    for (let i = 0; i < uniqueInterproAccessions.length; i++) {
      const groupedEntry = groups[key].filter(
        (match: ExtendedFeature) =>
          match.integrated == uniqueInterproAccessions[i],
      );

      // Sort non-integrated and those appearing just once for an Interpro accession, independently from the grouped ones
      if (uniqueInterproAccessions[i] === null || groupedEntry.length == 1) {
        groupedEntry.map((entry) => allMatchesGroupedByEntry.push(entry));
      } else {
        allMatchesGroupedByEntry.push(groupedEntry);
      }
    }
    groups[key] = allMatchesGroupedByEntry
      .sort(sortTracksByMatchesPosition)
      .flat();
  });

  const mergedData: ProteinViewerDataObject<MinimalFeature> = groups;

  if (other) mergedData.other_features = other;
  if (representativeDomains?.length)
    mergedData.representative_domains = representativeDomains;
  if (representativeFamilies?.length)
    mergedData.representative_families = representativeFamilies;
  if (disorderedRegions?.length)
    mergedData.disorderedRegions = disorderedRegions;
  return mergedData;
};

export const flattenTracksObject = (
  tracksObject: ProteinViewerDataObject,
): ProteinViewerData => {
  return (
    Object.entries(tracksObject)
      .sort(byEntryType)
      // “Binding_site” -> “Binding site”
      .map(([key, value]) => [
        key === 'ptm' ? 'PTM' : key.replace(UNDERSCORE, ' '),
        value,
      ])
  );
};

/* Processing of the payload needs to be slightly different 
to add tracks to the dataMerged object instead of the dataSorted object */
export const addVariationTrack = (
  variationPayload: ProteinsAPIVariation,
  protein: string,
  tracks: ProteinViewerDataObject,
) => {
  if (variationPayload?.features?.length) {
    tracks['pathogenic_variants'] = [];
    tracks['pathogenic_variants'][0] = {
      accession: `variation_${protein}`,
      data: variationPayload,
      type: 'variation',
      protein,
      source_database: 'proteinsAPI',
    };
  }
};

export const addPTMTrack = (
  proteomicsPayload: ProteinsAPIProteomics,
  protein: string,
  tracks: ProteinViewerData,
) => {
  if (proteomicsPayload?.features?.length) {
    const proteomicsTrack: [string, Array<unknown>] = [
      'PTM Data',
      [
        {
          accession: `ptm_${protein}`,
          data: proteomicsPayload,
          type: 'ptm',
          protein,
          source_database: 'proteinsAPI',
        },
      ],
    ];
    tracks.push(proteomicsTrack);
  }
};

type Props = PropsWithChildren<{
  mainData:
    | {
        metadata: MinimalProteinMetadata;
      }
    | {
        payload: {
          metadata: MinimalProteinMetadata;
        };
      };
  dataMerged: ProteinViewerDataObject;
  dataConfidence?: RequestedData<AlphafoldConfidencePayload>;
  dataVariation?: RequestedData<ProteinsAPIVariation>;
  dataProteomics?: RequestedData<ProteinsAPIProteomics>;
  conservationError?: string | null;
  showConservationButton?: boolean;
  handleConservationLoad?: () => void;
  loading: boolean;
  title?: string;
}>;

const DomainsOnProteinLoaded = ({
  mainData,
  dataMerged,
  dataConfidence,
  dataVariation,
  dataProteomics,
  conservationError,
  showConservationButton,
  handleConservationLoad,
  loading,
  children,
  title = 'Entry matches to this protein',
}: Props) => {
  const protein =
    (mainData as ProteinEntryPayload).metadata ||
    (mainData as { payload: ProteinEntryPayload }).payload.metadata;

  /* 
  Special tracks are now added to the dataMerged object before being sorted based on FIRST_IN_ORDER. 
  Adding the tracks to the dataSorted object, caused the Alphafold track and variants track to be displayed always at the first/last position.
  */
  if (dataConfidence)
    addConfidenceTrack(dataConfidence, protein.accession, dataMerged);

  if (dataVariation?.ok && dataVariation.payload) {
    const filteredVariationPayload = filterVariation(dataVariation.payload);
    if (filteredVariationPayload.features.length > 0)
      addVariationTrack(
        filteredVariationPayload,
        protein.accession,
        dataMerged,
      );
  }

  if (dataProteomics?.ok && dataProteomics.payload) {
    if (dataProteomics.payload.features.length > 0) {
      /*addPTMTrack(dataProteomics.payload, protein.accession, sortedData);*/
    }
  }

  // Sort all the tracks, including the special ones (eg. alphafold, variants)
  const sortedData = flattenTracksObject(dataMerged);

  return (
    <ProteinViewer
      protein={protein}
      data={sortedData}
      title={title}
      show
      ervationButton={showConservationButton}
      handleConservationLoad={handleConservationLoad}
      conservationError={conservationError}
      loading={loading}
    >
      {children}
    </ProteinViewer>
  );
};

export default DomainsOnProteinLoaded;
function filterVariation(payload: ProteinsAPIVariation): ProteinsAPIVariation {
  const types = ['pathogenic', 'likely pathogenic'];
  const features = payload.features.filter(
    (f) =>
      (f?.clinicalSignificances || []).filter((cs) =>
        types.includes((cs?.type || '').toLowerCase()),
      ).length > 0,
    // Next line is the filter I think UniProt uses, which yields different results than the one above
    // (f) => (f?.association || []).filter((a) => a.disease).length > 0,
  );
  return {
    ...payload,
    features,
  };
}
