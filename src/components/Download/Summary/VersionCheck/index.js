// @flow
import React from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';
import Link from 'components/generic/Link';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { foundationPartial } from 'styles/foundation';

import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import ipro from 'styles/interpro-new.css';
const f = foundationPartial(interproTheme, ipro);

const ONE_SEC = 1000;
const ALMOST_BOTTOM = 0.75;

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
            <h5 style={{ color: 'white' }}>New data available</h5>
            <p>
              One or more versions of InterPro have been released since you
              generated this download.
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
                onNewLocation={() =>
                  setTimeout(
                    () =>
                      window.scrollTo({
                        top:
                          (document?.body?.scrollHeight || 0) * ALMOST_BOTTOM,
                        left: 0,
                        behavior: 'smooth',
                      }),
                    ONE_SEC,
                  )
                }
              >
                Restart the download with current data
              </Link>
            </p>
          </>
        }
        interactive
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
