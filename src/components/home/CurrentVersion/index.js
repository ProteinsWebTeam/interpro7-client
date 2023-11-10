import React from 'react';
import T from 'prop-types';
import VersionBadge from 'components/VersionBadge';
import { createSelector } from 'reselect';
import { cleanUpMultipleSlashes } from 'higherOrder/loadData/defaults';
import { format } from 'url';
import loadData from 'higherOrder/loadData';
import Loading from 'components/SimpleCommonComponents/Loading';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import Link from 'components/generic/Link';
// $FlowFixMe
import { formatLongDate } from 'utils/date';

const f = foundationPartial(local);

export const CurrentVersion = (
  { data } /*: {data: {loading: boolean, payload: Object}} */,
) => {
  if (!data) return <Loading inline={true} />;
  const { loading, payload } = data;
  if (loading || !payload) return <Loading inline={true} />;
  const current = Object.entries(payload).sort(([_, dateA], [__, dateB]) =>
    new Date(dateA).getTime() > new Date(dateB).getTime() ? -1 : 1,
  )[0][0];
  if (!current || !payload[current]) return null;
  const dateObj = new Date(payload[current]);
  return (
    <div className={f('version-block')}>
      <VersionBadge version={current} />
      <div className={f('version-info')}>
        <header>
          <Link
            to={{
              description: { other: ['release_notes'] },
            }}
          >
            InterPro {current}
          </Link>
        </header>
        <div className={f('version-date')}>{formatLongDate(dateObj)}</div>
      </div>
    </div>
  );
};
CurrentVersion.propTypes = {
  data: T.object,
};

const getReleaseNotesUrl = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.other,
  ({ protocol, hostname, port, root }) =>
    cleanUpMultipleSlashes(
      format({
        protocol,
        hostname,
        port,
        pathname: `${root}/utils/release/`,
      }),
    ),
);

export default loadData(getReleaseNotesUrl)(CurrentVersion);
