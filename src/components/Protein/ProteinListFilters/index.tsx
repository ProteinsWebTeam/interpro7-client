import React from 'react';

import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import FiltersPanel from 'components/FiltersPanel';
import CurationFilter from './CurationFilter';
import TaxonomyFilter from './TaxonomyFilter';
import FragmentFilter from './FragmentFilter';
import MatchPresenceFilter from './MatchPresenceFilter';

export const ProteinListFilters = ({
  hasEntryFilter,
}: {
  hasEntryFilter?: boolean;
}) => (
  <FiltersPanel>
    {!hasEntryFilter && <MatchPresenceFilter label="Matching Entries" />}
    <CurationFilter label="UniProt Curation" />
    <TaxonomyFilter label="Taxonomy" />
    <FragmentFilter label="Sequence Status" />
  </FiltersPanel>
);

const mapStateToProps = createSelector(
  (state: GlobalState) => !!state.customLocation.description.entry.isFilter,
  (hasEntryFilter) => ({ hasEntryFilter }),
);

export default connect(mapStateToProps)(ProteinListFilters);
