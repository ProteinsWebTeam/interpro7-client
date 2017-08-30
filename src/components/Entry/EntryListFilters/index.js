import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { createSelector } from 'reselect';

import FiltersPanel from 'components/FiltersPanel';
import EntryTypeFilter from './EntryTypeFilter';
import IntegratedFilter from './IntegratedFilter';
import SignaturesFilter from './SignaturesFilter';
import GOTermsFilter from './GOTermsFilter';

const EntryListFilter = ({ mainDB }) => (
  <FiltersPanel>
    <EntryTypeFilter label="Entry Type" />
    {mainDB === 'InterPro' ? (
      <SignaturesFilter label="Signatures" />
    ) : (
      <IntegratedFilter label="InterPro State" />
    )}
    <GOTermsFilter label="GO Terms" />
  </FiltersPanel>
);
EntryListFilter.propTypes = {
  mainDB: T.string,
};

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainDB,
  mainDB => ({ mainDB })
);

export default connect(mapStateToProps)(EntryListFilter);
