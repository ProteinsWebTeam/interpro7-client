import React from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import HmmModelSection from 'components/Entry/HmmModels';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

const HMMModelSubPage = ({ data }) => {
  if (data.loading) return <div>Loading...</div>;
  return <HmmModelSection logo={data.payload} />;
};
HMMModelSubPage.propTypes = {
  data: T.object.isRequired,
};

const getUrl = createSelector(
  state => state.settings.api,
  state => state.newLocation.description,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { type, search: _, ..._search } = search;
    // build URL
    _search.annotation = 'logo';
    return `${protocol}//${hostname}:${port}${root}${description2path(
      description
    ).replace('hmm_models', '')}?${qsStringify(_search)}`;
  }
);

export default loadData({ getUrl })(HMMModelSubPage);
