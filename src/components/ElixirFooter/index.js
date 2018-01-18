// @flow
import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';

const f = foundationPartial(local);

class ElixirFooter extends PureComponent {
  render() {
    return (
      <div className={f('elixir-ribbon')}>
        <div className={f('row')}>
          <Link href="https://www.elixir-europe.org/about-us/who-we-are/nodes/embl-ebi">
            <div className={f('elixir-logo-kite')} />
            <h5>
              <span className={f('elixir-banner-name')}>This service</span> is
              part of the ELIXIR infrastructure
            </h5>
            <div id="elixir-banner-info">
              <small>
                <span className={f('elixir-banner-description')}>
                  InterPro is an ELIXIR Core Data Resource
                </span>{' '}
                <span className={f('readmore')}>Learn more ›</span>
              </small>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

export default ElixirFooter;
