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

import Loading from 'components/SimpleCommonComponents/Loading';

import {
  flattenTracksObject,
  makeTracks,
} from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';

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
  dataProtein,
  dataConfidence,
  onChangeSelection,
  isSplitScreen = false,
}: LoadedProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isHovering = useRef(false);

  const [fixedSelection, _setFixedSelection] = useState<Selection[]>([]);
  const [hoverSelection, _setHoverSelection] = useState<Selection[]>([]);
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
  }, [trackRef.current]);
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

  if (dataConfidence) addConfidenceTrack(dataConfidence, protein, groups);
  const tracks = flattenTracksObject(groups);

  if (!dataProtein.payload?.metadata) return null;

  return (
    <div ref={trackRef}>
      <ProteinViewer
        viewerType={'structures'}
        protein={dataProtein.payload.metadata}
        data={tracks}
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
