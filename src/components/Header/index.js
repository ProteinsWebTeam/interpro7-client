import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router/es';

import {openSideNav} from 'actions/creators';

import Breadcrumb from '../Breadcrumb';

import styles from './style.css';
import logo from 'images/logo/logo_75x75.png';

import f from 'styles/foundation';

// Only does this in a browser
// Logic to attach the scaling of the banner to the scroll position
if (window) {
  // If IntersectionObserver is supported use that
  if (window.IntersectionObserver) {
    const MIN_VISIBLE_THRESHOLD = 0.01;
    const POLLING_TIMEOUT = 500;
    let scaled;
    let translated;
    // IntersectionObserver to be used on the EBI header
    const io = new IntersectionObserver(([{intersectionRatio}]) => {
      // If the element to scaled is not there yet, get it here
      if (!scaled) {
        [scaled] = document.getElementsByClassName(
          styles.top_level_title.split(' ')[0]
        );
      }
      if (!translated) {
        [translated] = document.getElementsByClassName(
          styles.top_level_hamburger.split(' ')[0]
        );
      }
      // If the EBI header is visible, display full banner
      if (intersectionRatio) {
        scaled.classList.remove(styles.scrolled);
        translated.classList.remove(styles.scrolled);
      } else {// Otherwise, scale down the banner
        scaled.classList.add(styles.scrolled);
        translated.classList.add(styles.scrolled);
      }
    }, {threshold: [MIN_VISIBLE_THRESHOLD]});
    // Polls regularly the DOM to see if the element to watch is here
    const to = setInterval(() => {
      const [headerEBI] = document.getElementsByClassName(
        styles.ebi.split(' ')[0]
      );
      if (headerEBI) {
        // When we got the element, stop the interval
        clearInterval(to);
        // And start observing it
        io.observe(headerEBI);
      }
    }, POLLING_TIMEOUT);
  } else {// Otherwise fall back to watching scroll position
    const SCROLL_OFFSET = 34;// Height of the EBI banner
    let scaled;// Element to scale
    let translated;// Element to translate
    let scrolled = window.scrollY > SCROLL_OFFSET;// Flag
    window.addEventListener('scroll', () => {
      if (!scaled) {
        [scaled] = document.getElementsByClassName(
          styles.top_level_title.split(' ')[0]
        );
      }
      if (!translated) {
        [translated] = document.getElementsByClassName(
          styles.top_level_hamburger.split(' ')[0]
        );
      }
      if (scrolled !== window.scrollY > SCROLL_OFFSET) {
        scrolled = !scrolled;
        scaled.classList.toggle(styles.scrolled);
        translated.classList.toggle(styles.scrolled);
      }
    }, {passive: true});
  }
}

// This is temporary, assume the guidelines might change in the future
const EbiGlobalHeader = () => (
  <div id="global-masthead" className="clearfix">
    <nav>
      <div className={f('row')}>
        <ul id="global-nav" className="menu">
          <li id="home-mobile">
            <a href="//www.ebi.ac.uk"></a>
          </li>
          <li id="home">
            <a href="//www.ebi.ac.uk"></a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
);

/*
 <nav>
 <div className={styles.ebi}>
 <span>EMBL-EBI</span>
 <span className={styles.ebi_services}>Services</span>
 <span>Research</span>
 <span>Training</span>
 <span>About us</span>
 </div>
 </nav>
 */

const HeaderBackground = () => (
  <div className={styles.header_background} />
);

const menuItems = {
  dynamicPages: ['Entry', 'Protein', 'Structure', 'Proteome', 'Pathway'],
  staticPages: ['About', 'Help', 'Contact', 'Settings'],
};

const _HamburgerBtn = ({openSideNav, open, svg}) => {
  if (!svg) {
    return (
      <span>
        <button
          className={styles.top_level_hamburger}
          onClick={openSideNav}
        >
          ☰
        </button>
      </span>
    );
  }
  return (
    <span>
      <svg
        viewBox="0 0 12 10" width="1.5em" height="1.5em"
        className={styles.top_level_hamburger}
        onClick={openSideNav}
      >
        <line
          x1="1" y1="2" x2="11" y2="2"
          className={open ? styles.hamb_1_open : styles.hamb_1}
        />
        <line
          x1="1" y1="5" x2="11" y2="5"
          className={open ? styles.hamb_2_open : styles.hamb_2}
        />
        <line
          x1="1" y1="8" x2="11" y2="8"
          className={open ? styles.hamb_3_open : styles.hamb_3}
        />
      </svg>
    </span>
  );
};
_HamburgerBtn.propTypes = {
  openSideNav: T.func.isRequired,
  open: T.bool.isRequired,
  svg: T.bool.isRequired,
};
const HamburgerBtn = connect(
  ({ui: {sideNav: open}}) => ({open}),
  {openSideNav}
)(_HamburgerBtn);

const TopLevel = () => (
  <span className={styles.top_level}>
    <Link to="/" className={styles.top_level_title}>
      <img src={logo} alt="logo" />
      <div>
        <h1>InterPro</h1>
        <h5>Protein sequence analysis & classification</h5>
      </div>
    </Link>
    <HamburgerBtn svg={true} />
  </span>
);


const MenuItem = ({active, children}) => (
  <Link
    to={`/${children.toLowerCase()}/`}
    className={active ? styles.active : null}
  >
    {children}
  </Link>
);
MenuItem.propTypes = {
  children: T.string.isRequired,
  active: T.bool,
};

const SubMediumLevel = ({pages, pageType}) => (
  <span>
    {pages.map(page => (
      <MenuItem key={page} active={page.toLowerCase() === pageType}>
        {page}
      </MenuItem>
    ))}
  </span>
);
SubMediumLevel.propTypes = {
  pages: T.arrayOf(T.string).isRequired,
  pageType: T.string,
};

const MediumLevel = ({pageType}) => (
  <div className={styles.medium_level}>
    <SubMediumLevel pages={menuItems.dynamicPages} pageType={pageType} />
    <SubMediumLevel pages={menuItems.staticPages} pageType={pageType} />
  </div>
);
MediumLevel.propTypes = {
  pageType: T.string,
};

const Header = ({pathname}) => (
  <header className={styles.header}>
    <EbiGlobalHeader />
    <div className={styles.container}>
      <HeaderBackground />
      <TopLevel />
      <MediumLevel pageType={pathname.split('/').filter(x => x)[0]}/>
    </div>
    <Breadcrumb pathname={pathname} />
  </header>
);
Header.propTypes = {
  pathname: T.string.isRequired,
};

export default Header;
