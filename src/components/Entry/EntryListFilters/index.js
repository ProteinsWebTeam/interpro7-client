import React, {Component} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';

import {createSelector} from 'reselect';

import FiltersPanel from 'components/FiltersPanel';
import EntryTypeFilter from './EntryTypeFilter';
import IntegratedFilter from './IntegratedFilter';
import SignaturesFilter from './SignaturesFilter';

const EntryListFilter = ({pathname}) => (
  <FiltersPanel>
    <EntryTypeFilter
      label="Entry Type"
    />
    {
      pathname.indexOf('interpro') < 0 ?
        <IntegratedFilter label="InterPro State"/> :
        <SignaturesFilter label="Signatures in"/>
    }
  </FiltersPanel>
);
const mapStateToProps = createSelector(
  state => state.location.pathname,
  (pathname) => ({pathname})
);

EntryListFilter.propTypes = {
  pathname: T.string.isRequired,
};

export default connect(mapStateToProps)(EntryListFilter);
