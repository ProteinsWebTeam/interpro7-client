import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';
import { importJob } from 'actions/creators';
import loadData from 'higherOrder/loadData';

import Loading from 'components/SimpleCommonComponents/Loading';
import id from 'utils/cheap-unique-id';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import theme from 'styles/theme-interpro.css';

const f = foundationPartial(theme, ipro);

const STATUS_OK = 200;
const ResultImporter = ({
  accession,
  shouldImport,
  data,
  importJob,
  handleImported,
}) => {
  const [isBusy, setBusy] = useState(false);
  useEffect(() => {
    if (
      data.status === STATUS_OK &&
      data.payload === 'FINISHED' &&
      !isBusy &&
      shouldImport
    ) {
      setBusy(true);
      importJob({
        metadata: {
          localID: id(`internal-${Date.now()}`),
          type: 'InterProScan',
          remoteID: accession,
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
      <div className={f('callout', 'info', 'withicon')}>
        There was an error retrieving the InterProScan Job with ID {accession}
        {data.status === STATUS_OK && (
          <div>
            Server response: <code>{data.payload}</code>
          </div>
        )}
      </div>
    );
  }
  return null;
};
ResultImporter.propTypes = {
  accession: T.string,
  data: T.object,
  importJob: T.func,
  handleImported: T.func,
  shouldImport: T.bool,
};

const mapStateToUrl = createSelector(
  (state) => state.settings.ipScan,
  (state) => state.customLocation.description.result.accession,
  ({ protocol, hostname, port, root }, accession) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}/status/${accession}`,
    });
  },
);
const mapStateToProps = createSelector(
  (state) => state.customLocation.description.result.accession,
  (accession) => ({ accession }),
);

export default loadData({
  getUrl: mapStateToUrl,
  mapStateToProps,
  mapDispatchToProps: { importJob },
  fetchOptions: { useCache: false, responseType: 'text' },
})(ResultImporter);
