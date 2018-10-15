import React, { PureComponent } from 'react';
import T from 'prop-types';

import TaxIdOrName from 'components/Taxonomy/TaxIdOrName';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(fonts);

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
        {lineage.map(taxId => (
          <span
            key={taxId}
            className={f('icon', 'icon-common', 'primary')}
            data-icon="&#xf105;"
          >
            {' '}
            <TaxIdOrName accession={taxId} name={names[taxId]} />{' '}
          </span>
        ))}
      </div>
    );
  }
}

export default Lineage;
