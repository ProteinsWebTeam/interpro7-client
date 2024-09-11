// @flow
import React, { useState } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';

// $FlowFixMe
import descriptionToPath from 'utils/processDescription/descriptionToPath';
// $FlowFixMe
import Related from 'components/Related';
import { Object } from 'core-js';

const _AccessionSearch = ({ data, onSearchComplete }) => {
  onSearchComplete(data && !data.loading && data.payload);
  return null;
};

const getURLFromState = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, { search }) => {
    const filters = Object.entries(description).filter(([_, v]) => v.isFilter);
    if (filters.length !== 1) return;
    const [endpoint, filter] = filters[0];
    const desc = {
      main: { key: endpoint },
      [endpoint]: {
        ...filter,
        accession: search,
        isFilter: false,
      },
      [description.main.key]: {
        ...description[description.main.key],
        isFilter: true,
      },
    };
    try {
      return format({
        protocol,
        hostname,
        port,
        pathname: root + descriptionToPath(desc),
      });
    } catch {
      return;
    }
  },
);
const AccessionSearch = loadData(getURLFromState)(_AccessionSearch);

const ListSubPage = ({ data, search }) => {
  const [accSearch, setAccSearch] = useState(null);
  const searchTerm = search && search.search;
  return (
    <>
      {searchTerm && <AccessionSearch onSearchComplete={setAccSearch} />}
      <Related data={data} accessionSearch={searchTerm && accSearch} />
    </>
  );
};
ListSubPage.propTypes = {
  data: dataPropType.isRequired,
  search: T.shape({
    search: T.string,
  }),
};
const mapStateToProps = createSelector(
  (state) => state.customLocation.search,
  (search) => ({ search }),
);
export default connect(mapStateToProps)(ListSubPage);
