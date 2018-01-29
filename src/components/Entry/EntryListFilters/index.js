// @flow
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
    <EntryTypeFilter
      label={`${mainDB === 'InterPro' ? 'InterPro' : 'Member Database'} Type`}
    />
    {mainDB === 'InterPro' ? (
      <SignaturesFilter label="Integrated Database" />
    ) : (
      <IntegratedFilter label="InterPro State" />
    )}
    {
      // TODO re-insert GO terms - filter for Member databases when data available
    }
    {mainDB === 'InterPro' ? (
      <GOTermsFilter label="GO Terms" />
    ) : (
      <span label="" />
    )}
  </FiltersPanel>
);
EntryListFilter.propTypes = {
  mainDB: T.string,
};

const mapStateToProps = createSelector(
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  mainDB => ({ mainDB }),
);

export default connect(mapStateToProps)(EntryListFilter);
