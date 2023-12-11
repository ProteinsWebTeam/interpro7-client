// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// $FlowFixMe
import DomainsOnProtein from 'components/Related/DomainsOnProtein';
// $FlowFixMe
import DomainArchitectures from 'components/Entry/DomainArchitectures';
import Loading from 'components/SimpleCommonComponents/Loading';

/*:: type Props = {
  data: Object,
  mainType: string,
  database: string,
}; */

class DomainArchitectureSubPage extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.object.isRequired,
    mainType: T.string.isRequired,
    database: T.string.isRequired,
  };

  render() {
    const { data, mainType, database } = this.props;
    if (data.loading) return <Loading />;
    return (
      <>
        {mainType === 'entry' && (
          <DomainArchitectures mainData={data} database={database} />
        )}
        {mainType === 'protein' && <DomainsOnProtein mainData={data} />}
      </>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.main.key,
  (state) =>
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  (mainType, database) => ({ mainType, database }),
);

export default connect(mapStateToProps)(DomainArchitectureSubPage);
