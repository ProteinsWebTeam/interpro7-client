import React, { PureComponent } from 'react';
import T from 'prop-types';

import Metadata from 'wrappers/Metadata';
import TaxIdOrName from 'components/Organism/TaxIdOrName';

class Children extends PureComponent {
  static propTypes = {
    taxChildren: T.array.isRequired,
  };

  render() {
    const { taxChildren } = this.props;
    return (
      <ul>
        Children:
        {taxChildren.length
          ? taxChildren.map(taxId =>
              <li key={taxId}>
                <Metadata
                  endpoint={'organism'}
                  db={'taxonomy'}
                  accession={taxId}
                  key={taxId}
                >
                  <TaxIdOrName />
                </Metadata>
              </li>,
            )
          : <li>no child</li>}
      </ul>
    );
  }
}

export default Children;
