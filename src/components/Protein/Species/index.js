// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

/*:: type Props = {
  taxID: string,
 fullName: string,
}; */

class Species extends PureComponent /*:: <Props> */ {
  static propTypes = {
    taxID: T.string.isRequired,
    fullName: T.string,
  };

  render() {
    const { taxID, fullName } = this.props;
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
          {fullName}
        </Link>
      </div>
    );
  }
}

export default Species;
