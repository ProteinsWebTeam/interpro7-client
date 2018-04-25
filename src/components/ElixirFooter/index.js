import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';
import LazyImage from 'components/LazyImage';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';

const f = foundationPartial(local);

class ElixirFooter extends PureComponent {
  render() {
    return (
      <div className={f('elixir-ribbon')}>
        <div className={f('row')}>
          <Link
            href="https://www.elixir-europe.org/about-us/who-we-are/nodes/embl-ebi"
            target="_blank"
          >
            <LazyImage
              className={f('elixir-logo-kite')}
              alt="Elixir logo"
              src="//ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.2/images/logos/assorted/elixir_kitemark-60px.png"
            />
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
