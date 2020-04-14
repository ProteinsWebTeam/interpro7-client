import React from 'react';
import T from 'prop-types';

import { format } from 'url';
import { createSelector } from 'reselect';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import NumberComponent from 'components/NumberComponent';

import Loading from 'components/SimpleCommonComponents/Loading';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';
import style from '../style.css';
const f = foundationPartial(style);

const ProtVista = loadable({
  loader: () =>
    import(/* webpackChunkName: "protvista" */ 'components/ProtVista'),
});

const features2protvista = (features) => {
  const featArray = Object.values(features || {});
  const integrated = [];
  for (const feature of featArray) {
    if (feature.integrated && feature.integrated in features) {
      const parent = features[feature.integrated];
      if (!('children' in parent)) {
        parent.children = [];
      }
      if (parent.children.indexOf(feature) === -1)
        parent.children.push(feature);
      integrated.push(feature);
    }
  }

  const interpro = featArray.filter(({ accession }) =>
    accession.toLowerCase().startsWith('ipr'),
  );
  const unintegrated = featArray.filter(
    (f) => interpro.indexOf(f) === -1 && integrated.indexOf(f) === -1,
  );
  return [
    ['interpro', interpro],
    ['unintegrated', unintegrated],
  ];
};

const Viewer = (
  {
    isoform,
    data,
  } /*: {isoform: string, data: {loading: boolean, payload: Object}} */,
) => {
  if (!isoform) return null;
  if (!data || data.loading || !data.payload || !data.payload.accession)
    return <Loading />;

  const { accession, length, sequence, features } = data.payload;
  const dataProtvista = features2protvista(features);
  return (
    <div className={f('isoform-panel', 'row')}>
      <div className={f('column')}>
        <header>
          <span className={f('key')}>Isoform:</span>{' '}
          <span className={f('id')}>{accession}</span> <br />
          <span className={f('key')}>Length:</span>{' '}
          <NumberComponent>{length}</NumberComponent>
        </header>
        <ProtVista
          protein={{ sequence, length: sequence.length }}
          data={dataProtvista}
          title="Entry matches to this Isoform"
        />
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
  (state) => state.settings.api,
  (state) => state.customLocation.description,
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
