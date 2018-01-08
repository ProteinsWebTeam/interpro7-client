// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';

class IPScanResult extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
  };

  render() {
    const { data: { payload } } = this.props;
    return (
      <div>
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
  state => state.customLocation.description.job.accession,
  ({ protocol, hostname, port, root }, accession) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/result/${accession}/json`,
    }),
);

export default loadData(mapStateToUrl)(IPScanResult);
