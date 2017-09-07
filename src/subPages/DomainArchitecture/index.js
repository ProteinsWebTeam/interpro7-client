import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import DomainsOnProtein from 'components/Related/DomainsOnProtein';
import DomainArchitectures from 'components/Entry/DomainArchitectures';

/*:: type Props = {
  data: Object,
  mainType: string,
}; */

class DomainArchitectureSubPage extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.object.isRequired,
    mainType: T.string.isRequired,
  };

  render() {
    const { data, mainType } = this.props;
    if (data.loading) return <div>Loading…</div>;
    return (
      <div>
        <h3>{data.payload.metadata.accession}</h3>
        {mainType === 'entry' && <DomainArchitectures mainData={data} />}
        {mainType === 'protein' && <DomainsOnProtein mainData={data} />}
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainType,
  mainType => ({ mainType })
);

export default connect(mapStateToProps)(DomainArchitectureSubPage);
