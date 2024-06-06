// @flow
import React from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

// $FlowFixMe
import FiltersPanel from 'components/FiltersPanel';
import CurationFilter from './CurationFilter';
// import SizeFilter from './SizeFilter';
import TaxonomyFilter from './TaxonomyFilter';
import FragmentFilter from './FragmentFilter';
import MatchPresenceFilter from './MatchPresenceFilter';

export const ProteinListFilters = (
  { hasEntryFilter } /*: {hasEntryFilter: boolean} */,
) => (
  <FiltersPanel>
    {!hasEntryFilter && <MatchPresenceFilter label="Matching Entries" />}
    <CurationFilter label="UniProt Curation" />
    <TaxonomyFilter label="Taxonomy" />
    {/* <SizeFilter label="Protein Size" />*/}
    <FragmentFilter label="Sequence Status" />
  </FiltersPanel>
);
ProteinListFilters.propTypes = {
  hasEntryFilter: T.bool,
};

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.entry.isFilter,
  (hasEntryFilter) => ({ hasEntryFilter }),
);

export default connect(mapStateToProps)(ProteinListFilters);
