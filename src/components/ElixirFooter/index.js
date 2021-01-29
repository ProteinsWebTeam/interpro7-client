// @flow
import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';
import LazyImage from 'components/LazyImage';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import ebiStyles from 'ebi-framework/css/ebi-global.css';
const f = foundationPartial(local, ebiStyles);

class ElixirFooter extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <div className={f('elixir-ribbon')}>
        <div className={f('row')}>
          <div className={f('columns')}>
            <Link
              href="https://www.elixir-europe.org/about-us/who-we-are/nodes/embl-ebi"
              target="_blank"
            >
              <LazyImage
                className={f('elixir-logo-kite')}
                alt="Elixir logo"
                src="//ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.4/images/logos/ELIXIR/elixir-cdr.gif"
              />
              {
                // replace H5 by span as H5 creates a block with link
              }
              <span className={f('elixir-title')}>
                This service is part of the ELIXIR infrastructure
              </span>
              <br />
              {
                // remove div as it creates a block with link
                // <div>
              }
              <small>
                <span className={f('elixir-banner-description')}>
                  InterPro is an ELIXIR Core Data Resource
                </span>{' '}
                <span className={f('readmore')}>Learn more ›</span>
              </small>
              {
                // </div>
              }
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default ElixirFooter;
