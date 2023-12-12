import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import DomainArchitectures from 'components/Entry/DomainArchitectures';

type Props = {
  mainType: string;
  database: string;
};

const DomainArchitectureSubPage = ({ mainType, database }: Props) => {
  return mainType === 'entry' ? (
    <DomainArchitectures database={database} />
  ) : null;
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description.main.key,
  (state: GlobalState) =>
    (
      state.customLocation.description[
        state.customLocation.description.main.key
      ] as EndpointLocation
    ).db,
  (mainType, database) => ({ mainType, database }),
);

export default connect(mapStateToProps)(DomainArchitectureSubPage);
