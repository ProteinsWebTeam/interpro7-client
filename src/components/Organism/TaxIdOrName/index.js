import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

class TaxIdOrName extends PureComponent {
  static propTypes = {
    accession: T.oneOfType([T.string, T.number]),
    data: T.object,
  };

  render() {
    const { accession, data } = this.props;
    const displayedText =
      (data &&
        data.payload &&
        data.payload.metadata &&
        data.payload.metadata.name &&
        data.payload.metadata.name.name) ||
      accession;
    const newTo = {
      description: {
        mainType: 'organism',
        mainDB: 'taxonomy',
        mainAccession: accession.toString(),
      },
    };
    return <Link newTo={newTo}>{displayedText}</Link>;
  }
}

export default TaxIdOrName;
