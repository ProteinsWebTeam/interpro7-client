// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Metadata from 'wrappers/Metadata';
import TaxIdOrName from 'components/Organism/TaxIdOrName';

/*:: type Props = {
  taxid: number,
}; */

class Species extends PureComponent /*:: <Props> */ {
  static propTypes = {
    taxid: T.number.isRequired,
  };

  render() {
    const { taxid } = this.props;
    return (
      <div>
        {'Species: '}
        <Metadata endpoint="organism" db="taxonomy" accession={taxid}>
          <TaxIdOrName accession={taxid} />
        </Metadata>
      </div>
    );
  }
}

export default Species;
