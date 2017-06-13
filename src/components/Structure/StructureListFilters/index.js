import React from 'react';
// import T from 'prop-types';
import {connect} from 'react-redux';

import {createSelector} from 'reselect';

import FiltersPanel from 'components/FiltersPanel';
import ExperimentTypeFilter from './ExperimentTypeFilter';
// import LengthFilter from './LengthFilter';
// import TaxonomyFilter from './TaxonomyFilter';

const StructureListFilters = () => (
  <FiltersPanel>
    <ExperimentTypeFilter label="Experiment Type" />
    {/* <TaxonomyFilter label="Taxonomy" />*/}
    {/* <LengthFilter label="Protein Length"/>*/}
  </FiltersPanel>
);
const mapStateToProps = createSelector(
  state => state.location.pathname,
  (pathname) => ({pathname})
);

// ProteinListFilters.propTypes = {
//   pathname: T.string.isRequired,
// };

export default connect(mapStateToProps)(StructureListFilters);
