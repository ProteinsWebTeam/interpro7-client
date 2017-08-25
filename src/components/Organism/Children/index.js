import React, { PureComponent } from 'react';
import T from 'prop-types';

import Metadata from 'wrappers/Metadata';
import TaxIdOrName from 'components/Organism/TaxIdOrName';

class Children extends PureComponent {
  static propTypes = {
    children: T.array.isRequired,
  };

  render() {
    const { children } = this.props;
    return (
      <ul>
        Children:
        {children.length
          ? children.map(taxId =>
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
