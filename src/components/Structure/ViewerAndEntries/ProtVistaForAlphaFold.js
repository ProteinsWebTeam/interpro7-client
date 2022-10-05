// @flow
import React, { useRef, useEffect, useState } from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';
import { createSelector } from 'reselect';

import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { processData } from 'components/ProtVista/utils';

import Loading from 'components/SimpleCommonComponents/Loading';

const ProtVista = loadable({
  loader: () =>
    import(/* webpackChunkName: "protvista" */ 'components/ProtVista'),
});

/*::
type Selection = { chain: string, start: number, end: number}
  */
const ProtVistaForAlphaFold = (
  { data, dataProtein, onChangeSelection } /*: {
  data: {loading: boolean, payload: ?Object},
  dataProtein: {loading: boolean, payload: ?Object},
  onChangeSelection: (Selection[]|null)=>void;
}*/,
) => {
  const containerRef =
    /* { current?: null | React$ElementRef<'div'>  }*/ useRef(null);
  const [fixedSelection, _setFixedSelection] = useState([]);
  const [hoverSelection, _setHoverSelection] = useState([]);
  const hoverSelectionRef = useRef(hoverSelection);
  const fixedSelectionRef = useRef(fixedSelection);
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
      const { eventtype, highlight } = (event /*: any */).detail;
      switch (eventtype) {
        case 'click':
          if (fixedSelectionRef.current.length) {
            setFixedSelection([]);
          } else {
            setFixedSelection(hoverSelectionRef.current);
          }
          break;
        case 'mouseover': {
          const colour = parseInt(
            (event /*: any */)?.detail?.feature?.color
              .substring(1),
            16,
          );

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
  if (!data || data.loading || !dataProtein || dataProtein.loading)
    return <Loading />;
  const { interpro, unintegrated } = processData({
    data: data.payload ? data : { payload: { results: [] } },
    endpoint: 'protein',
  });
  if (!dataProtein.payload?.metadata) return null;
  return (
    <div ref={containerRef}>
      <ProtVista
        protein={dataProtein.payload.metadata}
        data={[['Entries', interpro.concat(unintegrated)]]}
        title="Protein domains"
      />
    </div>
  );
};
ProtVistaForAlphaFold.propTypes = {
  data: dataPropType,
  dataProtein: dataPropType,
  onChangeSelection: T.func,
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
      },
    });
  },
);

export default loadData({
  getUrl: getProteinURL,
  propNamespace: 'Protein',
})(loadData(getInterproRelatedEntriesURL)(ProtVistaForAlphaFold));
