// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

/*:: type Props = {
  accession: string | number,
  data?: {
    payload: ?{
      metadata : ?{
        name: ?{
          name: ?string,
        },
      },
    },
  },
  element?: any,
  name: {
    short: string
  }
}; */

class TaxIdOrName extends PureComponent /*:: <Props> */ {
  static propTypes = {
    accession: T.oneOfType([T.string, T.number]),
    data: T.object,
    element: T.any,
    name: T.shape({
      short: T.string,
    }),
  };

  render() {
    const { accession, data, name, element: Element } = this.props;
    const displayedText =
      (data &&
        data.payload &&
        data.payload.metadata &&
        data.payload.metadata.name &&
        data.payload.metadata.name.name) ||
      (name && name.short) ||
      accession;
    if (Element) {
      return <Element>{displayedText}</Element>;
    }
    return (
      <Link
        to={{
          description: {
            main: { key: 'taxonomy' },
            taxonomy: { db: 'uniprot', accession: accession.toString() },
          },
        }}
      >
        {displayedText}
      </Link>
    );
  }
}

export default TaxIdOrName;
