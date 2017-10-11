import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import T from 'prop-types';
import { format } from 'url';

import loadData from 'higherOrder/loadData';

class IPScanResult extends PureComponent {
  static propTypes = {
    mainAccession: T.string.isRequired,
  };

  render() {
    const { mainAccession, data: { payload } } = this.props;
    return (
      <div>
        {mainAccession}
        {payload && (
          <ul>
            {payload[0].matches.map((match, i) => (
              <pre key={i}>{JSON.stringify(match, null, 2)}</pre>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

const mapStateToUrl = createSelector(
  state => state.settings.ipScan,
  state => state.newLocation.description.mainAccession,
  ({ protocol, hostname, port, root }, mainAccession) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/result/${mainAccession}/json`,
    }),
);

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainAccession,
  mainAccession => ({ mainAccession }),
);

export default loadData(mapStateToUrl)(connect(mapStateToProps)(IPScanResult));
