import React, { useState } from 'react';
import { connect } from 'react-redux';

import { createSelector } from 'reselect';

import FiltersPanel from 'components/FiltersPanel';
import EntryTypeFilter from './EntryTypeFilter';
import IntegratedFilter from './IntegratedFilter';
import LatestFilter from './LatestFilter';
import GOTermsFilter from './GOTermsFilter';
import AIGeneratedFilter from './AIGeneratedFilter';

type Props = { mainDB?: string };
export const EntryListFilter = ({ mainDB }: Props) => {
  return (
    <FiltersPanel>
      <EntryTypeFilter
        label={`${
          mainDB === 'InterPro' ? 'InterPro' : 'Member Database Entry'
        } Type`}
      />
      {mainDB !== 'InterPro' && <IntegratedFilter label="InterPro State" />}
      {mainDB === 'InterPro' && <GOTermsFilter label="GO Terms" />}
      {mainDB === 'InterPro' && <LatestFilter label="New entries" />}
      <AIGeneratedFilter label="Curation status" />
    </FiltersPanel>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[
      state.customLocation.description.main.key as Endpoint
    ],
  (mainEndpoint) => ({ mainDB: mainEndpoint!.db || '' }),
);

export default connect(mapStateToProps)(EntryListFilter);
