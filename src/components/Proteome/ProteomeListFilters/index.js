// @flow
import React from 'react';
// import T from 'prop-types';
// import { createSelector } from 'reselect';
// import { connect } from 'react-redux';

// $FlowFixMe
import FiltersPanel from 'components/FiltersPanel';
import IsReferenceFilter from 'components/Proteome/ProteomeListFilters/IsReferenceFilter';

const ProteomeListFilters = () => (
  <FiltersPanel>
    <IsReferenceFilter />
  </FiltersPanel>
);

export default ProteomeListFilters;
