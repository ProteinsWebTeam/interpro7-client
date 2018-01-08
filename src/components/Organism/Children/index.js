// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import TaxIdOrName from 'components/Organism/TaxIdOrName';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';

const f = foundationPartial(local);

class Children extends PureComponent {
  static propTypes = {
    taxChildren: T.array.isRequired,
    names: T.object,
  };

  render() {
    const { taxChildren, names } = this.props;
    return (
      <div className={f('')}>
        Children:
        <div className={f('list')}>
          {taxChildren.length ? (
            taxChildren.map(taxId => (
              <div key={taxId}>
                <TaxIdOrName accession={taxId} name={names[taxId]} />
              </div>
            ))
          ) : (
            <span> no child</span>
          )}
        </div>
      </div>
    );
  }
}

export default Children;
