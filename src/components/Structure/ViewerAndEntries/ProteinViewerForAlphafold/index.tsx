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
} from 'components/AlphaFold/selectors';
import { Selection } from 'components/Structure/ViewerAndEntries';
import { sortTracks } from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded/utils';

import Loading from 'components/SimpleCommonComponents/Loading';
import { mergeMatches } from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded/utils';

import {
  flattenTracksObject,
  makeTracks,
} from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';

import { sectionsReorganization } from 'components/Related/DomainsOnProtein/utils';

const ProteinViewer = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
  loading: null,
});

/* Processing of the payload needs to be slightly different
to add tracks to the groups object instead of the dataSorted object */
export const addConfidenceTrack = (
  dataConfidence: RequestedData<AlphafoldConfidencePayload>,
  protein: string,
  tracks: ProteinViewerDataObject,
) => {
  if (dataConfidence?.payload?.confidenceCategory?.length) {
    tracks['alphafold_confidence'] = [];
    tracks['alphafold_confidence'][0] = {
      accession: `confidence_af_${protein}`,
      data: dataConfidence.payload.confidenceCategory.join(''),
      type: 'confidence',
      protein,
      source_database: 'alphafold',
    };
  }
};

type Props = {
  protein: string;
  onChangeSelection: (s: Selection[] | null) => void;
  isSplitScreen: boolean;
  bfvd?: string;
  dataInterProNMatches: Record<string, InterProN_Match>;
  matchTypeSettings: MatchTypeUISettings;
  colorDomainsBy: string;
};

interface LoadedProps
  extends Props,
    LoadDataProps<{ metadata: ProteinMetadata }, 'Protein'>,
    LoadDataProps<AlphafoldConfidencePayload, 'Confidence'>,
    LoadDataProps<AlphafoldPayload, 'Prediction'>,
    LoadDataProps<PayloadList<EndpointWithMatchesPayload<EntryMetadata>>> {}
const ProteinViewerForAlphafold = ({
  data,
  protein,
  bfvd,
  dataProtein,
  dataInterProNMatches,
  dataConfidence,
  matchTypeSettings,
  colorDomainsBy,
  onChangeSelection,
  isSplitScreen = false,
}: LoadedProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isHovering = useRef(false);

  const [fixedSelection, _setFixedSelection] = useState<Selection[]>([]);
  const [hoverSelection, _setHoverSelection] = useState<Selection[]>([]);
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
    let newGroups = { ...groups };

    if (dataConfidence) {
      addConfidenceTrack(dataConfidence, protein, newGroups);
    }
    // For synchronous operations, we can set state immediately
    setProcessedTracks(newGroups);
  }, [processedData, dataConfidence, bfvd, protein]);

  useEffect(() => {
    trackRef.current?.addEventListener('change', (rawEvent: Event) => {
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
    });
  }, [trackRef.current, processedTracks]);
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

  let groups = makeTracks({
    interpro: interpro as Array<{ accession: string; type: string }>,
    unintegrated: unintegrated as Array<{ accession: string; type: string }>,
    representativeDomains: representativeDomains as Array<MinimalFeature>,
    representativeFamilies: representativeFamilies as Array<MinimalFeature>,
  }) as ProteinViewerDataObject<ExtendedFeature>;

  if (!dataProtein.payload?.metadata) return null;

  if (!dataInterProNMatches) return;

  let interpro_NMatchesCount = Object.entries(dataInterProNMatches).length;

  const allTracks = Object.keys({ ...groups });
  const unaffectedTracks = [
    'alphafold_confidence',
    'intrinsically_disordered_regions',
    'funfam',
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

    return (
      <div ref={trackRef}>
        <ProteinViewer
          key={forceRenderKey}
          viewerType={'alphafold'}
          protein={dataProtein.payload.metadata}
          data={flattenTracksObject(tracks)}
          title="Protein domains"
          showOptions={!isSplitScreen}
          matchesAvailable={matchesAvailable}
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
    loadData<{ metadata: ProteinMetadata }, 'Protein'>({
      getUrl: getProteinURL,
      propNamespace: 'Protein',
    } as LoadDataParameters)(
      loadData(getInterproRelatedEntriesURL as LoadDataParameters)(
        ProteinViewerForAlphafold,
      ),
    ),
  ),
);
