// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { toggleEMBLMapNav } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import styles from './style.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import ebiTheme from 'styles/theme-template.css';
import ebiPetrolTheme from 'styles/theme-embl-petrol.css';
const styleBundle = foundationPartial(
  styles,
  fonts,
  ebiPetrolTheme,
  ebiTheme,
  ebiGlobalStyles
);

/**
 * EBI global header component
 * Defines a set of buttons navigating to the rest of the EBI website
 * The search button displays a hidden search form and submits it to search
 * The EBML-EBI button displays a hidden map with links to other EMBL institutes
 *
 */

/*
 EMBL-EBI button and hidden div behaviour
 */
const _EmblButton = ({ toggleEMBLMapNav }) =>
  <button
    className={styleBundle({
      button: true,
      'float-right': true,
    })}
    type="button"
    onClick={toggleEMBLMapNav}
  >
    Hinxton
  </button>;
_EmblButton.propTypes = {
  toggleEMBLMapNav: T.func.isRequired,
};

const EmblButton = connect(null, { toggleEMBLMapNav })(_EmblButton);

const iconClasses = styleBundle({
  icon: true,
  'icon-generic': true,
});

const emblSelectorClasses = styleBundle({
  'float-right': true,
  'show-for-medium': true,
  'embl-selector': true,
});

const EBIHeader = () =>
  <div id="global-masthead" className={styleBundle('clearfix')}>
    <a
      href="//www.ebi.ac.uk"
      title="Go to the EMBL-EBI homepage"
      rel="noopener"
    >
      <span className={styleBundle('ebi-logo')} />
    </a>
    <nav>
      <div className={styleBundle('row')}>
        <ul id="global-nav" className={styleBundle('menu')}>
          <li id="home-mobile">
            <a href="//www.ebi.ac.uk" rel="noopener" />
          </li>

          <li id="home">
            <a href="//www.ebi.ac.uk" rel="noopener">
              <i className={iconClasses} data-icon="H" />EMBL-EBI
            </a>
          </li>

          <li id="services" className={styleBundle('active')}>
            <a href="//www.ebi.ac.uk/services" rel="noopener">
              <i className={iconClasses} data-icon="(" />Services
            </a>
          </li>

          <li id="research">
            <a href="//www.ebi.ac.uk/research" rel="noopener">
              <i className={iconClasses} data-icon=")" />Research
            </a>
          </li>

          <li id="training">
            <a href="//www.ebi.ac.uk/training" rel="noopener">
              <i className={iconClasses} data-icon="t" />Training
            </a>
          </li>

          <li id="about">
            <a href="//www.ebi.ac.uk/about" rel="noopener">
              <i className={iconClasses} data-icon="i" />About us
            </a>
          </li>

          <li className={emblSelectorClasses} style={{ flexGrow: 1 }}>
            <EmblButton />
          </li>
        </ul>
      </div>
    </nav>
  </div>;

// Skip to div
// TODO: Check why we have to put that
export const EbiSkipToDiv = () =>
  <div id="skip-to">
    <ul>
      <li>
        <a href="#content">Skip to main content</a>
      </li>
      <li>
        <a href="#local-nav">Skip to local navigation</a>
      </li>
      <li>
        <a href="#global-nav">Skip to EBI global navigation menu</a>
      </li>
      <li>
        <a href="#global-nav-expanded">
          Skip to expanded EBI global navigation menu (includes all
          sub-sections)
        </a>
      </li>
    </ul>
  </div>;

export default EBIHeader;
