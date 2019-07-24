// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import TaxIdOrName from 'components/Taxonomy/TaxIdOrName';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(fonts);

/*:: type Props = {
  lineage: string,
  names: Object,
  className?: ?string,
}*/

class Lineage extends PureComponent /*:: <Props> */ {
  static propTypes = {
    lineage: T.string.isRequired,
    names: T.object,
    className: T.string,
  };

  render() {
    const lineage = this.props.lineage.trim().split(' ');
    const { names, className } = this.props;
    return (
      <div className={className}>
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
