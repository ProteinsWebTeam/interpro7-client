import React from 'react';

import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData/ts';

import Loading from 'components/SimpleCommonComponents/Loading';

import config from 'config';

interface LoadedProps extends LoadDataProps<UniProtProteomesPayload> {}

const UniProtDescription = ({ data }: LoadedProps) => {
  if (!data) return null;
  const { loading, payload } = data;
  if (loading || !payload) return <Loading />;
  return data.payload?.description ? (
    <>
      <h4>Description</h4>
      <p>{data.payload?.description}</p>
    </>
  ) : null;
};

const getProteomeUrl = createSelector(
  (state: GlobalState) => state.customLocation.description.proteome.accession,
  (accession) => {
    if (!accession) return null;
    return `${config.root.UniProt.href}/proteomes/${accession}`;
  },
);
export default loadData(getProteomeUrl as LoadDataParameters)(
  UniProtDescription,
);
