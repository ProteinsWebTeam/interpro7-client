import React from 'react';
// import T from 'prop-types';
import {connect} from 'react-redux';

import {createSelector} from 'reselect';

import FiltersPanel from 'components/FiltersPanel';
import CurationFilter from './CurationFilter';
import LengthFilter from './LengthFilter';
import TaxonomyFilter from './TaxonomyFilter';

const ProteinListFilters = () => (
  <FiltersPanel>
    <CurationFilter label="Integration" />
    <TaxonomyFilter label="Taxonomy" />
    <LengthFilter label="Protein Length"/>
  </FiltersPanel>
);
const mapStateToProps = createSelector(
  state => state.location.pathname,
  (pathname) => ({pathname})
);

// ProteinListFilters.propTypes = {
//   pathname: T.string.isRequired,
// };

export default connect(mapStateToProps)(ProteinListFilters);
