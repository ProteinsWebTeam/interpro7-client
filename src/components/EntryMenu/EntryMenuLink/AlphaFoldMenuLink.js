// @flow
import React from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';

import { EntryMenuLinkWithoutData } from '.';
// $FlowFixMe
import { getAlphaFoldPredictionURL } from 'components/AlphaFold/selectors';

const AlphaFoldMenuLink = (
  {
    to,
    exact,
    name,
    usedOnTheSide,
    collapsed,
    data: { loading, payload },
  } /*: {to: Object | function, exact: boolean, name: string, usedOnTheSide: boolean, collapsed: boolean, data: {loading: boolean, payload: Array<Object>|Object}} */,
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
    payload: T.oneOfType([T.object, T.array]),
  }),
  collapsed: T.bool,
};

export default loadData(getAlphaFoldPredictionURL)(AlphaFoldMenuLink);
