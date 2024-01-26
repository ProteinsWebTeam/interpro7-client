import React from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Loading from 'components/SimpleCommonComponents/Loading';

import cssBinder from 'styles/cssBinder';

import local from './style.css';

const css = cssBinder(local);

type Props = {
  accession: string;
};
interface LoadedProps
  extends Props,
    LoadDataProps<PayloadList<{ metadata: TaxonomyMetadata }>> {}

const TaxnameStructures = ({ data }: LoadedProps) => {
  if (!data) return null;
  const { loading, payload } = data;
  if (loading) return <Loading inline={true} />;
  if (!payload) return null;
  return (
    <div className={css('container')}>
      <div className={css({ marquee: payload.results.length > 1 })}>
        {payload.results.map((result) => {
          const name = result.metadata.name as unknown as string;
          const taxAccession = result.metadata.accession;
          return (
            <div key={taxAccession}>
              <Tooltip title={`${name} (Tax ID: ${taxAccession})`}>
                {name}
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getUrl = createSelector(
  (state: GlobalState) => state.settings.api,
  (_: GlobalState, props: Props) => props.accession,
  ({ protocol, hostname, port, root }: ParsedURLServer, accession: string) =>
    format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: 'taxonomy' },
          taxonomy: { db: 'uniprot' },
          structure: {
            isFilter: true,
            db: 'pdb',
            accession: accession,
          },
        }),
    }),
);

export default loadData(getUrl as Params)(TaxnameStructures);
