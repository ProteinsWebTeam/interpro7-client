// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

/*:: type Props = {
  taxID: string,
}; */

class Species extends PureComponent /*:: <Props> */ {
  static propTypes = {
    taxID: T.string.isRequired,
  };

  render() {
    const { taxID } = this.props;
    return (
      <div>
        {'Species: '}
        <Link
          to={{
            description: {
              main: { key: 'taxonomy' },
              // TODO: remove stringification of taxID when API returns strings
              taxonomy: { db: 'uniprot', accession: `${taxID}` },
            },
          }}
        >
          {taxID}
        </Link>
      </div>
    );
  }
}

export default Species;
