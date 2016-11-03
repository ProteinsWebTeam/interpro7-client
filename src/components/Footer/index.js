import React from 'react';

import {foundationPartial} from 'styles/foundation';
import styles from './style.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import ebiTheme from 'styles/theme-template.css';
import ebiPetrolTheme from 'styles/theme-embl-petrol.css';
const styleBundle = foundationPartial(
  styles, fonts, ebiPetrolTheme, ebiTheme, ebiGlobalStyles
);

const Footer = () => (
  <footer>
    <div id={styleBundle('global-footer')}>
      <nav id={styleBundle('global-nav-expanded')} className={styleBundle('row')}>
        <div className={styleBundle({
          columns: 'true',
          'small-6': 'true',
          'medium-2': 'true',
        })}
        >
          <a href="//www.ebi.ac.uk" title="EMBL-EBI"><
            span className={styleBundle('ebi-logo')} />
          </a>
          <ul />
        </div>
        <div className={styleBundle({
          columns: 'true',
          'small-6': 'true',
          'medium-2': 'true',
        })}
        >
          <h5 className={styleBundle('services')}>
            <a
              className={styleBundle('services-color')}
              href="//www.ebi.ac.uk/services"
            >Services</a>
          </h5>
          <ul>
            <li className={styleBundle('first')}>
              <a href="//www.ebi.ac.uk/services">By topic</a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/services/all">By name (A-Z)</a>
            </li>
            <li className={styleBundle('last')}>
              <a href="//www.ebi.ac.uk/support">Help &amp; Support</a>
            </li>
          </ul>
        </div>

        <div className={styleBundle({
          columns: 'true',
          'small-6': 'true',
          'medium-2': 'true',
        })}
        >
          <h5 className={styleBundle('research')}>
            <a className={styleBundle('research-color')} href="//www.ebi.ac.uk/research">
              Research
            </a>
          </h5>
          <ul>
            <li>
              <a href="//www.ebi.ac.uk/research/publications">Publications</a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/research/groups">Research groups</a>
            </li>
            <li className={styleBundle('last')}>
              <a href="//www.ebi.ac.uk/research/postdocs">Postdocs </a>
              &amp;
              <a href="//www.ebi.ac.uk/research/eipp"> PhDs</a>
            </li>
          </ul>
        </div>

        <div className={styleBundle({
          columns: 'true',
          'small-6': 'true',
          'medium-2': 'true',
        })}
        >
          <h5 className={styleBundle('training')}>
            <a className={styleBundle('training-color')} href="//www.ebi.ac.uk/training">
              Training
            </a>
          </h5>
          <ul>
            <li>
              <a href="//www.ebi.ac.uk/training/handson">Train at EBI</a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/training/roadshow">Train outside EBI</a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/training/online">Train online</a>
            </li>
            <li className={styleBundle('last')}>
              <a href="//www.ebi.ac.uk/training/contact-us">Contact organisers</a>
            </li>
          </ul>
        </div>

        <div className={styleBundle({
          columns: 'true',
          'small-6': 'true',
          'medium-2': 'true',
        })}
        >
          <h5 className={styleBundle('industry')}>
            <a className={styleBundle('industry-color')} href="//www.ebi.ac.uk/industry">
              Industry
            </a>
          </h5>
          <ul>
            <li>
              <a href="//www.ebi.ac.uk/industry/private">Members Area</a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/industry/workshops">Workshops</a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/industry/sme-forum">
                <abbr title="Small Medium Enterprise">SME</abbr> Forum
              </a>
            </li>
            <li className={styleBundle('last')}>
              <a href="//www.ebi.ac.uk/industry/contact">Contact Industry programme</a>
            </li>
          </ul>
        </div>

        <div className={styleBundle({
          columns: 'true',
          'small-6': 'true',
          'medium-2': 'true',
        })}
        >
          <h5 className={styleBundle('about')}>
            <a className={styleBundle('ebi-color')} href="//www.ebi.ac.uk/about">
              About EMBL-EBI
            </a>
          </h5>
          <ul>
            <li>
              <a href="//www.ebi.ac.uk/about/contact">Contact us</a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/about/events">Events</a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/about/jobs" title="Jobs, postdocs, PhDs...">
                Jobs
              </a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/about/news">News</a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/about/people">People &amp; groups</a>
            </li>
          </ul>
        </div>

      </nav>

      <section id={styleBundle('ebi-footer-meta')} className={styleBundle('row')}>
        <div className={styleBundle('columns')}>
          <p className={styleBundle('address')}>
            EMBL-EBI, Wellcome Genome Campus, Hinxton,
            Cambridgeshire, CB10 1SD, UK. +44 (0)1223 49 44 44
          </p>
          <p className={styleBundle('legal')}>
            Copyright © EMBL-EBI 2016 | EMBL-EBI is
            <a href="http://www.embl.org/">
              part of the European Molecular Biology Laboratory
            </a> |
            <a href="//www.ebi.ac.uk/about/terms-of-use"> Terms of use</a>
            <a
              className={styleBundle({readmore: 'true', 'float-right': 'true'})}
              href="http://intranet.ebi.ac.uk"
            >Intranet</a>
          </p>
        </div>
      </section>

    </div>
  </footer>
);

export default Footer;
