// @flow
import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';
import LazyImage from 'components/LazyImage';

import { foundationPartial } from 'styles/foundation';

import gbc from 'images/thirdparty/gbc-main.svg';

import local from './style.css';
import ebiStyles from 'ebi-framework/css/ebi-global.css';
const f = foundationPartial(local, ebiStyles);

class ElixirFooter extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <div className={f('row', 'columns')}>
        <div className={f('ribbon')}>
          <div>
            <Link
              href="https://www.elixir-europe.org/about-us/who-we-are/nodes/embl-ebi"
              target="_blank"
            >
              <div className={f('stakeholder')}>
                <LazyImage
                  className={f('logo')}
                  alt="Elixir logo"
                  src="//ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.4/images/logos/ELIXIR/elixir-cdr.gif"
                />
                <div className={f('text')}>
                  <span className={f('title')}>
                    This service is part of the ELIXIR infrastructure
                  </span>
                  <br />
                  <small>
                    <span className={f('elixir-banner-description')}>
                      InterPro is an ELIXIR Core Data Resource
                    </span>
                  </small>
                </div>
              </div>
            </Link>
          </div>
          <div>
            <Link
              href="https://globalbiodata.org/scientific-activities/global-core-biodata-resources/"
              target="_blank"
            >
              <div className={f('stakeholder', 'right')}>
                <LazyImage
                  className={f('logo')}
                  alt="Glogal biodata coalition logo"
                  src={gbc}
                />

                <div className={f('text')}>
                  <span className={f('title')}>
                    This service is part of the GBC
                  </span>
                  <br />
                  <small>
                    <span className={f('elixir-banner-description')}>
                      InterPro is a Global Core Biodata Resource
                    </span>
                  </small>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default ElixirFooter;
