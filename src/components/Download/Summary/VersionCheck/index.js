// @flow
import React from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { foundationPartial } from 'styles/foundation';

import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import ipro from 'styles/interpro-new.css';
const f = foundationPartial(interproTheme, ipro);

/*:: type Props = {
  localID: string,
  downloadVersion: number,
  data?: {
    loading: boolean,
    payload?: {
      databases:{
        [string]:{
          version: number,
        }
      }
    }
  }
};*/

const VersionCheck = ({ data, downloadVersion, localID } /*: Props */) => {
  if (!data || data.loading || !downloadVersion) return null;
  const currentVersion = Number(
    data?.payload?.databases?.interpro?.version || 0,
  );
  if (currentVersion > downloadVersion)
    return (
      <Tooltip
        html={
          <>
            <h5 style={{ color: 'white' }}>This download is outdated.</h5>
            <p>
              It was obtained using InterPro version <i>{downloadVersion}</i>,
              while the current version is <i>{currentVersion}</i>
            </p>
            <p>
              <Link
                to={{
                  description: {
                    main: { key: 'result' },
                    result: { type: 'download' },
                  },
                  hash: localID?.split('/api')?.[1],
                }}
                className={f('button')}
              >
                Restart the download with current data
              </Link>
              .
            </p>
          </>
        }
      >
        ⚠️
      </Tooltip>
    );
  return null;
};
VersionCheck.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }),
  localID: T.string,
  downloadVersion: T.number,
};
export default loadData(getUrlForMeta)(VersionCheck);
