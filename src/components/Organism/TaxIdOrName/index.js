import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

/*:: type Props = {
  accession: string | number,
  data: {
    payload: ?{
      metadata : ?{
        name: ?{
          name: ?string,
        },
      },
    },
  },
  element?: any,
}; */

class TaxIdOrName extends PureComponent /*:: <Props> */ {
  static propTypes = {
    accession: T.oneOfType([T.string, T.number]),
    data: T.object,
    element: T.any,
  };

  render() {
    const { accession, data, element: Element } = this.props;
    const displayedText =
      (data &&
        data.payload &&
        data.payload.metadata &&
        data.payload.metadata.name &&
        data.payload.metadata.name.name) ||
      accession;
    if (Element) {
      return <Element>{displayedText}</Element>;
    }
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
