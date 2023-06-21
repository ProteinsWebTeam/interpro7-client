// @flow
import React from 'react';
import T from 'prop-types';
import loadData from 'higherOrder/loadData';
import { createSelector } from 'reselect';

import EntriesOnStructure from 'components/Related/DomainEntriesOnStructure';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
// $FlowFixMe
import { processData } from 'components/ProteinViewer/utils';

import Loading from 'components/SimpleCommonComponents/Loading';

const ProtVistaForStructure = (
  {
    data,
    dataSecondary,
  } /*: { data: { loading: boolean, payload: Object }, dataSecondary: { loading: boolean, payload: Object }} */,
) => {
  if (!data || data.loading) return <Loading />;

  let secondaryData;
  if (dataSecondary && !dataSecondary.loading && dataSecondary.payload) {
    if (
      dataSecondary.payload.extra_fields &&
      dataSecondary.payload.extra_fields.secondary_structures
    ) {
      secondaryData = dataSecondary.payload.extra_fields.secondary_structures;
    }
  }

  const { interpro, unintegrated } = processData({
    data: data.payload ? data : { payload: { results: [] } },
    endpoint: 'structure',
  });
  return (
    <div>
      <EntriesOnStructure
        entries={interpro.concat(unintegrated)}
        showChainMenu={true}
        secondaryStructures={secondaryData}
      />
    </div>
  );
};
ProtVistaForStructure.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }).isRequired,
  dataSecondary: T.shape({
    loading: T.bool,
    payload: T.object,
  }),
};

export const getURLForMatches = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.structure,
  ({ protocol, hostname, port, root }, { accession }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}${descriptionToPath({
        main: { key: 'entry' },
        structure: { isFilter: true, db: 'pdb', accession },
        entry: { db: 'all' },
      })}`,
      query: {
        page_size: 200,
        extra_fields: 'short_name',
      },
    }),
);
const getSecondaryStructureURL = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.structure,
  ({ protocol, hostname, port, root }, { db, accession }) => {
    const newDesc = {
      main: { key: 'structure' },
      structure: { db, accession },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDesc),
      query: {
        extra_fields: 'secondary_structures',
      },
    });
  },
);

export default loadData({
  propNamespace: 'Secondary',
  getUrl: getSecondaryStructureURL,
})(loadData(getURLForMatches)(ProtVistaForStructure));
