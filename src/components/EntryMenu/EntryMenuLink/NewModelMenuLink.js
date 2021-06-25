// @flow
import React from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';
import { createSelector } from 'reselect';
import { format } from 'url';

import { EntryMenuLinkWithoutData } from '.';

const NewModelMenuLink = (
  {
    to,
    exact,
    name,
    usedOnTheSide,
    data: { loading, payload },
  } /*: {to: Object | function, exact: boolean, name: string, usedOnTheSide: boolean, data: {loading: boolean, payload: Object}} */,
) => {
  if (Array.isArray(payload)) {
    const value = payload.length;
    const attrs = { name, value, loading, to, exact, usedOnTheSide };
    return <EntryMenuLinkWithoutData {...attrs} />;
  }
  return null;
};
NewModelMenuLink.propTypes = {
  to: T.oneOfType([T.object, T.func]).isRequired,
  exact: T.bool,
  name: T.string.isRequired,
  usedOnTheSide: T.bool,
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }),
};
const getNewModelURL = createSelector(
  state => state.settings.modelAPI,
  state => state.customLocation.description.protein.accession,
  ({ protocol, hostname, port, root, query }, accession) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}api/prediction/${accession}`,
      query: query
    });
  },
);
export default loadData(getNewModelURL)(NewModelMenuLink);
