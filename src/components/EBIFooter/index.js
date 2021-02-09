// @flow
import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts);

class EBIFooter extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <div id={f('global-footer')} className={f('global-footer')}>
        <nav
          id={f('global-nav-expanded')}
          className={f('global-nav-expanded', 'row')}
        >
          <div className={f('columns', 'small-12')}>
            <h4 className={f('inline-block')}>
              <Link href="//www.ebi.ac.uk" title="EMBL-EBI">
                EMBL-EBI
              </Link>
            </h4>
            <span className={f('small', 'inline-block', 'padding-left-large')}>
              <Link className={f('readmore')} href="//intranet.ebi.ac.uk">
                <span className={f('icon', 'icon-functional')} data-icon="L" />{' '}
                Intranet for staff
              </Link>
            </span>
          </div>
          <div className={f('medium-up-5', 'small-up-2')}>
            <div className={f('column')}>
              <h5 className={f('research')}>
                <Link href="//www.ebi.ac.uk/services">Services</Link>
              </h5>
              <ul>
                <li className={f('first')}>
                  <Link href="//www.ebi.ac.uk/services">By topic</Link>
                </li>
                <li>
                  <Link href="//www.ebi.ac.uk/services/all">By name (A-Z)</Link>
                </li>
                <li className={f('last')}>
                  <Link href="//www.ebi.ac.uk/support">Help &amp; Support</Link>
                </li>
              </ul>
            </div>
            <div className={f('column')}>
              <h5 className={f('research')}>
                <a href="//www.ebi.ac.uk/research">Research</a>
              </h5>
              <ul>
                <li>
                  <Link href="//www.ebi.ac.uk/research/publications">
                    Publications
                  </Link>
                </li>
                <li>
                  <Link href="//www.ebi.ac.uk/research/groups">
                    Research groups
                  </Link>
                </li>
                <li className={f('last')}>
                  <Link href="//www.ebi.ac.uk/research/postdocs">Postdocs</Link>{' '}
                  &amp; <Link href="//www.ebi.ac.uk/research/eipp">PhDs</Link>
                </li>
              </ul>
            </div>
            <div className={f('column')}>
              <h5 className={f('training')}>
                <Link href="//www.ebi.ac.uk/training">Training</Link>
              </h5>
              <ul>
                <li>
                  <Link href="//www.ebi.ac.uk/training/handson">
                    Train at EBI
                  </Link>
                </li>
                <li>
                  <Link href="//www.ebi.ac.uk/training/roadshow">
                    Train outside EBI
                  </Link>
                </li>
                <li>
                  <Link href="//www.ebi.ac.uk/training/online">
                    Train online
                  </Link>
                </li>
                <li className={f('last')}>
                  <Link href="//www.ebi.ac.uk/training/contact-us">
                    Contact organisers
                  </Link>
                </li>
              </ul>
            </div>
            <div className={f('column')}>
              <h5 className={f('industry')}>
                <Link href="//www.ebi.ac.uk/industry">Industry</Link>
              </h5>
              <ul>
                <li>
                  <Link href="//www.ebi.ac.uk/industry/private">
                    Members Area
                  </Link>
                </li>
                <li>
                  <Link href="//www.ebi.ac.uk/industry/workshops">
                    Workshops
                  </Link>
                </li>
                <li>
                  <Link href="//www.ebi.ac.uk/industry/sme-forum">
                    SME Forum
                  </Link>
                </li>
                <li className={f('last')}>
                  <Link href="//www.ebi.ac.uk/industry/contact">
                    Contact Industry programme
                  </Link>
                </li>
              </ul>
            </div>
            <div className={f('column')}>
              <h5 className={f('about')}>
                <Link href="//www.ebi.ac.uk/about">About</Link>
              </h5>

              <ul>
                <li>
                  <Link href="//www.ebi.ac.uk/about/contact">Contact us</Link>
                </li>
                <li>
                  <Link href="//www.ebi.ac.uk/about/events">Events</Link>
                </li>
                <li>
                  <Link
                    href="//www.ebi.ac.uk/about/jobs"
                    title="Jobs, postdocs, PhDs..."
                  >
                    Jobs
                  </Link>
                </li>
                <li className={f('first')}>
                  <Link href="//www.ebi.ac.uk/about/news">News</Link>
                </li>
                <li>
                  <Link href="//www.ebi.ac.uk/about/people">
                    People &amp; groups
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <section
          id={f('ebi-footer-meta')}
          className={f('ebi-footer-meta', 'row')}
        >
          <div className={f('columns')}>
            <p className={f('address')}>
              EMBL-EBI, Wellcome Genome Campus, Hinxton, Cambridgeshire, CB10
              1SD, UK. +44 (0)1223 49 44 44
            </p>
            <p className={f('legal')}>
              Copyright © EMBL-EBI {new Date().getFullYear()} | EMBL-EBI
              is&nbsp;
              <Link href="//www.embl.org/" rel="noopener">
                part of the European Molecular Biology Laboratory
              </Link>{' '}
              |{' '}
              <Link href="//www.ebi.ac.uk/about/terms-of-use">
                Terms of use
              </Link>
            </p>
          </div>
        </section>
      </div>
    );
  }
}

export default EBIFooter;
