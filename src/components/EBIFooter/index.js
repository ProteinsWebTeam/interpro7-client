import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts);

class EBIFooter extends PureComponent {
  render() {
    return (
      <div id={f('global-footer')} className={f('global-footer')}>
        <nav
          id={f('global-nav-expanded')}
          className={f('global-nav-expanded', 'row')}
        >
          <div
            className={f({
              columns: 'true',
              'small-6': 'true',
              'medium-2': 'true',
            })}
          >
            <Link href="//www.ebi.ac.uk" title="EMBL-EBI">
              <span className={f('ebi-logo')} />
            </Link>
            <ul />
          </div>
          <div
            className={f({
              columns: 'true',
              'small-6': 'true',
              'medium-2': 'true',
            })}
          >
            <h5 className={f('services')}>
              <Link
                className={f('services-color')}
                href="//www.ebi.ac.uk/services"
              >
                Services
              </Link>
            </h5>
            <ul>
              <li className={f('first')}>
                <Link href="//www.ebi.ac.uk/services">By topic</Link>
              </li>
              <li>
                <Link href="//www.ebi.ac.uk/services/all">By name (A-Z)</Link>
              </li>
              <li className={f('last')}>
                <Link href="//www.ebi.ac.uk/support">Help & Support</Link>
              </li>
            </ul>
          </div>

          <div
            className={f({
              columns: 'true',
              'small-6': 'true',
              'medium-2': 'true',
            })}
          >
            <h5 className={f('research')}>
              <Link
                className={f('research-color')}
                href="//www.ebi.ac.uk/research"
              >
                Research
              </Link>
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
                <Link href="//www.ebi.ac.uk/research/postdocs">Postdocs</Link>
                &nbsp;&&nbsp;
                <Link href="//www.ebi.ac.uk/research/eipp">PhDs</Link>
              </li>
            </ul>
          </div>

          <div
            className={f({
              columns: 'true',
              'small-6': 'true',
              'medium-2': 'true',
            })}
          >
            <h5 className={f('training')}>
              <Link
                className={f('training-color')}
                href="//www.ebi.ac.uk/training"
              >
                Training
              </Link>
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
                <Link href="//www.ebi.ac.uk/training/online">Train online</Link>
              </li>
              <li className={f('last')}>
                <Link href="//www.ebi.ac.uk/training/contact-us">
                  Contact organisers
                </Link>
              </li>
            </ul>
          </div>

          <div
            className={f({
              columns: 'true',
              'small-6': 'true',
              'medium-2': 'true',
            })}
          >
            <h5 className={f('industry')}>
              <Link
                className={f('industry-color')}
                href="//www.ebi.ac.uk/industry"
              >
                Industry
              </Link>
            </h5>
            <ul>
              <li>
                <Link href="//www.ebi.ac.uk/industry/private">
                  Members Area
                </Link>
              </li>
              <li>
                <Link href="//www.ebi.ac.uk/industry/workshops">Workshops</Link>
              </li>
              <li>
                <Link href="//www.ebi.ac.uk/industry/sme-forum">
                  <abbr title="Small Medium Enterprise">SME</abbr> Forum
                </Link>
              </li>
              <li className={f('last')}>
                <Link href="//www.ebi.ac.uk/industry/contact">
                  Contact Industry programme
                </Link>
              </li>
            </ul>
          </div>

          <div
            className={f({
              columns: 'true',
              'small-6': 'true',
              'medium-2': 'true',
            })}
          >
            <h5 className={f('about')}>
              <Link className={f('ebi-color')} href="//www.ebi.ac.uk/about">
                About EMBL-EBI
              </Link>
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
                  title="Jobs, postdocs, PhDs…"
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="//www.ebi.ac.uk/about/news">News</Link>
              </li>
              <li>
                <Link href="//www.ebi.ac.uk/about/people">People & groups</Link>
              </li>
            </ul>
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
              Copyright © EMBL-EBI 2017 | EMBL-EBI is&nbsp;
              <Link href="//www.embl.org/" rel="noopener">
                part of the European Molecular Biology Laboratory
              </Link>{' '}
              |{' '}
              <Link href="//www.ebi.ac.uk/about/terms-of-use">
                Terms of use
              </Link>
              <Link
                className={f('readmore', 'float-right')}
                href="http://intranet.ebi.ac.uk"
              >
                Intranet
              </Link>
            </p>
          </div>
        </section>
      </div>
    );
  }
}

export default EBIFooter;
