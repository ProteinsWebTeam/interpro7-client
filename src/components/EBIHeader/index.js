// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import { emblMapNavSelector } from 'reducers/ui/emblMapNav';

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
const _EmblButton = (
  { toggleEMBLMapNav } /*: {toggleEMBLMapNav: function} */,
) => (
  <button
    className={styleBundle('button', 'float-right')}
    type="button"
    aria-expanded="false"
    aria-label="EMBL dropdown"
    onClick={toggleEMBLMapNav}
    style={{
      outlineStyle: 'none',
    }}
  >
    &nbsp;
  </button>
);
_EmblButton.propTypes = {
  toggleEMBLMapNav: T.func.isRequired,
};

const EmblButton = connect(null, { toggleEMBLMapNav })(_EmblButton);

export const EBIHeader = ({ visible = false } /*: {visible?: boolean} */) => (
  <header
    id="masthead-black-bar"
    className={styleBundle('clearfix', 'masthead-black-bar', 'tmp-ebi-header')}
  >
    <div>
      <nav className={styleBundle('row')}>
        <ul
          id="global-nav"
          className={styleBundle('menu', 'global-nav', 'text-right')}
        >
          <li className={styleBundle('home-mobile', 'show-for-small-only')}>
            <Link href="//www.ebi.ac.uk" />
          </li>

          <li className={styleBundle('embl', 'hide')}>
            <Link href="//www.embl.org/">EMBL</Link>
          </li>
          <li className={styleBundle('barcelona', 'hide')}>
            <Link href="//www.embl-barcelona.es/">Barcelona</Link>
          </li>
          <li className={styleBundle('hamburg', 'hide')}>
            <Link href="//www.embl-hamburg.de/">Hamburg</Link>
          </li>
          <li className={styleBundle('heidelberg', 'hide')}>
            <Link href="//www.embl.de/">Heidelberg</Link>
          </li>
          <li className={styleBundle('grenoble', 'hide')}>
            <Link href="//www.embl.fr/">Grenoble</Link>
          </li>
          <li className={styleBundle('rome', 'hide')}>
            <Link href="//www.embl.it/">Rome</Link>
          </li>

          <li className={styleBundle('ebi')}>
            <Link href="//www.ebi.ac.uk">EMBL-EBI</Link>
          </li>

          <li className={styleBundle('services')}>
            <Link href="//www.ebi.ac.uk/services">Services</Link>
          </li>

          <li className={styleBundle('research')}>
            <Link href="//www.ebi.ac.uk/research">Research</Link>
          </li>

          <li className={styleBundle('training')}>
            <Link href="//www.ebi.ac.uk/training">Training</Link>
          </li>

          <li className={styleBundle('about')}>
            <Link href="//www.ebi.ac.uk/about">About us</Link>
          </li>

          <li
            className={styleBundle(
              'float-right',
              'show-for-medium',
              'embl-selector',
              'embl-ebi',
              { active: visible },
            )}
          >
            <EmblButton />
          </li>
        </ul>
      </nav>
    </div>
  </header>
);
EBIHeader.propTypes = {
  visible: T.bool,
};

const mapStateToProps = createSelector(emblMapNavSelector, (visible) => ({
  visible,
}));

export default connect(mapStateToProps)(EBIHeader);
