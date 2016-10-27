import React, {PropTypes as T} from 'react';

import {foundationPartial} from 'styles/foundation';
import styles from './style.css';
import ebi_global_styles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css'
import ebi_theme from 'styles/theme-template.css';
import ebi_petrol_theme from 'styles/theme-embl-petrol.css';
const styleBundle = foundationPartial(styles, fonts, ebi_petrol_theme, ebi_theme, ebi_global_styles);

const Footer = () => (
  <footer>
    <div id={styleBundle('global-footer')}>
      <nav id={styleBundle('global-nav-expanded')} class={styleBundle('row')}>
        <div class={{
          "columns": "true",
          "small-6": "true",
          "medium-2": "true"
        }}>
          <a href="//www.ebi.ac.uk" title="EMBL-EBI"><
            span className={styleBundle("ebi-logo")}></span>
          </a>
          <ul></ul>
        </div>
        <div className={styleBundle({
          "columns": "true",
          "small-6": "true",
          "medium-2": "true"
        })}>
          <h5 className={styleBundle("services")}>
            <a className={styleBundle("services-color")} href="//www.ebi.ac.uk/services">Services</a>
          </h5>
          <ul>
            <li className={styleBundle("first")}>
              <a href="//www.ebi.ac.uk/services">By topic</a>
            </li>
            <li>
              <a href="//www.ebi.ac.uk/services/all">By name (A-Z)</a>
            </li>
            <li className={styleBundle("last")}>
              <a href="//www.ebi.ac.uk/support">Help &amp; Support</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </footer>
);

export default Footer;
