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

const f = foundationPartial(local);

const CurrentVersion = ({ data }) => {
  if (!data) return <Loading />;
  const { headers, loading, payload } = data;
  if (loading || !headers || !payload) return <Loading />;
  const headersMap = new Map(headers);
  const current = headersMap.get('interpro-version');
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
        <div className={f('version-date')}>
          {dateObj.toLocaleString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
};
CurrentVersion.propTypes = {
  data: T.object,
};

const getReleaseNotesUrl = createSelector(
  state => state.settings.api,
  state => state.customLocation.description.other,
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
