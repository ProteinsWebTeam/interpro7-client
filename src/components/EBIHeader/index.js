// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';

import { toggleEMBLMapNav } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const styleBundle = foundationPartial(styles, fonts, ebiGlobalStyles);

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
// TODO: SP remove height when bug on EBI side is fixed
const _EmblButton = ({ toggleEMBLMapNav }) => (
  <button
    className={styleBundle('button', 'float-right')}
    style={{ height: '36px' }}
    type="button"
    aria-expanded="false"
    onClick={toggleEMBLMapNav}
  >
    Hinxton
  </button>
);
_EmblButton.propTypes = {
  toggleEMBLMapNav: T.func.isRequired,
};

const EmblButton = connect(null, { toggleEMBLMapNav })(_EmblButton);

const EBIHeader = () => (
  <div
    id="masthead-black-bar"
    className={styleBundle('clearfix', 'masthead-black-bar')}
  >
    <nav className={styleBundle('row')}>
      <ul id="global-nav" className={styleBundle('menu')}>
        <li className={styleBundle('home-mobile')}>
          <Link href="https://www.ebi.ac.uk">EMBL-EBI Home page</Link>
        </li>

        <li className={styleBundle('home')}>
          <Link href="https://www.ebi.ac.uk">EMBL-EBI</Link>
        </li>

        <li className={styleBundle('services', 'active')}>
          <Link href="https://www.ebi.ac.uk/services">Services</Link>
        </li>

        <li className={styleBundle('research')}>
          <Link href="https://www.ebi.ac.uk/research">Research</Link>
        </li>

        <li className={styleBundle('training')}>
          <Link href="https://www.ebi.ac.uk/training">Training</Link>
        </li>

        <li className={styleBundle('about')}>
          <Link href="https://www.ebi.ac.uk/about">About us</Link>
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
    </nav>
  </div>
);

// Skip to div
// TODO: Check why we have to put that in particular now that we don't use ids
export const EbiSkipToDiv = () => (
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
  </div>
);

export default EBIHeader;
