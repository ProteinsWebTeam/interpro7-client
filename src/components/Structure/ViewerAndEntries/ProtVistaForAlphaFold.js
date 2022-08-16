import React from 'react';
import T from 'prop-types';
import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import { createSelector } from 'reselect';

import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { processData } from 'components/ProtVista/utils';

import Loading from 'components/SimpleCommonComponents/Loading';

const ProtVista = loadable({
  loader: () =>
    import(/* webpackChunkName: "protvista" */ 'components/ProtVista'),
});

const ProtVistaForAlphaFold = ({ data, protein, dataProtein }) => {
  if (!data || data.loading || !dataProtein || dataProtein.loading)
    return <Loading />;
  const { interpro, unintegrated } = processData({
    data: data.payload ? data : { payload: { results: [] } },
    endpoint: 'protein',
  });

  return (
    <ProtVista
      protein={dataProtein.payload.metadata}
      data={[['Entries', interpro.concat(unintegrated)]]}
      title="Protein domains"
    />
  );
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
