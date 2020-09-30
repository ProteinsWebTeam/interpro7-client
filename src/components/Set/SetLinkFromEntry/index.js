// @flow
import React from 'react';
import T from 'prop-types';

import { createSelector } from 'reselect';
import { format } from 'url';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';

import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

const SetLinkFromEntry = (
  { data } /*: {data: {loading: boolean, payload: Object}} */,
) => {
  if (!data) return null;
  if (data.loading) return <Loading inline={true} />;
  if (!data.payload) return 'Set not found';
  const { accession, source_database: db } = data.payload.set_subset[0];
  return (
    <Link
      to={{
        description: {
          main: { key: 'set' },
          set: { db, accession },
        },
      }}
    >
      {accession}
    </Link>
  );
};
SetLinkFromEntry.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.shape({
      set_subset: T.object,
    }),
  }),
};
const mapStateToUrl = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.main.key,
  (state) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  (state) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  ({ protocol, hostname, port, root }, key, db, accession) => {
    if (!accession || key !== 'entry') return;
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key },
          [key]: { db, accession },
          set: { db, isFilter: true },
        }),
    });
  },
);
export default loadData(mapStateToUrl)(SetLinkFromEntry);
