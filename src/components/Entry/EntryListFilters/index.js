// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { createSelector } from 'reselect';

import FiltersPanel from 'components/FiltersPanel';
import EntryTypeFilter from './EntryTypeFilter';
import IntegratedFilter from './IntegratedFilter';
// $FlowFixMe
import LatestFilter from './LatestFilter';
// import SignaturesFilter from './SignaturesFilter';
import GOTermsFilter from './GOTermsFilter';

export const EntryListFilter = ({ mainDB } /*: {mainDB: string} */) => (
  <FiltersPanel>
    <EntryTypeFilter
      label={`${
        mainDB === 'InterPro' ? 'InterPro' : 'Member Database Entry'
      } Type`}
    />
    {mainDB !== 'InterPro' && <IntegratedFilter label="InterPro State" />}
    {mainDB === 'InterPro' && <GOTermsFilter label="GO Terms" />}
    {mainDB === 'InterPro' && <LatestFilter label="New entries" />}
  </FiltersPanel>
);
EntryListFilter.propTypes = {
  mainDB: T.string,
};

const mapStateToProps = createSelector(
  (state) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  (mainDB) => ({ mainDB }),
);

export default connect(mapStateToProps)(EntryListFilter);
