import React, { PureComponent } from 'react';
import T from 'prop-types';

import TaxIdOrName from 'components/Organism/TaxIdOrName';

class Children extends PureComponent {
  static propTypes = {
    taxChildren: T.array.isRequired,
    names: T.object,
  };

  render() {
    const { taxChildren, names } = this.props;
    return (
      <ul>
        Children:
        {taxChildren.length ? (
          taxChildren.map(taxId => (
            <li key={taxId}>
              <TaxIdOrName accession={taxId} name={names[taxId]} />
            </li>
          ))
        ) : (
          <li>no child</li>
        )}
      </ul>
    );
  }
}

export default Children;
