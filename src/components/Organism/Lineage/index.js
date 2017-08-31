import React, { PureComponent } from 'react';
import T from 'prop-types';

import Metadata from 'wrappers/Metadata';
import TaxIdOrName from 'components/Organism/TaxIdOrName';

class Lineage extends PureComponent {
  static propTypes = {
    lineage: T.string.isRequired,
  };

  render() {
    const lineage = this.props.lineage.trim().split(' ');
    return (
      <div>
        Lineage:
        {lineage.map(taxId => (
          <span key={taxId}>
            {' → '}
            <Metadata
              endpoint={'organism'}
              db={'taxonomy'}
              accession={taxId}
              key={taxId}
            >
              <TaxIdOrName accession={taxId} />
            </Metadata>
          </span>
        ))}
      </div>
    );
  }
}

export default Lineage;
