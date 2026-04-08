import React, { useRef, useEffect, useState } from 'react';

import loadData from 'higherOrder/loadData/ts';
import loadable from 'higherOrder/loadable';
import { createSelector } from 'reselect';

import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { useProcessData } from 'components/ProteinViewer/utils';
import {
  getAlphaFoldPredictionURL,
  getConfidenceURLFromPayload,
} from 'components/Structure3DModel/selectors';
import { Selection } from 'components/Structure/ViewerAndEntries';
import {
  moveExternalFeatures,
  sortTracks,
} from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded/utils';

import Loading from 'components/SimpleCommonComponents/Loading';
import { mergeMatches } from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded/utils';

import {
  flattenTracksObject,
  makeTracks,
} from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';

import { sectionsReorganization } from 'components/Related/DomainsOnProtein/utils';
import { getTEDURL } from 'components/Related/DomainsOnProtein/ExternalSourcesHOC';
import formatTED from 'components/Related/DomainsOnProtein/ExternalSourcesHOC/TED';
import Callout from 'components/SimpleCommonComponents/Callout';
import { features } from 'process';
import { getTrackColor } from 'utils/entry-color';
import Link from 'components/generic/Link';
import config from 'config';

const ProteinViewer = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
  loading: null,
});

export const mapBFactorsToCategories = (bFactors: number[]): string => {
  // Map B-factor values to letters
  return bFactors
    .map((bFactor) => {
      if (bFactor <= 0) {
        return 'N';
      } else if (bFactor <= 50) {
        return 'D'; // First color range (255, 125, 69)
      } else if (bFactor <= 70) {
        return 'L'; // Second color range (255, 219, 19)
      } else if (bFactor <= 90) {
        return 'M'; // Third color range (101, 203, 243)
      } else {
        return 'H'; // Fourth color range (0, 83, 214)
      }
    })
    .join('');
};

/* Processing of the payload needs to be slightly different
to add tracks to the groups object instead of the dataSorted object */
export const addConfidenceTrack = (
  dataConfidence: RequestedData<AlphafoldConfidencePayload>,
  protein: string,
  tracks: ProteinViewerDataObject,
  type: string,
) => {
  const scoreToCategory = (score: number): string => {
    if (score <= 50) return 'D';
    else if (score <= 70) return 'L';
    else if (score <= 90) return 'M';
    else return 'H';
  };

  let confidenceCategories: string[] = [];

  if (type === 'alphafold' && dataConfidence?.payload?.confidenceScore) {
    let scores = dataConfidence.payload.confidenceScore;
    const chains = dataConfidence.payload.chains;
    if (chains && chains.length > 1) {
      // For multimers, restrict to the first chain only — both chains map to
      // the same UniProt sequence (sequenceStart/End are identical for homodimers),
      // but residueNumber runs continuously across all chains (1→N*chainLength).
      const firstChain = chains[0];
      const chainLength = firstChain.sequenceEnd - firstChain.sequenceStart + 1;
      scores = scores.slice(0, chainLength);
    }
    confidenceCategories = scores.map(scoreToCategory);
  }

  if (confidenceCategories.length) {
    tracks[`${type}_confidence`] = [];
    tracks[`${type}_confidence`][0] = {
      accession: `confidence_af_${protein}`,
      data: confidenceCategories.join(''),
      type: 'confidence',
      protein,
      source_database: 'alphafold',
    };
  }
};

type Props = {
  protein: string;
  onChangeSelection: (s: Selection[] | null) => void;
  colorBy?: string;
  setColorMap?: (s: Record<number, number>) => void;
  setHasTED: (s: boolean) => void;
  setHasRepresentativeData?: (s: {
    family: boolean | null;
    domain: boolean | null;
  }) => void;
  hasRepresentativeData?: { family: boolean | null; domain: boolean | null };
  isSplitScreen: boolean;
  selectedCifUrl?: string;
  dataInterProNMatches?: Record<string, InterProN_Match>;
  matchTypeSettings?: MatchTypeUISettings;
  colorDomainsBy?: string;
};

interface LoadedProps
  extends Props,
    LoadDataProps<TEDPayload, 'TED'>,
    LoadDataProps<{ metadata: ProteinMetadata }, 'Protein'>,
    LoadDataProps<AlphafoldConfidencePayload, 'Confidence'>,
    LoadDataProps<AlphafoldPayload, 'Prediction'>,
    LoadDataProps<PayloadList<EndpointWithMatchesPayload<EntryMetadata>>> {}
const ProteinViewerForAlphafold = ({
  data,
  protein,
  dataProtein,
  dataInterProNMatches,
  dataConfidence,
  matchTypeSettings,
  colorDomainsBy,
  onChangeSelection,
  setColorMap,
  setHasTED,
  setHasRepresentativeData,
  hasRepresentativeData,
  colorBy,
  dataTED,
  isSplitScreen = false,
}: LoadedProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isHovering = useRef(false);

  const [fixedSelection, _setFixedSelection] = useState<Selection[]>([]);
  const [hoverSelection, _setHoverSelection] = useState<Selection[]>([]);
  const [colorGroup, setColorGroup] = useState({});

  const [representativeDataForStructure, setRepresentativeDataForStructure] =
    useState<{ family: ExtendedFeature[]; domain: ExtendedFeature[] }>({
      family: [],
      domain: [],
    });

  const [processedTracks, setProcessedTracks] =
    useState<ProteinViewerDataObject>({});
  const hoverSelectionRef = useRef(hoverSelection);
  const fixedSelectionRef = useRef(fixedSelection);
  const processedData = useProcessData(data?.payload?.results, 'protein');
  const setFixedSelection = (data: Selection[]) => {
    fixedSelectionRef.current = data;
    _setFixedSelection(data);
  };
  const setHoverSelection = (data: Selection[]) => {
    hoverSelectionRef.current = data;
    _setHoverSelection(data);
  };

  useEffect(() => {
    const selection = [...hoverSelection, ...fixedSelection];
    onChangeSelection(selection.length ? selection : null);
  }, [fixedSelection, hoverSelection]);

  const [currentMatchType, setCurrentMatchType] = useState(matchTypeSettings);

  const [forceRenderKey, setForceRenderKey] = useState(0);

  useEffect(() => {
    if (currentMatchType !== matchTypeSettings) {
      setCurrentMatchType(matchTypeSettings);
      if (colorDomainsBy) {
        setForceRenderKey((prevKey) => prevKey + 1); // Triggers re-render
      }
    }
  }, [matchTypeSettings, colorDomainsBy]);

  useEffect(() => {
    if (!processedData) return;
    const newGroups = { ...groups };

    if (dataConfidence) {
      addConfidenceTrack(dataConfidence, protein, newGroups, 'alphafold');
    }
    // For synchronous operations, we can set state immediately
    setProcessedTracks(newGroups);
  }, [processedData, dataConfidence, protein]);

  useEffect(() => {
    const currentTrack = trackRef.current;
    const handleChange = (rawEvent: Event) => {
      const event = rawEvent as CustomEvent;
      if (!event.detail) return;
      const { eventType, highlight } = event.detail;

      if (!isHovering.current) {
        switch (eventType) {
          case 'click':
            if (fixedSelectionRef.current.length) {
              setFixedSelection([]);
            } else {
              setFixedSelection(hoverSelectionRef.current);
            }
            break;

          case 'mouseover': {
            if (!fixedSelectionRef.current.length) {
              isHovering.current = true;
              const color =
                parseInt(event?.detail?.feature?.color?.substring(1), 16) || 0;
              const selection =
                highlight?.split(',').map((block: string) => {
                  const parts = block.split(':');
                  const start = Number(parts?.[0]) || 1;
                  const end = Number(parts?.[1]) || 1;
                  return { chain: 'A', start, end, color };
                }) || [];
              setHoverSelection(selection);
            }
            break;
          }
          default:
            break;
        }
      } else if (eventType === 'mouseout') {
        setHoverSelection([]);
        isHovering.current = false;
      } else if (eventType === 'click') {
        if (fixedSelectionRef.current.length) {
          setFixedSelection([]);
        } else {
          setFixedSelection(hoverSelectionRef.current);
        }
      }
    };
    // Add the listener
    currentTrack?.addEventListener('change', handleChange);

    // Clean up listener
    return () => {
      trackRef.current?.removeEventListener('change', handleChange);
    };
  }, [trackRef.current, processedTracks]);

  // Color 3D model based on selection
  useEffect(() => {
    const tedData = dataTED ? formatTED(dataTED) : [];
    const tedFeatures: Feature[] = [];
    if (tedData.length > 0)
      for (const loc of tedData[0].locations || []) {
        for (const frag of loc.fragments) {
          const start = frag.start || 1;
          const end = frag.end || 1;
          tedFeatures.push({
            accession: 'TED:TED',
            start,
            end,
            color: (loc as ProtVistaLocation & { color: string }).color,
          });
        }
      }

    const colorToObj: Record<string, Feature[]> = {
      af: [] as Feature[],
      repr_families: representativeDataForStructure['family'],
      repr_domains: representativeDataForStructure['domain'] as Feature[],
      ted: tedFeatures as Feature[],
    };

    if (colorBy) {
      const colorMap: Record<number, number> = {};
      for (const feature of colorToObj[colorBy].values()) {
        const start = feature.start || 1;
        const end = feature.end || 1;
        for (let i = start; i <= end + 1; i++) {
          if (colorBy !== 'ted') feature.color = undefined;
          colorMap[i] = parseInt(
            getTrackColor(feature, colorDomainsBy).substring(1),
            16,
          );
        }
      }
      if (setColorMap) setColorMap(colorMap);
    }
  }, [colorBy, dataTED, colorDomainsBy, representativeDataForStructure]);

  if (
    !data ||
    data.loading ||
    !dataProtein ||
    dataProtein.loading ||
    !processedData
  )
    return <Loading />;
  const {
    interpro,
    unintegrated,
    representativeDomains,
    representativeFamilies,
  } = processedData;

  const groups = makeTracks({
    interpro: interpro as Array<{ accession: string; type: string }>,
    unintegrated: unintegrated as Array<{ accession: string; type: string }>,
    representativeDomains: representativeDomains as Array<MinimalFeature>,
    representativeFamilies: representativeFamilies as Array<MinimalFeature>,
  }) as ProteinViewerDataObject<ExtendedFeature>;

  if (!dataProtein.payload?.metadata) return null;

  if (!dataInterProNMatches) return;

  const interpro_NMatchesCount = Object.entries(dataInterProNMatches).length;

  const allTracks = Object.keys({ ...groups });
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
  ];

  const tracksToProcess = allTracks.filter(
    (track) => !unaffectedTracks.includes(track),
  );

  if (
    matchTypeSettings &&
    colorDomainsBy &&
    Object.keys(processedTracks).length > 0
  ) {
    let tracks = JSON.parse(JSON.stringify(processedTracks));
    tracksToProcess.forEach((track) => {
      const traditionalMatches = tracks[track] || [];
      tracks[track] = mergeMatches(
        track,
        traditionalMatches as MinimalFeature[],
        dataInterProNMatches,
        matchTypeSettings,
      );
    });

    tracks = sectionsReorganization(tracks);

    // Sort data by match position, but exclude residues and PIRSR
    Object.entries(tracks as ProteinViewerDataObject<ExtendedFeature>).forEach(
      ([key, group]) => {
        if (key !== 'residues') {
          tracks[key] = group.sort(sortTracks).flat();
        }
      },
    );

    const matchesAvailable = {
      hmm:
        processedTracks &&
        Object.values(
          processedTracks as ProteinViewerDataObject<ExtendedFeature>,
        ).some((track) => {
          // Check if any of the tracks have object, except for the confidence score one.
          return track.length > 0 && track?.[0].type !== 'confidence';
        }),
      dl: interpro_NMatchesCount > 0, // Computed above
    };

    const tedData = dataTED ? formatTED(dataTED) : [];
    if (tedData.length > 0) {
      tracks['external_sources'] = tedData;
      moveExternalFeatures(tracks);
      setHasTED(true);
    }

    return (
      <div ref={trackRef}>
        {interpro_NMatchesCount > 0 && (
          <>
            <Callout type="warning" alt={false} closable={true}>
              This sequence includes additional matches predicted by ✨
              <b>InterPro‑N</b>, an AI-powered deep learning model developed by
              Google DeepMind.
              <br />
              By default, InterPro matches are supplemented with novel
              InterPro‑N predictions (novel matches or those at least 5%
              longer).
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
          key={forceRenderKey}
          protein={dataProtein.payload.metadata}
          data={flattenTracksObject(tracks)}
          title="Protein domains"
          showOptions={!isSplitScreen}
          matchesAvailable={matchesAvailable}
          setHasRepresentativeData={setHasRepresentativeData}
          hasRepresentativeData={hasRepresentativeData}
          setRepresentativeDataForStructure={setRepresentativeDataForStructure}
          representativeDataForStructure={representativeDataForStructure}
        />
      </div>
    );
  }
};

const getProteinURL = createSelector(
  (state) => state.settings.api,
  (_, props) => props.protein,
  ({ protocol, hostname, port, root }, accession) => {
    const newDesc: InterProPartialDescription = {
      main: { key: 'protein' },
      protein: { db: 'uniprot', accession },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDesc),
    });
  },
);

const getInterproRelatedEntriesURL = createSelector(
  (state) => state.settings.api,
  (_, props) => props.protein,
  ({ protocol, hostname, port, root }, protein) => {
    const newDesc: InterProPartialDescription = {
      main: { key: 'entry' },
      entry: { db: 'all' },
      protein: { isFilter: true, db: 'uniprot', accession: protein },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDesc),
      query: {
        page_size: 200,
        extra_fields: 'short_name',
      },
    });
  },
);

export default loadData<AlphafoldPayload, 'Prediction'>({
  getUrl: getAlphaFoldPredictionURL,
  propNamespace: 'Prediction',
} as LoadDataParameters)(
  loadData<AlphafoldConfidencePayload, 'Confidence'>({
    getUrl: getConfidenceURLFromPayload('Prediction'),
    propNamespace: 'Confidence',
  } as LoadDataParameters)(
    loadData<TEDPayload, 'TED'>({
      getUrl: getTEDURL,
      propNamespace: 'TED',
    } as LoadDataParameters)(
      loadData<{ metadata: ProteinMetadata }, 'Protein'>({
        getUrl: getProteinURL,
        propNamespace: 'Protein',
      } as LoadDataParameters)(
        loadData(getInterproRelatedEntriesURL as LoadDataParameters)(
          ProteinViewerForAlphafold,
        ),
      ),
    ),
  ),
);
