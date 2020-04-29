import React from 'react';
import T from 'prop-types';

import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { format } from 'url';
import { createSelector } from 'reselect';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import ProteomeCard from 'components/Proteome/Card';
import EntryHierarchy from 'components/Proteome/EntryHierarchy';

import local from 'components/Table/views/Grid/style.css';

const ProteomeFocus = ({ accession, data }) => {
  if (data.loading) return null;
  return (
    <>
      <div>
        This page compiles the data related to{' '}
        {data?.payload?.metadata?.name?.name} that InterPro contains.
      </div>
      <div className={local['grid-card']} style={{ maxWidth: '40vw' }}>
        <ProteomeCard data={data.payload} entryDB="InterPro" search="" />
      </div>
      <hr style={{ margin: '1em' }} />
      <div>
        Here is the hierarchy of the families that matches any of the proteins
        in the proteome
      </div>
      <EntryHierarchy accession={accession} />
    </>
  );
};
ProteomeFocus.propTypes = {
  accession: T.string,
  data: dataPropType,
};

const getUrlFor = createSelector(
  (state) => state.settings.api,
  (_, props) => props.accession,
  ({ protocol, hostname, port, root }, accession) => {
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: 'proteome' },
          proteome: { db: 'uniprot', accession },
        }),
    });
  },
);

export default loadData(getUrlFor)(ProteomeFocus);
