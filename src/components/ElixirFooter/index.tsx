import React from 'react';

import Link from 'components/generic/Link';
import LazyImage from 'components/LazyImage';
import gbc from 'images/thirdparty/gbc-main.png';
import cssBinder from 'styles/cssBinder';
import local from './style.css';
const css = cssBinder(local);

const ElixirFooter = () => {
  return (
    <div className={css('vf-u-fullbleed')}>
      <div className="vf-footer__inner">
        <div className="vf-grid vf-grid__col-2">
          <div className="vf-banner">
            <div className="vf-flag vf-flag--middle vf-flag--400">
              <div className="vf-flag__media">
                <LazyImage
                  src="//ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.4/images/logos/ELIXIR/elixir-cdr.gif"
                  className={css('logo')}
                  alt="Elixir logo"
                />
              </div>
              <div className="vf-flag__body">
                <h4 className="vf-banner__text--lg">
                  <Link href="//www.elixir-europe.org/" className="vf-link">
                    InterPro is part of the ELIXIR infrastructure
                  </Link>
                </h4>
                <p className="vf-banner__text">
                  InterPro is an ELIXIR Core Data Resource.{' '}
                  <Link
                    href={
                      '//www.elixir-europe.org/platforms/data/core-data-resources'
                    }
                    className={css('readmore', 'vf-link')}
                  >
                    Learn more ›
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="vf-banner">
            <div className="vf-flag vf-flag--middle vf-flag--400">
              <div className="vf-flag__body">
                <h4 className="vf-banner__text--lg">
                  <Link href="//globalbiodata.org/" className="vf-link">
                    InterPro is part of the Global Biodata Coalition
                  </Link>
                </h4>
                <p className="vf-banner__text">
                  InterPro is a Global Core Biodata Resource.{' '}
                  <Link
                    href={
                      '//globalbiodata.org/what-we-do/global-core-biodata-resources/'
                    }
                    className={css('readmore', 'vf-link')}
                  >
                    Learn more ›
                  </Link>
                </p>
              </div>
              <div className="vf-flag__media">
                <img
                  src={gbc}
                  className={css('logo')}
                  alt="Glogal biodata coalition logo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElixirFooter;
