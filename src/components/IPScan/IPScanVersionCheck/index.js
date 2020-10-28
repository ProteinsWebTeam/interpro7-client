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

const IPScanVersionCheck = ({ data, ipScanVersion }) => {
  if (!data || data.loading) return <Loading inline={true} />;
  const currentVersion = data.payload?.databases?.interpro?.version;
  const [_, jobVersion] = (ipScanVersion || '').split('-');

  if (currentVersion !== jobVersion) {
    return (
      <div className={f('callout', 'info', 'withicon')}>
        <b>Mismatched Version</b>
        <p>
          InterProScan version: <code>{ipScanVersion}</code>.
        </p>
        <p>
          Some links might not work as they uploaded a result from a previous
          release of InterPro <code>{jobVersion}</code> and the data might have
          been deleted or changed in the current version{' '}
          <code>{currentVersion}</code>.
        </p>
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
