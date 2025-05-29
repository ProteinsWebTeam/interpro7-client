// @flow
import React, { useEffect } from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
import Loading from 'components/SimpleCommonComponents/Loading';
// $FlowFixMe
import Callout from 'components/SimpleCommonComponents/Callout';

const DAYS_TO_UPDATE_IPSCAN = 5;
/*::
  type Props = {
    data?: {
      loading:Boolean,
      payload: ?{databases: {
        [string]: {
          [string]: any,
        }
      }}
    },
    ipScanVersion?: string,
    callback: boolean => void
  }
*/

const IPScanVersionCheck = ({ data, ipScanVersion, callback } /*: Props */) => {
  const currentVersion = data?.payload?.databases?.interpro?.version;
  const currentVersionReleaseDate = new Date(
    data?.payload?.databases?.interpro?.releaseDate || 0,
  );

  if (!data || data.loading || !ipScanVersion) return <Loading inline={true} />;

  // If version comes from InterProScan5, split it, otherwise just take the value of "interpro-version" provided by 106
  const jobVersion = ipScanVersion.includes('-')
    ? ipScanVersion.split('-')[1]
    : ipScanVersion;

  useEffect(() => {
    if (callback) callback(currentVersion !== jobVersion);
  }, [currentVersion, jobVersion, callback]);

  // eslint-disable-next-line no-magic-numbers
  const msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds per day
  const daysSinceRelease = Math.round(
    (new Date().getTime() - currentVersionReleaseDate.getTime()) / msPerDay,
  );
  if (currentVersion !== jobVersion) {
    return (
      <Callout type="info">
        <h4>Mismatched Version</h4>
        <p>
          InterProScan version: <code>{ipScanVersion}</code>.
        </p>
        <p>
          Some links might not work as the results are from a previous release
          of InterPro {jobVersion ? <code>{jobVersion}</code> : null} and some
          of the data might have been deleted or changed in the current version{' '}
          <code>{currentVersion}</code>.
        </p>
        {daysSinceRelease < DAYS_TO_UPDATE_IPSCAN ? (
          <p>
            <b>Note:</b>
            InterPro version <code>{currentVersion}</code> has been released on{' '}
            <i>{currentVersionReleaseDate.toLocaleDateString()}</i>. We are
            still in the process of updating the InterProScan web service which
            might take up to 5 days. This might explain version mismatches of
            recently submitted jobs.
          </p>
        ) : null}
      </Callout>
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
  callback: T.func,
};
export default loadData(getUrlForMeta)(IPScanVersionCheck);
