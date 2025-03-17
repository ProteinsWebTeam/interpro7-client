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

import Loading from 'components/SimpleCommonComponents/Loading';

import {
  flattenTracksObject,
  makeTracks,
} from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';
import { trace } from 'console';

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

export const addBFVDConfidenceTrack = async (
  pdbURL: string,
  tracks: ProteinViewerDataObject,
  protein: string,
): Promise<ProteinViewerDataObject> => {
  try {
    // Fetch the PDB file
    const response = await fetch(pdbURL);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDB file: ${response.status}`);
    }
    const pdbText = await response.text();
    const lines = pdbText.split('\n');

    // Track residues by their number
    const residueBFactors: Map<number, number[]> = new Map();

    // First pass: collect all B-factors for each residue
    for (const line of lines) {
      if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
        // Extract residue number (columns 23-26)
        const residueNumStr = line.substring(22, 26).trim();
        const residueNum = parseInt(residueNumStr);

        // Extract B-factor value (columns 61-66)
        const bFactorStr = line.substring(60, 66).trim();
        const bFactor = parseFloat(bFactorStr);

        if (!isNaN(residueNum) && !isNaN(bFactor)) {
          // Add this B-factor to the appropriate residue
          if (!residueBFactors.has(residueNum)) {
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
      accession: `confidence_af_${protein}`,
      data: mapBFactorsToLetters(residueAverageBFactors),
      type: 'confidence',
      protein,
      source_database: 'alphafold',
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
      if (bFactor <= 50) {
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

type Props = {
  protein: string;
  onChangeSelection: (s: Selection[] | null) => void;
  isSplitScreen: boolean;
  bfvd?: string;
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
  dataConfidence,
  onChangeSelection,
  isSplitScreen = false,
}: LoadedProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isHovering = useRef(false);

  const [fixedSelection, _setFixedSelection] = useState<Selection[]>([]);
  const [hoverSelection, _setHoverSelection] = useState<Selection[]>([]);
  const [processedTracks, setProcessedTracks] = useState<ProteinViewerData>([]);
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

  useEffect(() => {
    if (!processedData) return;

    const newGroups = { ...groups };

    if (dataConfidence) {
      addConfidenceTrack(dataConfidence, protein, newGroups);
    }

    // For synchronous operations, we can set state immediately
    setProcessedTracks(flattenTracksObject(newGroups));

    // For the async BFVD data, update state when it's ready
    if (bfvd) {
      addBFVDConfidenceTrack(bfvd, newGroups, protein).then((updatedTracks) => {
        setProcessedTracks(
          flattenTracksObject(
            updatedTracks as ProteinViewerDataObject<MinimalFeature>,
          ),
        );
      });
    }
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

  const groups = makeTracks({
    interpro: interpro as Array<{ accession: string; type: string }>,
    unintegrated: unintegrated as Array<{ accession: string; type: string }>,
    representativeDomains: representativeDomains as Array<MinimalFeature>,
    representativeFamilies: representativeFamilies as Array<MinimalFeature>,
  });

  if (!dataProtein.payload?.metadata) return null;

  return (
    <div ref={trackRef}>
      <ProteinViewer
        viewerType={'structures'}
        protein={dataProtein.payload.metadata}
        data={processedTracks}
        title="Protein domains"
        showOptions={!isSplitScreen}
      />
    </div>
  );
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
