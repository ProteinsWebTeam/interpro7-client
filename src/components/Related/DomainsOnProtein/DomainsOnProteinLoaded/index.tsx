import React, { PropsWithChildren, useState, useEffect } from 'react';
import { addConfidenceTrack } from 'components/Structure/ViewerAndEntries/ProteinViewerForPredictedStructure';
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
  standardizeResidueStructure,
  moveExternalFeatures,
} from './utils';

import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { changeSettingsRaw } from 'actions/creators';
import { mergeMatches } from './utils';
import { EntryColorMode } from 'utils/entry-color';
import Callout from 'components/SimpleCommonComponents/Callout';
import Link from 'components/generic/Link';
import config from 'config';

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
  conservationError?: string | null;
  showConservationButton?: boolean;
  handleConservationLoad?: () => void;
  loading: boolean;
  title?: string;
  colorDomainsBy?: string;
  matchTypeSettings?: MatchTypeUISettings;
  matchesAvailable?: Record<string, boolean>;
  changeSettingsRaw: typeof changeSettingsRaw;
}>;

export const chooseColor = (color: string) => {
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
  matchesAvailable,
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

  let interpro_NMatchesCount = 0;
  if (
    dataInterProNMatches &&
    !dataInterProNMatches.loading &&
    dataInterProNMatches.payload
  ) {
    interpro_NMatchesCount = Object.entries(
      dataInterProNMatches?.payload,
    ).length;
    const interProNData = dataInterProNMatches.payload;
    const allTracks = Object.keys(processedDataMerged);
    const unaffectedTracks = [
      'alphafold_confidence',
      'intrinsically_disordered_regions',
      'funfam',
      'cath-funfam',
      'residues',
      'ptm',
      'coiled-coils,_signal_peptides,_transmembrane_regions',
      'short_linear_motifs',
      'spurious_proteins',
      'active_site',
      'external_sources',
    ];

    if (matchTypeSettings && colorDomainsBy) {
      if (matchTypeSettings !== 'hmm') {
        unaffectedTracks.push('repeat');
      }

      const tracksToProcess = allTracks.filter(
        (track) => !unaffectedTracks.includes(track),
      );

      tracksToProcess.forEach((track) => {
        const traditionalMatches = processedDataMerged[track];

        // Instead of modifying the original, assign to our copy
        processedDataMerged[track] = mergeMatches(
          track,
          traditionalMatches,
          interProNData,
          matchTypeSettings,
        );
      });
    }
  }

  if (processedDataMerged['external_sources']) {
    moveExternalFeatures(processedDataMerged);
  }

  // Reorganize sections and sort added matches
  processedDataMerged = sectionsReorganization(processedDataMerged);

  // Sort data by match position, but exclude residues and PIRSR
  Object.entries(
    processedDataMerged as ProteinViewerDataObject<ExtendedFeature>,
  ).forEach(([key, group]) => {
    if (key !== 'residues') {
      processedDataMerged[key] = group.sort(sortTracks).flat();
    }
  });

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

  if (
    protein.accession.startsWith('iprscan') ||
    protein.accession.startsWith('imported_file')
  ) {
    /*
    Results coming from InterProScan need a different processing pipeline. The data coming in is in a different format
    and the ProteinViewer components are used in a different way in the InterproScan results section.
    What happens in the DomainsOnProtein component for matches coming from elasticsearch is skipped for the
    InterProScan results section, because the DomainsOnProteinLoaded is used right away.
    Executing those steps here below.
    KEEP THIS ORDER OF OPERATIONS !
    */

    // Move entries from unintegrated section to the correct one
    const accessionsToRemoveFromUnintegrated: string[] = [];
    if (processedDataMerged['unintegrated']) {
      for (let i = 0; i < processedDataMerged['unintegrated'].length; i++) {
        const unintegratedEntry = {
          ...(processedDataMerged['unintegrated'][i] as ExtendedFeature),
        };

        let dbSection: string = '';
        const sourcedb = unintegratedEntry.source_database;
        if (sourcedb && Object.keys(dbToSection).includes(sourcedb)) {
          dbSection = dbToSection[sourcedb];
        }

        const sectionKey: string =
          unintegratedEntry.type?.toLowerCase() || dbSection;

        if (processedDataMerged[sectionKey]) {
          const previousSectionData = [
            ...(processedDataMerged[sectionKey] as ExtendedFeature[]),
          ];
          previousSectionData.push(unintegratedEntry);
          processedDataMerged[sectionKey] = [...previousSectionData];
          accessionsToRemoveFromUnintegrated.push(unintegratedEntry.accession);
        } else {
          const newData: ExtendedFeature[] = [];
          newData.push(unintegratedEntry);
          processedDataMerged[sectionKey] = [...newData];
          accessionsToRemoveFromUnintegrated.push(unintegratedEntry.accession);
        }
      }

      const filteredUnintegrated = (
        processedDataMerged['unintegrated'] as ExtendedFeature[]
      ).filter(
        (entry) =>
          !accessionsToRemoveFromUnintegrated.includes(entry.accession),
      );
      processedDataMerged['unintegrated'] = [...filteredUnintegrated];
    }

    // Reorganize viewer and sections
    let proteinViewerData = proteinViewerReorganization(
      dataFeatures,
      processedDataMerged as ProteinViewerDataObject<MinimalFeature>,
      true,
    );

    // Residues' structure needs to change to allow PIRSR grouping and correct display on the PV
    if (proteinViewerData['residues']) {
      proteinViewerData['residues'] = standardizeResidueStructure(
        proteinViewerData['residues'] as ExtendedFeature[],
      );
    }

    proteinViewerData = sectionsReorganization(proteinViewerData);

    if (proteinViewerData['intrinsically_disordered_regions']) {
      proteinViewerData['intrinsically_disordered_regions'] =
        standardizeMobiDBFeatureStructure(
          proteinViewerData[
            'intrinsically_disordered_regions'
          ] as ExtendedFeature[],
        );
    }

    // Sort data by match position, but exclude PIRSR, which is sorted in proteinViewerReorganization
    Object.entries(
      proteinViewerData as ProteinViewerDataObject<ExtendedFeature>,
    ).map((group) => {
      if (group[0] !== 'residues') group[1].sort(sortTracks);
    });

    // All the other features have been moved to dedicated sections now
    proteinViewerData['other_features'] = [];

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
      if (proteinViewerData[track]) {
        (proteinViewerData[track] as ExtendedFeature[]).forEach((entry) => {
          entry.representative = true;
        });
        proteinViewerData[representativeToSection[track]] = proteinViewerData[
          representativeToSection[track]
        ].concat(proteinViewerData[track]);
        proteinViewerData[track] = [];
      }
    });

    // Flatten data to be processed by ProteinViewer
    flattenedData = flattenTracksObject(proteinViewerData);
  } else {
    flattenedData = flattenTracksObject(processedDataMerged);
  }

  return (
    <>
      {interpro_NMatchesCount > 0 && (
        <>
          <Callout type="warning" alt={false} closable={true}>
            This sequence includes additional matches predicted by ✨
            <b>InterPro‑N</b>, an AI-powered deep learning model developed by
            Google DeepMind.
            <br />
            By default, InterPro matches are supplemented with novel InterPro‑N
            predictions (novel matches or those at least 5% longer).
            <br />
            To change the display mode, open the <i>Options</i> menu below and
            select your preferred setting. See{' '}
            <Link
              href={`${config.root.readthedocs.href}protein_viewer.html#interpro-n-display-modes`}
              target="_blank"
            >
              our documentation
            </Link>{' '}
            for an explanation of each display mode.
          </Callout>
        </>
      )}
      <ProteinViewer
        protein={protein}
        data={flattenedData}
        title={title}
        matchesAvailable={matchesAvailable}
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
