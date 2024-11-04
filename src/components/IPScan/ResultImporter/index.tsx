import React, { useEffect, useState } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import { importJob } from 'actions/creators';
import loadData from 'higherOrder/loadData/ts';

import Loading from 'components/SimpleCommonComponents/Loading';
import Callout from 'components/SimpleCommonComponents/Callout';
import id from 'utils/cheap-unique-id';
import { IPscanRegex } from 'utils/processDescription/handlers';

const STATUS_OK = 200;

const getBaseIPScanID = (accession: string) => {
  const matches = accession.match(IPscanRegex);
  const posfix = matches?.[2];
  return posfix && posfix.startsWith('-')
    ? accession.slice(0, -posfix.length)
    : accession;
};

type Props = {
  jobAccession?: string;
  shouldImport: boolean;
  importJob?: typeof importJob;
  handleImported: () => void;
};
interface LoadedProps extends Props, LoadDataProps<string> {}

const ResultImporter = ({
  jobAccession,
  shouldImport,
  data,
  importJob,
  handleImported,
}: LoadedProps) => {
  if (!data || !jobAccession) return null;
  const [isBusy, setBusy] = useState(false);
  useEffect(() => {
    if (
      data.status === STATUS_OK &&
      data.payload === 'FINISHED' &&
      !isBusy &&
      shouldImport
    ) {
      setBusy(true);
      importJob?.({
        metadata: {
          localID: id(`internal-${Date.now()}`),
          type: 'InterProScan',
          remoteID: getBaseIPScanID(jobAccession),
        },
        data: {
          input: '',
        },
      });
      handleImported();
    }
  }, [data.payload]);
  if (!shouldImport) return null;
  if (data.loading) return <Loading />;
  if (data.status !== STATUS_OK || data.payload !== 'FINISHED') {
    return (
      <Callout type="alert">
        There was an error retrieving the InterProScan Job with ID{' '}
        {jobAccession}
        {data.status === STATUS_OK && (
          <div>
            Server response: <code>{data.payload}</code>
          </div>
        )}
      </Callout>
    );
  }
  return <Loading />;
};

const mapStateToUrl = createSelector(
  (state: GlobalState) => state.settings.ipScan,
  (state: GlobalState) => state.customLocation.description.result.job || '',
  ({ protocol, hostname, port, root }, jobAccession) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}/status/${getBaseIPScanID(jobAccession)}`,
    });
  },
);
const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description.result.job,
  (jobAccession) => ({ jobAccession }),
);

export default loadData({
  getUrl: mapStateToUrl,
  mapStateToProps,
  mapDispatchToProps: { importJob },
  fetchOptions: { useCache: false, responseType: 'text' },
} as LoadDataParameters)(ResultImporter);
