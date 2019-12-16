// @flow
import React from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';
import { createSelector } from 'reselect';
import { format } from 'url';

import { EntryMenuLinkWithoutData } from '.';

const Genome3dMenuLink = (
  {
    to,
    exact,
    name,
    usedOnTheSide,
    data: { loading, payload },
  } /*: {to: Object | function, exact: boolean, name: string, usedOnTheSide: boolean, data: {loading: boolean, payload: Object}} */,
) => {
  // eslint-disable-next-line camelcase
  const value = payload?.pager?.total_entries || 0;
  const attrs = { name, value, loading, to, exact, usedOnTheSide };
  return value ? <EntryMenuLinkWithoutData {...attrs} /> : null;
};
Genome3dMenuLink.propTypes = {
  to: T.oneOfType([T.object, T.func]).isRequired,
  exact: T.bool,
  name: T.string.isRequired,
  usedOnTheSide: T.bool,
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }),
};
const getGenome3dURL = createSelector(
  state => state.settings.genome3d,
  state => state.customLocation.description.entry.accession,
  ({ protocol, hostname, port, root }, accession) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}interpro/ipr/${accession}`,
      query: { rows: 1 },
    });
  },
);
export default loadData(getGenome3dURL)(Genome3dMenuLink);
