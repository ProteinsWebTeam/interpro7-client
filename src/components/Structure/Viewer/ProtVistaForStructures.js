import React, { PureComponent } from 'react';
import T from 'prop-types';
import loadData from 'higherOrder/loadData';
import { createSelector } from 'reselect';

import EntriesOnStructure from 'components/Related/DomainEntriesOnStructure';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Loading from 'components/SimpleCommonComponents/Loading';

const processData = createSelector(
  data => data.payload.results,
  dataResults => {
    const results = [];
    for (const item of dataResults) {
      results.splice(
        0,
        0,
        ...item.structures.map(structure => ({
          ...structure,
          ...item.metadata,
        })),
      );
    }
    const interpro = results.filter(
      entry => entry.source_database.toLowerCase() === 'interpro',
    );
    const interproMap = new Map(
      interpro.map(ipro => [`${ipro.accession}-${ipro.chain}`, ipro]),
    );
    const integrated = results.filter(entry => entry.integrated);
    const unintegrated = results.filter(
      entry => interpro.concat(integrated).indexOf(entry) === -1,
    );
    integrated.forEach(entry => {
      const ipro = interproMap.get(`${entry.integrated}-${entry.chain}`) || {};
      if (!ipro.children) ipro.children = [];
      if (ipro.children.indexOf(entry) === -1) ipro.children.push(entry);
    });
    return interpro.concat(unintegrated);
  },
);
const ProtVistaForStructure = ({ data }) => {
  if (!data || data.loading || !data.payload) return <Loading />;

  const pData = processData(data);
  return (
    <div>
      <EntriesOnStructure entries={pData} />
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
        page_size: 100,
      },
    });
  },
);

export default loadData(getInterproRelatedEntriesURL)(ProtVistaForStructure);
