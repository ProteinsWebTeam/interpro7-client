// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { toggleEMBLMapNav } from 'actions/creators';

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
// TODO: remove height when bug on EBI side is fixed
const _EmblButton = ({ toggleEMBLMapNav }) =>
  <button
    className={styleBundle('button', 'float-right')}
    style={{ height: '36px' }}
    type="button"
    aria-expanded="false"
    onClick={toggleEMBLMapNav}
  >
    Hinxton
  </button>;
_EmblButton.propTypes = {
  toggleEMBLMapNav: T.func.isRequired,
};

const EmblButton = connect(null, { toggleEMBLMapNav })(_EmblButton);

const EBIHeader = () =>
  <div
    id="global-masthead"
    className={styleBundle('clearfix', 'masthead-black-bar')}
  >
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

          <li id="home" className={styleBundle('home')}>
            <a href="//www.ebi.ac.uk" rel="noopener">
              EMBL-EBI
            </a>
          </li>

          <li id="services" className={styleBundle('services', 'active')}>
            <a href="//www.ebi.ac.uk/services" rel="noopener">
              Services
            </a>
          </li>

          <li id="research" className={styleBundle('research')}>
            <a href="//www.ebi.ac.uk/research" rel="noopener">
              Research
            </a>
          </li>

          <li id="training" className={styleBundle('training')}>
            <a href="//www.ebi.ac.uk/training" rel="noopener">
              Training
            </a>
          </li>

          <li id="about" className={styleBundle('about')}>
            <a href="//www.ebi.ac.uk/about" rel="noopener">
              About us
            </a>
          </li>

          <li
            className={styleBundle(
              'float-right',
              'show-for-medium',
              'embl-selector',
            )}
            style={{ flexGrow: 1 }}
          >
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
