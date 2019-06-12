import React from 'react';
import T from 'prop-types';

import { format } from 'url';
import { createSelector } from 'reselect';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Loading from 'components/SimpleCommonComponents/Loading';

import { foundationPartial } from 'styles/foundation';
import style from '../style.css';
const f = foundationPartial(style);

const Viewer = ({ isoform, data }) => {
  if (!isoform) return null;
  if (!data || data.loading || !data.payload) return <Loading />;

  const { accession, length, seq, features } = data.payload;
  return (
    <div className={f('isoform-panel', 'row')}>
      <div className={f('column')}>
        <h5>Isoform: {accession}</h5>
        <p>Length: {length}</p>
        <pre>{JSON.stringify(features)}</pre>
      </div>
    </div>
  );
};
Viewer.propTypes = {
  isoform: T.string,
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }),
};

const getIsoformURL = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  (_, props) => props.isoform,
  ({ protocol, hostname, port, root }, { protein: { accession } }, isoform) => {
    const description = {
      main: { key: 'protein' },
      protein: { db: 'uniprot', accession },
    };

    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: {
        isoforms: isoform,
      },
    });
  },
);
export default loadData(getIsoformURL)(Viewer);
