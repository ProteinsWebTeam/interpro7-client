import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import DomainsOnProtein from 'components/Related/DomainsOnProtein';
import DomainArchitectures from 'components/Entry/DomainArchitectures';

const DomainArchitectureSubPage = ({ data, mainType }) => {
  /*: {data: Object, location: {pathname: string}, mainType: string} */
  if (data.loading) return <div>Loading...</div>;
  return (
    <div>
      <h3>{data.payload.metadata.accession}</h3>
      {mainType === 'entry' && <DomainArchitectures mainData={data} />}
      {mainType === 'protein' && <DomainsOnProtein mainData={data} />}
    </div>
  );
};
DomainArchitectureSubPage.propTypes = {
  data: T.object.isRequired,
  mainType: T.string,
};

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainType,
  mainType => ({ mainType })
);

export default connect(mapStateToProps)(DomainArchitectureSubPage);
