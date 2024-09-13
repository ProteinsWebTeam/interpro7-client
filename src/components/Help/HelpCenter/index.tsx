// @flow
import React from 'react';
import { Helmet } from 'react-helmet-async';
import loadable from 'higherOrder/loadable';

import { schemaProcessDataWebPage } from 'schema_org/processors';

const SchemaOrgData = loadable({
  loader: () =>
    // $FlowFixMe
    import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

/*
const f = foundationPartial(ebiGlobalStyles, ipro);
const Tutorials = () => <ContentFromRTD page="tutorials_webinars.rst" />;
const Faqs = () => <ContentFromRTD page="faq.rst" format="faq" />;
const Training = () => <ContentFromRTD page="training.rst" />;
const Game = () => (
  <ContentFromRTD page="protein_families_game.rst" format="faq" />
);*/

import config from 'config';
import Link from 'components/generic/Link';
import Twitter from 'components/Twitter';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

import cssBinder from 'styles/cssBinder';
const css = cssBinder(fonts, local);

const Help = () => {
  return (
    <div className={css('help-flex')}>
      <div className={css('vf-grid', 'vf-grid__col-3', 'help-grid')}>
        <div className={css('flex-box')}>
          <span
            className={css('icon', 'icon-common', 'xl')}
            data-icon="&#xf02d;"
          />{' '}
          <h5>Getting started</h5>
          <li>
            <ul>
              <li>
                <Link
                  href={
                    'https://www.ebi.ac.uk/training/online/courses/interpro-quick-tour/'
                  }
                  className={css('ext')}
                  target="_blank"
                >
                  InterPro quick tour
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.ebi.ac.uk/training/online/courses/pfam-quick-tour/"
                  className={css('ext')}
                  target="_blank"
                >
                  Pfam quick tour
                </Link>
              </li>
            </ul>
          </li>
        </div>
        <div className={css('flex-box')}>
          <span
            className={css('icon', 'icon-common', 'xl')}
            data-icon="&#xf02d;"
          />{' '}
          <h5>Training</h5>
          <li>
            <ul>
              <li>
                <Link
                  href={
                    'https://www.ebi.ac.uk/training/search-results?query=interpro&domain=ebiweb_training&page=1&facets='
                  }
                  className={css('ext')}
                  target="_blank"
                >
                  InterPro
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.ebi.ac.uk/training/search-results?query=pfam&domain=ebiweb_training&page=1&facets="
                  className={css('ext')}
                  target="_blank"
                >
                  Pfam
                </Link>
              </li>
            </ul>
          </li>
        </div>
        <div className={css('flex-box')}>
          <span
            className={css('icon', 'icon-common', 'xl')}
            data-icon="&#xf02d;"
          />{' '}
          <h5>Documentations</h5>
          <li>
            <ul>
              <li>
                <Link to={{ description: { other: ['help', 'faqs'] } }}>
                  InterPro FAQs
                </Link>
              </li>
              <li>
                <Link
                  href={config.root.readthedocs.href}
                  className={css('ext')}
                  target="_blank"
                >
                  InterPro documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://pfam-docs.readthedocs.io/en/latest/"
                  className={css('ext')}
                  target="_blank"
                >
                  Pfam documentation
                </Link>
              </li>
            </ul>
          </li>
        </div>

        <div className={css('flex-box')}>
          <span
            className={css('icon', 'icon-common', 'xl')}
            data-icon="&#xf02d;"
          />{' '}
          <h5>About us</h5>
          <li>
            <ul>
              <li>
                <Link to={{ description: { other: ['about', 'interpro'] } }}>
                  InterPro
                </Link>
              </li>
              <li>
                <Link to={{ description: { other: ['about', 'consortium'] } }}>
                  InterPro consortium
                </Link>
              </li>
              <li>
                <Link to={{ description: { other: ['about', 'team'] } }}>
                  Team
                </Link>
              </li>
            </ul>
          </li>
        </div>
        <div className={css('flex-box')}>
          <span
            className={css('icon', 'icon-common', 'xl')}
            data-icon="&#xf10d;"
          />{' '}
          <h5>How to cite us</h5>
          <ul>
            <li>
              <Link
                href={`${config.root.readthedocs.href}citing.html`}
                className={css('ext')}
                target="_blank"
              >
                Citing InterPro
              </Link>
            </li>
            <li>
              <Link
                href="https://pfam-docs.readthedocs.io/en/latest/citing-pfam.html"
                className={css('ext')}
                target="_blank"
              >
                Citing Pfam
              </Link>
            </li>
          </ul>
        </div>
        <div className={css('flex-box')}>
          <span
            className={css('icon', 'icon-common', 'xl')}
            data-icon="&#xf2fd;"
          />{' '}
          <h5>InterProScan</h5>
          <ul>
            <li>
              <Link
                href="https://interproscan-docs.readthedocs.io/"
                className={css('ext')}
                target="_blank"
              >
                InterProScan documentation
              </Link>
            </li>
            <li>
              <Link
                href="//www.ebi.ac.uk/jdispatcher/docs/"
                className={css('ext')}
                target="_blank"
              >
                Job Dispatcher documentation
              </Link>
            </li>
          </ul>
        </div>

        <div className={css('flex-box')}>
          <span
            className={css('icon', 'icon-common', 'xl')}
            data-icon="&#xf085;"
          />
          <h5>Technical corner</h5>
          <ul>
            <li>
              <Link
                href="          https://github.com/ProteinsWebTeam/interpro7-api/tree/master/docs"
                className={css('ext')}
                target="_blank"
              >
                Programmatic access
              </Link>
            </li>
            <li>
              <Link
                href="https://www.ebi.ac.uk/interpro/api/static_files/swagger/"
                className={css('ext')}
                target="_blank"
              >
                Open API specification
              </Link>
            </li>
            <li>
              <Link
                to={{
                  description: {
                    main: { key: 'result' },
                    result: { type: 'download' },
                  },
                  hash: '/entry/interpro/|json',
                }}
              >
                Code snippet generator
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={css('box-add')}>
        <div className={css('vf-box')}>
          <h3> Links </h3>
        </div>

        <div className={css('vf-box')}>
          <p className={css('help-links')}>InterPro</p>
          <ul className={css('vf-list')}>
            <li>
              <Link
                href="//www.ebi.ac.uk/support/interpro"
                target="_blank"
                withReferrer
              >
                <span
                  className={css('icon', 'icon-common')}
                  data-icon="&#x6e;"
                />{' '}
                Submit a ticket
              </Link>
            </li>
            <li>
              <Twitter />
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/company/interpro-pfam/"
                target="_blank"
                withReferrer
              >
                <span
                  className={css('icon', 'icon-common')}
                  data-icon="&#xf08c;"
                />{' '}
                LinkedIn account
              </Link>
            </li>
          </ul>
        </div>

        <div className={css('vf-box')}>
          <p className={css('help-links')}> Pfam </p>
          <ul className={css('vf-list')}>
            <li>
              <Link
                href="//www.ebi.ac.uk/support/pfam"
                target="_blank"
                withReferrer
              >
                <span
                  className={css('icon', 'icon-common')}
                  data-icon="&#x6e;"
                />{' '}
                Submit a ticket
              </Link>
            </li>
            <li>
              <Twitter handler="PfamDB" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Help;
