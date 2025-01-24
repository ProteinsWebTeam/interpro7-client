import React, { PropsWithChildren } from 'react';
import { addConfidenceTrack } from 'components/Structure/ViewerAndEntries/ProteinViewerForAlphafold';
import loadable from 'higherOrder/loadable';
import {
  groupByEntryType,
  sectionsReorganization,
} from 'components/Related/DomainsOnProtein';
import { ProteinsAPIVariation } from '@nightingale-elements/nightingale-variation/dist/proteinAPI';
import {
  ExtendedFeature,
  ExtendedFeatureLocation,
} from 'components/ProteinViewer';
import { proteinViewerReorganization } from 'components/Related/DomainsOnProtein';
import { FeatureLocation } from 'node_modules/@nightingale-elements/nightingale-track/dist';

const ProteinViewer = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
  loading: null,
});

// 0A017SEX7 is a good example
const UNDERSCORE = /_/g;

const FIRST_IN_ORDER = [
  'alphafold_confidence',
  'secondary_structure',
  'families',
  'family',
  'domains',
  'domain',
  'intrinsically_disordered_regions',
  'conserved_site',
  'conserved_residues',
  'spurious_proteins',
  'pathogenic_and_likely_pathogenic_variants',
  'repeat',
  'active_site',
  'binding_site',
  'ptm',
];

const LASTS_IN_ORDER = [
  'coiled-coils,_signal_peptides,_transmembrane_regions',
  'short_linear_motifs',
  'pfam-n',
  'funfam',
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

function getBoundaries(item: ExtendedFeature | ExtendedFeature[]) {
  let fragment = undefined;
  let accession = undefined;

  if (Array.isArray(item)) {
    if (item[0].entry_protein_locations)
      fragment = item[0].entry_protein_locations?.[0].fragments?.[0];
    else fragment = item[0].locations?.[0].fragments?.[0];
    accession = item[0].accession;
  } else {
    if (item.entry_protein_locations)
      fragment = item.entry_protein_locations?.[0].fragments?.[0];
    else fragment = item.locations?.[0].fragments?.[0];
    accession = item.accession;
  }
  if (fragment && accession) {
    return [accession, fragment.start, fragment.end];
  }
  return [0, 0];
}

export function sortTracks(
  a: ExtendedFeature | ExtendedFeature[],
  b: ExtendedFeature | ExtendedFeature[],
) {
  const [aAccession, aStart, aEnd] = getBoundaries(a);
  const [bAccession, bStart, bEnd] = getBoundaries(b);

  if (aStart > bStart) return 1;
  if (aStart < bStart) return -1;
  if (aStart === bStart) {
    if (aEnd < bEnd) return 1;
    if (aEnd > bEnd) return -1;
    if (aEnd === bEnd) {
      if (aAccession > bAccession) return 1;
      else return -1;
    }
  }
  return 0;
}

const standardizeResidueStructure = (
  residues: Array<ExtendedFeature>,
): Array<ExtendedFeature> => {
  const newResidues: Array<ExtendedFeature> = [];
  residues.map((residueParentObj) => {
    const tempResidue: ExtendedFeature = residueParentObj;
    tempResidue.type = 'residue';
    tempResidue.locations = residueParentObj.residues?.[0].locations;
    newResidues.push(tempResidue);
  });
  return newResidues;
};

const standardizeMobiDBFeatureStructure = (
  features: Array<ExtendedFeature>,
): Array<ExtendedFeature> => {
  const newFeatures: Array<ExtendedFeature> = [];
  features.map((feature) => {
    const tempFeature = { ...feature };
    const slicedTempFeatureLocations: Array<ExtendedFeatureLocation> = [];
    tempFeature.accession = 'Mobidblt-Consensus Disorder Prediction';
    tempFeature.source_database = 'mobidblt';
    tempFeature.protein = '';
    tempFeature.locations?.map(
      (
        location: ExtendedFeatureLocation & {
          'sequence-feature'?: string;
          start?: number;
          end?: number;
        },
        idx: number,
      ) => {
        if (
          location['sequence-feature'] &&
          location['sequence-feature'] !== ''
        ) {
          if (location.start && location.end) {
            const restructuredLocation: ExtendedFeatureLocation[] = [
              {
                fragments: [
                  {
                    start: location.start,
                    end: location.end,
                    seq_feature: location['sequence-feature'],
                  },
                ],
              },
            ];

            const tempChild: ExtendedFeature = {
              accession: location['sequence-feature'],
              source_database: 'mobidblt',
              locations: restructuredLocation,
            };
            tempFeature.children?.push(tempChild);
          }
        } else {
          slicedTempFeatureLocations.push(location);
        }
      },
    );
    tempFeature.locations = slicedTempFeatureLocations;
    newFeatures.push(tempFeature);
  });
  return newFeatures;
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
  const groups = groupByEntryType(
    interpro.concat(unintegrated as { accession: string; type: string }[]),
  );

  // Merge domain and families into respective representative ones. Merge homologous superfamily into domains.
  const mergedData: ProteinViewerDataObject<MinimalFeature> = groups;

  sectionsReorganization(mergedData);

  // Add representative data
  if (representativeFamilies?.length)
    mergedData.family = mergedData.family.concat(representativeFamilies);

  if (representativeDomains?.length)
    mergedData.domain = mergedData.domain.concat(representativeDomains);

  if (disorderedRegions?.length)
    mergedData.disorderedRegions = disorderedRegions;

  if (other) mergedData.other_features = other;

  Object.values(mergedData).map((group) => group.sort(sortTracks).flat());

  return mergedData;
};

export const flattenTracksObject = (
  tracksObject: ProteinViewerDataObject,
): ProteinViewerData => {
  return (
    Object.entries(tracksObject)
      .sort(byEntryType)
      // “Binding_site” -> “Binding site”
      .map(([key, value]) => [key.replace(UNDERSCORE, ' '), value])
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
    tracks['pathogenic_and_likely_pathogenic_variants'] = [];
    tracks['pathogenic_and_likely_pathogenic_variants'][0] = {
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
  tracks: ProteinViewerDataObject,
) => {
  if (proteomicsPayload?.features?.length) {
    if (!tracks['ptm']) {
      tracks['ptm'] = [];
    }
    tracks['ptm'].push({
      accession: `ptm_${protein}`,
      data: proteomicsPayload,
      type: 'ptm',
      protein,
      source_database: 'proteinsAPI',
    });
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
  dataFeatures?: RequestedData<ExtraFeaturesPayload>;
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
  dataFeatures,
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

  let mainTracks: string[] = [];
  let hideCategories: Record<string, boolean> = {};
  const renamedTracks = ['domain', 'family', 'residues'];
  let flattenedData = undefined;

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
      addPTMTrack(dataProteomics.payload, protein.accession, dataMerged);
    }
  }

  // Results coming from InterProScan need a different processing pipeline. The data coming in is in a different format
  // and the ProteinViewer components are used in a different way in the InterproScan results section.
  if (protein.accession.startsWith('iprscan')) {
    // What happens in the DomainsOnProtein component for matches coming from elasticsearch is skipped for the
    // InterProScan results section, because the DomainsOnProteinLoaded is used right away.
    // Executing those steps here below. KEEP THIS ORDER OF OPERATIONS

    // Residues' structure needs to change to allow PIRSR grouping and correct display on the PV
    if (dataMerged['conserved_residues']) {
      dataMerged['conserved_residues'] = standardizeResidueStructure(
        dataMerged['conserved_residues'] as ExtendedFeature[],
      );
    }

    proteinViewerReorganization(dataFeatures, dataMerged);
    sectionsReorganization(dataMerged);

    if (dataMerged['intrinsically_disordered_regions']) {
      dataMerged['intrinsically_disordered_regions'] =
        standardizeMobiDBFeatureStructure(
          dataMerged['intrinsically_disordered_regions'] as ExtendedFeature[],
        );
    }

    // Sort data by match position, but exclude PIRSR, which is sorted in proteinViewerReorganization
    Object.entries(dataMerged as ProteinViewerDataObject<ExtendedFeature>).map(
      (group) => {
        if (group[0] !== 'conserved_residues') group[1].sort(sortTracks).flat();
      },
    );

    // Handle MobiDB-lite different format

    flattenedData = flattenTracksObject(dataMerged).filter(
      (track) => !renamedTracks.includes(track[0]),
    );

    const representative_domains = flattenedData.filter(
      (entry) => entry[0] == 'representative domains',
    )[0];

    if (representative_domains) {
      representative_domains[1].map((domain) => {
        if (typeof domain === 'object' && domain !== null) {
          (domain as { representative?: boolean })['representative'] = true;
        }
      });
    }

    flattenedData.map((entry) => {
      if (entry[0] === 'domains') {
        if (representative_domains) {
          entry[1] = entry[1].concat(representative_domains[1]);
        }
      } else if (entry[0] === 'other features') {
        entry[1] = [];
      } else if (entry[0] === 'representative domains') {
        entry[1] = [];
      }
    });
    // End of skipped reorganization steps

    mainTracks = [
      'alphafold confidence',
      'families',
      'domains',
      'pathogenic and likely pathogenic variants',
      'intrinsically disordered regions',
      'spurious proteins',
      'conserved residues',
      'unintegrated',
      'other features',
      'other residues',
    ];

    hideCategories = {
      'secondary structure': false,
      families: false,
      domains: false,
      repeat: false,
      'conserved site': false,
      'active site': false,
      'binding site': false,
      ptm: false,
      'match conservation': false,
      'coiled-coils, signal peptides, transmembrane regions': false,
      'short linear motifs': false,
      'pfam-n': false,
      funfam: false,
    };
  } else {
    
    mainTracks = [
      'alphafold confidence',
      'families',
      'domains',
      'pathogenic and likely pathogenic variants',
      'intrinsically disordered regions',
      'spurious proteins',
      'conserved residues',
    ];

    hideCategories = {
      'secondary structure': false,
      families: true,
      domains: true,
      repeat: false,
      'conserved site': false,
      'active site': false,
      'binding site': false,
      ptm: false,
      'match conservation': false,
      'coiled-coils, signal peptides, transmembrane regions': false,
      'short linear motifs': false,
      'pfam-n': false,
      funfam: false,
    };

    flattenedData = flattenTracksObject(dataMerged).filter(
      (track) => !renamedTracks.includes(track[0]),
    );
  }

  return (
    <>
      <ProteinViewer
        protein={protein}
        data={flattenedData}
        title={title}
        show
        ervationButton={showConservationButton}
        handleConservationLoad={handleConservationLoad}
        conservationError={conservationError}
        loading={loading}
        mainTracks={mainTracks}
        hideCategories={hideCategories}
      >
        {children}
      </ProteinViewer>
    </>
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
