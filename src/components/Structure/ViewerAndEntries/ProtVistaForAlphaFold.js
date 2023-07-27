import React, { useRef, useEffect, useState } from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';
import { createSelector } from 'reselect';

import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
// $FlowFixMe
import { useProcessData } from 'components/ProteinViewer/utils';
import {
  getAlphaFoldPredictionURL,
  getConfidenceURLFromPayload,
  // $FlowFixMe
} from 'components/AlphaFold/selectors';

import Loading from 'components/SimpleCommonComponents/Loading';

const ProteinViewer = loadable({
  loader: () =>
    // $FlowFixMe
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
});

export const addConfidenceTrack = (dataConfidence, protein, tracks) => {
  if (dataConfidence?.payload?.confidenceCategory?.length) {
    const confidenceTrack = [
      'AlphaFold confidence',
      [
        {
          accession: `confidence_af_${protein}`,
          data: dataConfidence.payload.confidenceCategory.join(''),
          type: 'confidence',
          protein,
          source_database: 'alphafold',
        },
      ],
    ];
    tracks.splice(0, 0, confidenceTrack);
  }
};

/*::
type Selection = { chain: string, start: number, end: number}
  */
const ProtVistaForAlphaFold = (
  {
    data,
    protein,
    dataProtein,
    dataConfidence,
    onChangeSelection,
    isSplitScreen = false,
  } /*: {
  data: {loading: boolean, payload: ?Object},
  protein: string,
  dataProtein: {loading: boolean, payload: ?Object},
  dataConfidence: {loading: boolean, payload: ?Object},
  onChangeSelection: (Selection[]|null)=>void;
  isSplitScreen: boolean;
}*/,
) => {
  const containerRef =
    /* { current?: null | React$ElementRef<'div'>  }*/ useRef(null);
  const [fixedSelection, _setFixedSelection] = useState([]);
  const [hoverSelection, _setHoverSelection] = useState([]);
  const hoverSelectionRef = useRef(hoverSelection);
  const fixedSelectionRef = useRef(fixedSelection);
  const processedData = useProcessData({
    data: data.payload ? data : { payload: { results: [] } },
    endpoint: 'protein',
  });
  const setFixedSelection = (data) => {
    fixedSelectionRef.current = data;
    _setFixedSelection(data);
  };
  const setHoverSelection = (data) => {
    hoverSelectionRef.current = data;
    _setHoverSelection(data);
  };
  useEffect(() => {
    const selection = [...hoverSelection, ...fixedSelection];
    onChangeSelection(selection.length ? selection : null);
  }, [fixedSelection, hoverSelection]);
  useEffect(() => {
    containerRef.current?.addEventListener('change', (event /*: Event */) => {
      if (!event /*: any */.detail) return;
      const { eventType, highlight } = event /*: any */.detail;
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
            parseInt(
              event /*: any */?.detail?.feature?.color
                ?.substring(1),
              16,
            ) || 0;

          const selection =
            highlight?.split(',').map((block) => {
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
  const { interpro, unintegrated } = processedData;
  const tracks = [['Entries', interpro.concat(unintegrated)]];
  addConfidenceTrack(dataConfidence, protein, tracks);
  if (!dataProtein.payload?.metadata) return null;
  return (
    <div ref={containerRef}>
      <ProteinViewer
        protein={dataProtein.payload.metadata}
        data={tracks}
        title="Protein domains"
        showOptions={!isSplitScreen}
      />
    </div>
  );
};
ProtVistaForAlphaFold.propTypes = {
  data: dataPropType,
  dataProtein: dataPropType,
  dataConfidence: dataPropType,
  onChangeSelection: T.func,
  protein: T.string,
  confidenceURL: T.string,
  isSplitScreen: T.bool,
};

const getProteinURL = createSelector(
  (state) => state.settings.api,
  (_, props) => props.protein,
  ({ protocol, hostname, port, root }, accession) => {
    const newDesc = {
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
    const newDesc = {
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

export default loadData({
  getUrl: getAlphaFoldPredictionURL,
  propNamespace: 'Prediction',
})(
  loadData({
    getUrl: getConfidenceURLFromPayload('Prediction'),
    propNamespace: 'Confidence',
  })(
    loadData({
      getUrl: getProteinURL,
      propNamespace: 'Protein',
    })(loadData(getInterproRelatedEntriesURL)(ProtVistaForAlphaFold)),
  ),
);
