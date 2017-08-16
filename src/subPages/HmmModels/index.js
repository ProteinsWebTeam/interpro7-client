import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import loadData from 'higherOrder/loadData';
import { stringify as qsStringify } from 'query-string';
import description2path from 'utils/processLocation/description2path';
import Link from 'components/generic/Link';

import HmmModelSection from 'components/Entry/HmmModels';

const HmmModels = ({ data, maintype }) => {
  if (data.loading) return <div>Loading...</div>;
  const temp = data;

  return (
    <div>
      <h1>Subpage HMM</h1>
      <HmmModelSection logo={data.payload} />
    </div>
  );
};

HmmModels.propTypes = {
  data: T.object.isRequired,
};

const getUrlFor = createSelector(
  state => state.settings.api,
  state => state.newLocation.description,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { type, search: _, ..._search } = search;
    // build URL
    _search.annotation = 'logo';
    return `${protocol}//${hostname}:${port}${root}${description2path(
      description,
    ).replace('hmm_models', '')}?${qsStringify(_search)}`;
  },
);

const mapStateToProps = createSelector(
  state => {
    const temp = state;
    return temp;
  },
  mainType => ({ mainType }),
);

export default connect()(
  loadData({
    getUrl: getUrlFor,
  })(HmmModels),
);
