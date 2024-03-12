import React from 'react';

import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';

import config from 'config';

import BaseLink from 'components/ExtLink/BaseLink';

type Props = {
  accession: string;
  className?: string;
};
interface LoadedProps extends Props, LoadDataProps<RfamPayload> {}

const RFamLink = ({ data, accession, className }: LoadedProps) => {
  if (!data) return null;
  const { loading, payload } = data;
  if (loading || !payload || payload.hitCount === 0) return null;

  return (
    <li>
      <BaseLink
        id={accession}
        target={'_blank'}
        pattern="https://rfam.org/genome/{id}"
        className={className}
      >
        Rfam
      </BaseLink>
    </li>
  );
};

const getRfamUrl = createSelector(
  (_state: GlobalState, props: Props) => props.accession,
  (accession) => {
    if (!accession) return null;
    return `${config.root.Rfam.href}?query=entry_type:Genome%20AND%20id:${accession}&format=json`;
  },
);

export default loadData(getRfamUrl as Params)(RFamLink);
