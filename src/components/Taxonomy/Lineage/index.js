import React, { PureComponent } from 'react';
import T from 'prop-types';

import TaxIdOrName from 'components/Taxonomy/TaxIdOrName';

class Lineage extends PureComponent {
  static propTypes = {
    lineage: T.string.isRequired,
    names: T.object,
  };

  render() {
    const lineage = this.props.lineage.trim().split(' ');
    const names = this.props.names;
    return (
      <div>
        Lineage:
        {lineage.map(taxId => (
          <span key={taxId}>
            {' → '}
            <TaxIdOrName accession={taxId} name={names[taxId]} />
          </span>
        ))}
      </div>
    );
  }
}

export default Lineage;
