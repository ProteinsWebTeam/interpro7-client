// @flow
import React from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';
import { createSelector } from 'reselect';
import { format } from 'url';

import { EntryMenuLinkWithoutData } from '.';

const AlphaFoldMenuLink = (
  {
    to,
    exact,
    name,
    usedOnTheSide,
    collapsed,
    data: { loading, payload },
  } /*: {to: Object | function, exact: boolean, name: string, usedOnTheSide: boolean, collapsed: boolean, data: {loading: boolean, payload: Array<Object>}} */,
) => {
  if (Array.isArray(payload) && payload.length === 1) {
    const value = payload.length;
    const attrs = { name, value, loading, to, exact, usedOnTheSide, collapsed };
    return <EntryMenuLinkWithoutData {...attrs} />;
  }
  return null;
};
AlphaFoldMenuLink.propTypes = {
  to: T.oneOfType([T.object, T.func]).isRequired,
  exact: T.bool,
  name: T.string.isRequired,
  usedOnTheSide: T.bool,
  data: T.shape({
    loading: T.bool,
    payload: T.array,
  }),
  collapsed: T.bool,
};

const getAlphaFoldURL = createSelector(
  (state) => state.settings.alphafold,
  (state) => state.customLocation.description.protein.accession,
  ({ protocol, hostname, port, root, query }, accession) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}api/prediction/${accession}`,
      query: query,
    });
  },
);
export default loadData(getAlphaFoldURL)(AlphaFoldMenuLink);
