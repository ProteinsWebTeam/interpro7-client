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
  const containerRef = useRef<HTMLDivElement | null>(null);
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
    containerRef.current?.addEventListener('change', (rawEvent: Event) => {
      const event = rawEvent as CustomEvent;
      if (!event.detail) return;
      const { eventType, highlight } = event.detail;
      switch (eventType) {
        case 'click':
          if (fixedSelectionRef.current.length) {
            setFixedSelection([]);
          } else {
            setFixedSelection(hoverSelectionRef.current);
          }
          break;
        case 'mouseover': {
          const colour =
            parseInt(event?.detail?.feature?.color?.substring(1), 16) || 0;

          const selection =
            highlight?.split(',').map((block: string) => {
              const parts = block.split(':');
              const start = Number(parts?.[0]) || 1;
              const end = Number(parts?.[1]) || 1;
              return { chain: 'A', start, end, colour };
            }) || [];
          setHoverSelection(selection);
          break;
        }
        case 'mouseout':
          setHoverSelection([]);
          break;
        default:
          break;
      }
    });
  }, [containerRef.current]);
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

  console.log(unintegrated);
  const groups = makeTracks({
    interpro: interpro as Array<{ accession: string; type: string }>,
    unintegrated: unintegrated as Array<{ accession: string; type: string }>,
    representativeDomains: representativeDomains as Array<MinimalFeature>,
    representativeFamilies: representativeFamilies as Array<MinimalFeature>,
  });

  if (groups.domain) {
    groups.domains = groups.domain.slice();
    groups.domain = [];
  }

  if (groups.family) {
    groups.families = groups.family.slice();
    groups.family = [];
  }

  if (dataConfidence) addConfidenceTrack(dataConfidence, protein, groups);
  const tracks = flattenTracksObject(groups);

  const mainTracks = [
    'alphafold confidence',
    'domains',
    'families',
    'active site',
    'conserved site',
  ];

  const hideCategories = {
    'alphafold confidence': false,
    domains: false,
    families: false,
    'active site': false,
    'conserved site': false,
  };

  if (!dataProtein.payload?.metadata) return null;
  return (
    <div ref={containerRef}>
      <ProteinViewer
        protein={dataProtein.payload.metadata}
        data={tracks}
        mainTracks={mainTracks}
        hideCategories={hideCategories}
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
