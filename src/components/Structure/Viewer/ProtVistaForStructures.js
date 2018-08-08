import React from 'react';
import T from 'prop-types';
import loadData from 'higherOrder/loadData';
import { createSelector } from 'reselect';

import EntriesOnStructure from 'components/Related/DomainEntriesOnStructure';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { processData } from 'components/ProtVista/utils';

import Loading from 'components/SimpleCommonComponents/Loading';

const ProtVistaForStructure = ({ data }) => {
  if (!data || data.loading || !data.payload) return <Loading />;

  const { interpro, unintegrated } = processData({
    data,
    endpoint: 'structure',
  });
  return (
    <div>
      <EntriesOnStructure entries={interpro.concat(unintegrated)} />
    </div>
  );
};
ProtVistaForStructure.propTypes = {
  data: T.shape({
    loading: T.boolean,
    payload: T.object,
  }).isRequired,
};

const getInterproRelatedEntriesURL = createSelector(
  state => state.settings.api,
  state => state.customLocation.description.structure.accession,
  ({ protocol, hostname, port, root }, accession) => {
    const newDesc = {
      main: { key: 'entry' },
      structure: { isFilter: true, db: 'PDB', accession },
      entry: { db: 'all' },
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

export default loadData(getInterproRelatedEntriesURL)(ProtVistaForStructure);
