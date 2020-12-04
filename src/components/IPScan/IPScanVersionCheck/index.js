// @flow
import React from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
import Loading from 'components/SimpleCommonComponents/Loading';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, fonts);

/*::
  type Props = {
    data?: {
      loading:Boolean,
      payload: ?{databases: {}}
    },
    ipScanVersion?: string,
  }
*/

const IPScanVersionCheck = ({ data, ipScanVersion } /*: Props */) => {
  if (!data || data.loading) return <Loading inline={true} />;
  const currentVersion = data.payload?.databases?.interpro?.version;
  const currentVersionReleaseDate = new Date(
    data.payload?.databases?.interpro?.releaseDate,
  );
  const [_, jobVersion] = (ipScanVersion || '').split('-');

  const msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds per day
  const daysSinceRelease = Math.round(
    (new Date().getTime() - currentVersionReleaseDate.getTime()) / msPerDay,
  );

  if (currentVersion !== jobVersion) {
    return (
      <div className={f('callout', 'info', 'withicon')}>
        <h4 style={{ display: 'inline-block' }}>Mismatched Version</h4>
        <p>
          InterProScan version: <code>{ipScanVersion}</code>.
        </p>
        <p>
          Some links might not work as they uploaded a result from a previous
          release of InterPro <code>{jobVersion}</code> and the data might have
          been deleted or changed in the current version{' '}
          <code>{currentVersion}</code>.
        </p>
        {daysSinceRelease < 5 ? (
          <p>
            <b>Note:</b>
            InterPro version <code>{currentVersion}</code> has been released on{' '}
            <i>{currentVersionReleaseDate.toLocaleDateString()}</i>. We are
            still in the process of updating the InterProScan web service which
            might take up to 5 days. This might explain version mismatches of
            recently submitted jobs.
          </p>
        ) : null}
      </div>
    );
  }
  return null;
};
IPScanVersionCheck.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }),
  ipScanVersion: T.string,
};
export default loadData(getUrlForMeta)(IPScanVersionCheck);
