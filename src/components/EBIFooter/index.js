// @flow
import React from 'react';

import { foundationPartial } from 'styles/foundation';
import styles from './style.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import interproTheme from 'styles/theme-interpro.css';
const styleBundle = foundationPartial(
  styles,
  fonts,
  interproTheme,
  ebiGlobalStyles,
);

const EBIFooter = () =>
  <footer>
    <div id={styleBundle('global-footer')}>
      <nav
        id={styleBundle('global-nav-expanded')}
        className={styleBundle('row')}
      >
        <div
          className={styleBundle({
            columns: 'true',
            'small-6': 'true',
            'medium-2': 'true',
          })}
        >
          <a href="//www.ebi.ac.uk" title="EMBL-EBI" rel="noopener">
            <span className={styleBundle('ebi-logo')} />
          </a>
          <ul />
        </div>
        <div
          className={styleBundle({
            columns: 'true',
            'small-6': 'true',
            'medium-2': 'true',
          })}
        >
          <h5 className={styleBundle('services')}>
            <a
              className={styleBundle('services-color')}
              href="//www.ebi.ac.uk/services"
              rel="noopener"
            >
              Services
            </a>
          </h5>
          <ul>
            <li className={styleBundle('first')}>
              <a href="//www.ebi.ac.uk/services" rel="noopener">
                By topic
              </a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/services/all" rel="noopener">
                By name (A-Z)
              </a>
            </li>
            <li className={styleBundle('last')}>
              <a href="//www.ebi.ac.uk/support" rel="noopener">
                Help & Support
              </a>
            </li>
          </ul>
        </div>

        <div
          className={styleBundle({
            columns: 'true',
            'small-6': 'true',
            'medium-2': 'true',
          })}
        >
          <h5 className={styleBundle('research')}>
            <a
              className={styleBundle('research-color')}
              href="//www.ebi.ac.uk/research"
              rel="noopener"
            >
              Research
            </a>
          </h5>
          <ul>
            <li>
              <a href="//www.ebi.ac.uk/research/publications" rel="noopener">
                Publications
              </a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/research/groups" rel="noopener">
                Research groups
              </a>
            </li>
            <li className={styleBundle('last')}>
              <a href="//www.ebi.ac.uk/research/postdocs" rel="noopener">
                Postdocs
              </a>
              &nbsp;&&nbsp;
              <a href="//www.ebi.ac.uk/research/eipp" rel="noopener">
                PhDs
              </a>
            </li>
          </ul>
        </div>

        <div
          className={styleBundle({
            columns: 'true',
            'small-6': 'true',
            'medium-2': 'true',
          })}
        >
          <h5 className={styleBundle('training')}>
            <a
              className={styleBundle('training-color')}
              href="//www.ebi.ac.uk/training"
              rel="noopener"
            >
              Training
            </a>
          </h5>
          <ul>
            <li>
              <a href="//www.ebi.ac.uk/training/handson" rel="noopener">
                Train at EBI
              </a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/training/roadshow" rel="noopener">
                Train outside EBI
              </a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/training/online" rel="noopener">
                Train online
              </a>
            </li>
            <li className={styleBundle('last')}>
              <a href="//www.ebi.ac.uk/training/contact-us" rel="noopener">
                Contact organisers
              </a>
            </li>
          </ul>
        </div>

        <div
          className={styleBundle({
            columns: 'true',
            'small-6': 'true',
            'medium-2': 'true',
          })}
        >
          <h5 className={styleBundle('industry')}>
            <a
              className={styleBundle('industry-color')}
              href="//www.ebi.ac.uk/industry"
              rel="noopener"
            >
              Industry
            </a>
          </h5>
          <ul>
            <li>
              <a href="//www.ebi.ac.uk/industry/private" rel="noopener">
                Members Area
              </a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/industry/workshops" rel="noopener">
                Workshops
              </a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/industry/sme-forum" rel="noopener">
                <abbr title="Small Medium Enterprise">SME</abbr> Forum
              </a>
            </li>
            <li className={styleBundle('last')}>
              <a href="//www.ebi.ac.uk/industry/contact" rel="noopener">
                Contact Industry programme
              </a>
            </li>
          </ul>
        </div>

        <div
          className={styleBundle({
            columns: 'true',
            'small-6': 'true',
            'medium-2': 'true',
          })}
        >
          <h5 className={styleBundle('about')}>
            <a
              className={styleBundle('ebi-color')}
              href="//www.ebi.ac.uk/about"
              rel="noopener"
            >
              About EMBL-EBI
            </a>
          </h5>
          <ul>
            <li>
              <a href="//www.ebi.ac.uk/about/contact" rel="noopener">
                Contact us
              </a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/about/events" rel="noopener">
                Events
              </a>
            </li>
            <li>
              <a
                href="//www.ebi.ac.uk/about/jobs"
                title="Jobs, postdocs, PhDs…"
                rel="noopener"
              >
                Jobs
              </a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/about/news" rel="noopener">
                News
              </a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/about/people" rel="noopener">
                People & groups
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <section
        id={styleBundle('ebi-footer-meta')}
        className={styleBundle('row')}
      >
        <div className={styleBundle('columns')}>
          <p className={styleBundle('address')}>
            EMBL-EBI, Wellcome Genome Campus, Hinxton, Cambridgeshire, CB10 1SD,
            UK. +44 (0)1223 49 44 44
          </p>
          <p className={styleBundle('legal')}>
            Copyright © EMBL-EBI 2016 | EMBL-EBI is&nbsp;
            <a href="http://www.embl.org/" rel="noopener">
              part of the European Molecular Biology Laboratory
            </a>{' '}
            |{' '}
            <a href="//www.ebi.ac.uk/about/terms-of-use" rel="noopener">
              Terms of use
            </a>
            <a
              className={styleBundle('readmore', 'float-right')}
              href="http://intranet.ebi.ac.uk"
              rel="noopener"
            >
              Intranet
            </a>
          </p>
        </div>
      </section>
    </div>
  </footer>;

export default EBIFooter;
