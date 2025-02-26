import React, { PropsWithChildren, useState, useEffect } from 'react';
import { addConfidenceTrack } from 'components/Structure/ViewerAndEntries/ProteinViewerForAlphafold';
import loadable from 'higherOrder/loadable';
import {
  groupByEntryType,
  sectionsReorganization,
  proteinViewerReorganization,
  dbToSection,
} from 'components/Related/DomainsOnProtein/utils';

import {
  ExtendedFeature,
  ExtendedFeatureLocation,
} from 'components/ProteinViewer/utils';

import { ProteinsAPIVariation } from '@nightingale-elements/nightingale-variation/dist/proteinAPI';
import {
  UNDERSCORE,
  byEntryType,
  sortTracks,
  standardizeMobiDBFeatureStructure,
} from './utils';

import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { changeSettingsRaw } from 'actions/creators';
import { mergeMatches } from './utils';
import { EntryColorMode } from 'utils/entry-color';

const ProteinViewer = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
  loading: null,
});

type tracksProps = {
  interpro: Array<{ accession: string; type: string }>;
  unintegrated: Array<MinimalFeature>;
  other?: Array<MinimalFeature>;
  representativeDomains?: Array<MinimalFeature>;
  representativeFamilies?: Array<MinimalFeature>;
  disorderedRegions?: Array<MinimalFeature>;
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
  let mergedData: ProteinViewerDataObject<MinimalFeature> = groups;

  mergedData = sectionsReorganization(mergedData);

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
  dataInterProNMatches?: RequestedData<InterProNMatches>;
  dataProteomics?: RequestedData<ProteinsAPIProteomics>;
  dataFeatures?: RequestedData<ExtraFeaturesPayload>;
  dataInterproNMatches?: RequestedData<InterProNMatches>;
  conservationError?: string | null;
  showConservationButton?: boolean;
  handleConservationLoad?: () => void;
  loading: boolean;
  title?: string;
  colorDomainsBy?: string;
  matchTypeSettings?: MatchTypeUISettings;
  changeSettingsRaw: typeof changeSettingsRaw;
}>;

const chooseColor = (color: string) => {
  return Object.values(EntryColorMode).find((c) => c !== color) || '';
};

const DomainsOnProteinLoaded = ({
  mainData,
  dataMerged,
  dataConfidence,
  dataVariation,
  dataProteomics,
  dataFeatures,
  dataInterProNMatches,
  conservationError,
  showConservationButton,
  handleConservationLoad,
  loading,
  children,
  title = 'Entry matches to this protein',
  colorDomainsBy,
  matchTypeSettings,
  changeSettingsRaw,
}: Props) => {
  const [currentMatchType, setCurrentMatchType] = useState(matchTypeSettings);

  useEffect(() => {
    if (currentMatchType !== matchTypeSettings) {
      setCurrentMatchType(matchTypeSettings);
      if (colorDomainsBy) {
        // Properly type the Promise
        const applyFirstChange = () => {
          return new Promise<void>((resolve) => {
            changeSettingsRaw(
              'ui',
              'colorDomainsBy',
              chooseColor(colorDomainsBy),
            );
            requestAnimationFrame(() => resolve());
          });
        };

        applyFirstChange().then(() => {
          changeSettingsRaw('ui', 'colorDomainsBy', colorDomainsBy);
        });
      }
    }
  }, [matchTypeSettings]);

  const protein =
    (mainData as ProteinEntryPayload).metadata ||
    (mainData as { payload: ProteinEntryPayload }).payload.metadata;

  // Create a deep copy of dataMerged to avoid mutating props
  let processedDataMerged = JSON.parse(JSON.stringify(dataMerged));

  let flattenedData = undefined;

  if (dataConfidence)
    addConfidenceTrack(dataConfidence, protein.accession, processedDataMerged);

  if (
    dataInterProNMatches &&
    !dataInterProNMatches.loading &&
    dataInterProNMatches.payload
  ) {
    const interProNData = dataInterProNMatches.payload;
    const tracks = Object.keys(processedDataMerged);

    if (matchTypeSettings && colorDomainsBy) {
      tracks.forEach((track) => {
        const traditionalMatches = JSON.parse(
          JSON.stringify(processedDataMerged[track]),
        ) as MinimalFeature[];

        // Instead of modifying the original, assign to our copy
        processedDataMerged[track] = mergeMatches(
          track,
          traditionalMatches,
          interProNData,
          matchTypeSettings,
          colorDomainsBy,
        );
      });

      // Reorganize sections and sort added matches - still on our copy
      processedDataMerged = sectionsReorganization(processedDataMerged);

      // Sort data by match position, but exclude residues and PIRSR
      Object.entries(
        processedDataMerged as ProteinViewerDataObject<ExtendedFeature>,
      ).forEach(([key, group]) => {
        if (key !== 'residues') {
          processedDataMerged[key] = group.sort(sortTracks).flat();
        }
      });
    }
  }

  if (dataVariation?.ok && dataVariation.payload) {
    const filteredVariationPayload = filterVariation(dataVariation.payload);
    if (filteredVariationPayload.features.length > 0)
      addVariationTrack(
        filteredVariationPayload,
        protein.accession,
        processedDataMerged,
      );
  }

  if (dataProteomics?.ok && dataProteomics.payload) {
    if (dataProteomics.payload.features.length > 0) {
      addPTMTrack(
        dataProteomics.payload,
        protein.accession,
        processedDataMerged,
      );
    }
  }

  /* Results coming from InterProScan logic */
  if (protein.accession.startsWith('iprscan')) {
    // Use processedDataMerged instead of dataMerged in all operations

    let proteinViewerData = proteinViewerReorganization(
      dataFeatures,
      processedDataMerged as ProteinViewerDataObject<MinimalFeature>,
    );
    proteinViewerData = sectionsReorganization(proteinViewerData);

    // Create PTM section
    if (dataMerged['intrinsically_disordered_regions']) {
      dataMerged['intrinsically_disordered_regions'] =
        standardizeMobiDBFeatureStructure(
          dataMerged['intrinsically_disordered_regions'] as ExtendedFeature[],
        );
    }

    // Move entries from unintegrated section to the correct one
    const accessionsToRemoveFromUnintegrated: string[] = [];
    if (dataMerged['unintegrated']) {
      for (let i = 0; i < dataMerged['unintegrated'].length; i++) {
        const unintegratedEntry = {
          ...(dataMerged['unintegrated'][i] as ExtendedFeature),
        };
        const sourcedb = unintegratedEntry.source_database;
        if (sourcedb && Object.keys(dbToSection).includes(sourcedb)) {
          if (dataMerged[dbToSection[sourcedb]]) {
            const previousSectionData = [
              ...(dataMerged[dbToSection[sourcedb]] as ExtendedFeature[]),
            ];
            previousSectionData.push(unintegratedEntry);
            dataMerged[dbToSection[sourcedb]] = [...previousSectionData];
            accessionsToRemoveFromUnintegrated.push(
              unintegratedEntry.accession,
            );
          }
        }
      }
      const filteredUnintegrated = (
        dataMerged['unintegrated'] as ExtendedFeature[]
      ).filter(
        (entry) =>
          !accessionsToRemoveFromUnintegrated.includes(entry.accession),
      );
      dataMerged['unintegrated'] = [...filteredUnintegrated];
    }

    Object.entries(
      proteinViewerData as ProteinViewerDataObject<ExtendedFeature>,
    ).forEach(([key, group]) => {
      if (key !== 'residues') {
        proteinViewerData[key] = group.sort(sortTracks).flat();
      }
    });

    proteinViewerData['other_features'] = [];
    flattenedData = flattenTracksObject(proteinViewerData);

    // Add representative data
    const representativeTracks: string[] = [
      'representative_domains',
      'representative_families',
    ];
    const representativeToSection: Record<string, string> = {
      representative_domains: 'domain',
      representative_families: 'family',
    };

    representativeTracks.forEach((track) => {
      if (processedDataMerged[track]) {
        (processedDataMerged[track] as ExtendedFeature[]).forEach((entry) => {
          entry.representative = true;
        });
        processedDataMerged[representativeToSection[track]] =
          processedDataMerged[representativeToSection[track]].concat(
            processedDataMerged[track],
          );

        processedDataMerged[track] = [];
      }
    });
  } else {
    flattenedData = flattenTracksObject(processedDataMerged);
  }

  return (
    <>
      <ProteinViewer
        protein={protein}
        data={flattenedData}
        title={title}
        showConservationButton={showConservationButton}
        handleConservationLoad={handleConservationLoad}
        conservationError={conservationError}
        loading={loading}
      >
        {children}
      </ProteinViewer>
    </>
  );
};

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

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui) => ({
    showMoreSettings: ui.showMoreSettings,
    colorDomainsBy: ui.colorDomainsBy,
    matchTypeSettings: ui.matchTypeSettings,
  }),
);

export default connect(mapStateToProps, { changeSettingsRaw })(
  DomainsOnProteinLoaded,
);
