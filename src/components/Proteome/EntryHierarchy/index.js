import React from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import local from './style.css';

const f = foundationPartial(ipro, local);

const ProteomeEntryHierarchy = ({ data, groupBy = x => [x] }) => {
  if (!data || data.loading) return null;
  const interproFamilies = data.payload.results.map(
    ({ metadata: { accession, type }, extra_fields: { hierarchy } }) => ({
      accession,
      hierarchy,
      type,
    }),
  );
  const groups = groupBy(interproFamilies);
  return (
    <div className={f('margin-bottom-large')}>
      <h5>Protein family membership</h5>
      <div className={f('family-groups')}>
        {groups.map((g, i) => (
          <div key={i}>
            {g.length && (
              <ProteinEntryHierarchy entries={g} includeChildren={true} />
            )}
          </div>
        ))}
        {interproFamilies.length < 1 && (
          <p className={f('margin-bottom-medium')}>None predicted</p>
        )}
      </div>
    </div>
  );
};
ProteomeEntryHierarchy.propTypes = {
  data: dataPropType,
  groupBy: T.func,
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
