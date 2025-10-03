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
import getColor from 'src/utils/taxonomy/get-color';
import { features } from 'process';

const ProteinViewer = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
  loading: null,
});

export const addBFVDConfidenceTrack = async (
  pdbURL: string,
  tracks: ProteinViewerDataObject,
  dataProtein: ProteinMetadata,
): Promise<ProteinViewerDataObject> => {
  try {
    // Fetch the PDB file
    const response = await fetch(pdbURL);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDB file: ${response.status}`);
    }

    const protein = dataProtein.name;
    const sequence = dataProtein.sequence;
    const pdbText = await response.text();
    const lines = pdbText.split('\n');

    const residueBFactors: Map<number, number[]> = new Map();
    const aminoacidNumbers = [...Array(sequence.length).keys()];
    aminoacidNumbers.forEach((num) => residueBFactors.set(num, [-1]));

    for (const line of lines) {
      if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
        const residueNumStr = line.substring(22, 26).trim();
        const residueNum = parseInt(residueNumStr);

        const bFactorStr = line.substring(60, 66).trim();
        const bFactor = parseFloat(bFactorStr);

        if (!isNaN(residueNum) && !isNaN(bFactor)) {
          if (residueBFactors.get(residueNum)?.[0] == -1) {
            residueBFactors.set(residueNum, []);
          }
          residueBFactors.get(residueNum)?.push(bFactor);
        }
      }
    }

    // Second pass: calculate average B-factor for each residue
    const residueAverageBFactors: number[] = [];

    // Sort residue numbers to ensure correct order
    const sortedResidueNumbers = Array.from(residueBFactors.keys()).sort(
      (a, b) => a - b,
    );

    for (const residueNum of sortedResidueNumbers) {
      const bFactors = residueBFactors.get(residueNum) || [];
      // Calculate average B-factor for this residue
      const averageBFactor =
        bFactors.reduce((sum, bf) => sum + bf, 0) / bFactors.length;
      residueAverageBFactors.push(averageBFactor);
    }

    // Add the track with amino acid-based B-factors
    tracks['bfvd_confidence'] = [];
    tracks['bfvd_confidence'][0] = {
      accession: `confidence_bfvd_${protein}`,
      data: mapBFactorsToLetters(residueAverageBFactors),
      type: 'confidence',
      protein,
      source_database: 'bfvd',
    };

    return tracks;
  } catch (error) {
    console.error('Error extracting B-factors:', error);
    throw error;
  }
};

export const mapBFactorsToLetters = (bFactors: number[]): string => {
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
  getColorSelection?: (c: string, data: unknown) => void;
  colorBy?: string;
  colorSelections?: Feature[];
  isSplitScreen: boolean;
  bfvd?: string;
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
  bfvd,
  dataProtein,
  dataInterProNMatches,
  dataConfidence,
  matchTypeSettings,
  colorDomainsBy,
  onChangeSelection,
  getColorSelection,
  colorBy,
  dataTED,
  isSplitScreen = false,
}: LoadedProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isHovering = useRef(false);

  const [fixedSelection, _setFixedSelection] = useState<Selection[]>([]);
  const [hoverSelection, _setHoverSelection] = useState<Selection[]>([]);
  const [colorGroup, setColorGroup] = useState({});

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
      addConfidenceTrack(dataConfidence, protein, newGroups);
    }

    // For synchronous operations, we can set state immediately
    setProcessedTracks(newGroups);

    // For the async BFVD data, update state when it's ready
    if (bfvd && dataProtein?.payload) {
      addBFVDConfidenceTrack(
        bfvd,
        newGroups,
        dataProtein.payload['metadata'],
      ).then(() => {
        setProcessedTracks(newGroups);
      });
    }
  }, [processedData, dataConfidence, bfvd, protein]);

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

              console.log(event?.detail);
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
    const {
      interpro,
      unintegrated,
      representativeDomains,
      representativeFamilies,
    } = processedData;

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

    const groups = makeTracks({
      interpro: interpro as Array<{ accession: string; type: string }>,
      unintegrated: unintegrated as Array<{ accession: string; type: string }>,
      representativeDomains: representativeDomains as Array<MinimalFeature>,
      representativeFamilies: representativeFamilies as Array<MinimalFeature>,
    }) as ProteinViewerDataObject<ExtendedFeature>;

    const colorToObj: Record<string, Feature[]> = {
      confidence: [] as Feature[],
      repr_families: representativeFamilies as Feature[],
      repr_domains: representativeDomains as Feature[],
      ted: tedFeatures as Feature[],
    };

    if (colorBy) {
      const colorSelections: Selection[] = [];
      for (const feature of colorToObj[colorBy].values()) {
        const color = feature.color as string;
        const start = feature.start || 1;
        const end = feature.end || 1;
        colorSelections.push({
          chain: String.fromCharCode(colorSelections.length + 65),
          start,
          end,
          color,
        });
      }

      console.log(hoverSelection, fixedSelection);
      setFixedSelection(colorSelections);
    }
  }, [colorBy, dataTED]);

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
              select your preferred setting.
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
