import React from 'react';

import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';

import Loading from 'components/SimpleCommonComponents/Loading';

import config from 'config';

interface LoadedProps extends LoadDataProps<UniProtProteomesPayload> {}

const UniProtDescription = ({ data }: LoadedProps) => {
  if (!data) return null;
  const { loading, payload } = data;
  if (loading || !payload) return <Loading />;
  return <div>{data.payload?.description}</div>;
};

const getProteomeUrl = createSelector(
  (state: GlobalState) => state.customLocation.description.proteome.accession,
  (accession) => {
    if (!accession) return null;
    return `${config.root.UniProt.href}/proteomes/${accession}`;
  },
);
export default loadData(getProteomeUrl as Params)(UniProtDescription);
