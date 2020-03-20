import React from 'react';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const ProteomeEntryHierarchy = ({ data }) => {
  if (!data || data.loading) return null;
  const interproFamilies = data.payload.results.map(
    ({ metadata: { accession, type }, extra_fields: { hierarchy } }) => ({
      accession,
      hierarchy,
      type,
    }),
  );
  return (
    <div className={f('margin-bottom-large')}>
      <h5>Protein family membership</h5>
      {interproFamilies.length ? (
        <ProteinEntryHierarchy
          entries={interproFamilies}
          includeChildren={true}
        />
      ) : (
        <p className={f('margin-bottom-medium')}>None predicted</p>
      )}
    </div>
  );
};
ProteomeEntryHierarchy.propTypes = {
  data: dataPropType,
};

const getUrlFor = createSelector(
  state => state.settings.api,
  (_, props) => props.accession,
  ({ protocol, hostname, port, root }, accession) => {
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: 'entry' },
          entry: { db: 'interpro' },
          proteome: { isFilter: true, db: 'uniprot', accession },
        }),
      query: {
        page_size: 200,
        type: 'family',
        extra_fields: 'hierarchy',
      },
    });
  },
);
export default loadData(getUrlFor)(React.memo(ProteomeEntryHierarchy));
