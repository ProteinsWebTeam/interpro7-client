// @flow
import React from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import FiltersPanel from 'components/FiltersPanel';
import CurationFilter from './CurationFilter';
import SizeFilter from './SizeFilter';
import TaxonomyFilter from './TaxonomyFilter';
import MatchPresenceFilter from './MatchPresenceFilter';

const ProteinListFilters = ({ hasEntryFilter }) => (
  <FiltersPanel>
    {!hasEntryFilter && <MatchPresenceFilter label="Matching Entries" />}
    <CurationFilter label="UniProt Curation" />
    <TaxonomyFilter label="Taxonomy" />
    <SizeFilter label="Protein Size" />
  </FiltersPanel>
);
ProteinListFilters.propTypes = {
  hasEntryFilter: T.bool,
};

const mapStateToProps = createSelector(
  state => state.customLocation.description.entry.isFilter,
  hasEntryFilter => ({ hasEntryFilter }),
);

export default connect(mapStateToProps)(ProteinListFilters);
