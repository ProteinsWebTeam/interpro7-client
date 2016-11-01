import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router/es';

import {openSideNav} from 'actions/creators';

import DynamicMenu from './DynamicMenu';
import Title from './Title';

import TextSearchBox from 'components/SearchByText/TextSearchBox';

import {foundationPartial} from 'styles/foundation';
import styles from './style.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import ipro from 'styles/interpro-new.css';
const styleBundle = foundationPartial(ebiGlobalStyles, fonts, ipro);


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
const iconClasses = styleBundle({
  icon: true,
  'icon-generic': true,
});

const iconFunctionalClasses = styleBundle({
  icon: true,
  'icon-functional': true,
});

const emblSelectorClasses = styleBundle({
  'float-right': true,
  'show-for-medium': true,
  'embl-selector': true,
});

const emblButtonClasses = styleBundle({
  button: true,
  'float-right': true,
});

const emblLocationListClasses = styleBundle({
  column: true,
  'padding-bottom-medium': true,
});

const EbiGlobalHeader = () => (
  <div id="global-masthead" className={styleBundle('clearfix')}>
    <a href="//www.ebi.ac.uk" title="Go to the EMBL-EBI homepage">
      <span className={styleBundle('ebi-logo')}/>
    </a>
    <nav>
      <div className={styleBundle('row')}>
        <ul id="global-nav" className={styleBundle('menu')}>

          <li id="home-mobile" >
            <a href="//www.ebi.ac.uk" />
          </li>

          <li id="home" className={styleBundle('active')}>
            <a href="//www.ebi.ac.uk">
              <i className={iconClasses} data-icon="H" /> EMBL-EBI
            </a>
          </li>

          <li id="services" >
            <a href="//www.ebi.ac.uk/services">
              <i className={iconClasses} data-icon="(" /> Services
            </a>
          </li>

          <li id="research" >
            <a href="//www.ebi.ac.uk/research">
              <i className={iconClasses} data-icon=")" /> Research
            </a>
          </li>

          <li id="training" >
            <a href="//www.ebi.ac.uk/training">
              <i className={iconClasses} data-icon="t" /> Training
            </a>
          </li>

          <li id="about" >
            <a href="//www.ebi.ac.uk/about">
              <i className={iconClasses} data-icon="i" /> About us
            </a>
          </li>

          <li id="search" >
            <a href="#">
              <i className={iconFunctionalClasses} data-icon="1" />
              <span className={styleBundle('show-for-small-only')}>Search</span>
            </a>
            <EbiHeaderSearchForm />
          </li>

          <li className={emblSelectorClasses} style={{flexGrow: 1}}>
            <button className={emblButtonClasses}
              type="button"
            >Hinxton</button>
          </li>

        </ul>
      </div>
    </nav>
    <EmblDropdownDiv />
  </div>

);

const EbiSkipToDiv = () => (
  <div id="skip-to" >
    <ul>
      <li><a href="#content">Skip to main content</a></li>
      <li><a href="#local-nav">Skip to local navigation</a></li>
      <li><a href="#global-nav">Skip to EBI global navigation menu</a></li>
      <li><a href="#global-nav-expanded">
        Skip to expanded EBI global navigation menu (includes all sub-sections)
      </a></li>
    </ul>
  </div>
);

const EbiHeaderSearchForm = () => (
<div id="search-global-dropdown"
  className={styleBundle('dropdown-pane')}
  style={{
    top: '49.375[x',
    left: '1px',
  }}
>
  <form id="global-search"
    name={styleBundle('global-search')}
    action="/ebisearch/search.ebi"
    method="GET"
  >
    <fieldset>
      <div className={styleBundle('input-group')}>
        <input type="text"
          name="query"
          id="global-searchbox"
          className={styleBundle('input-group-field')}
          placeholder="Search all of EMBL-EBI"
        />

        <div className={styleBundle('input-group-button')}>
          <input type="submit"
            name="submit"
            value="Search"
            className="button"
          />
          <input type="hidden"
            name="db"
            value="allebi"
          />
          <input type="hidden"
            name="requestFrom"
            value="global-masthead"
          />
        </div>
      </div>
    </fieldset>
  </form>
</div>
);

const EmblDropdownDiv = () => (
  <div id="embl-dropdown"
    className={styleBundle({
      'dropdown-pane': 'true',
      bottom: 'true',
    })}
    style={{
      top: '48px',
      left: '1px',
    }}
  >

    <p>
      EMBL-EBI in Hinxton is one of five EMBL locations across europe.<br />
      <a
        href="https://www.ebi.ac.uk/about"
        className={styleBundle({small: true, readmore: true})}
      >More about EMBL-EBI</a>
    </p>
    <h6>Connect to another EMBL location</h6>

    <div className={styleBundle({
      'small-collapse': true,
      'small-up-2': true,
      'padding-bottom-large': true,
      clearfix: true})}
    >
      <div className={emblLocationListClasses}>
        <a href="https://www.embl.fr/" >Grenoble</a>
        <div className={styleBundle('small')}>Structural Biology</div>
      </div>
    </div>

    <div className={styleBundle({
      'small-collapse': true,
      'small-up-2': true,
      'padding-bottom-large': true,
      clearfix: true})}
    >
      <div className={emblLocationListClasses}>
        <a href="https://www.embl.fr/" >Hamburg</a>
        <div className={styleBundle('small')}>Structural Biology</div>
      </div>
    </div>

    <div className={styleBundle({
      'small-collapse': true,
      'small-up-2': true,
      'padding-bottom-large': true,
      clearfix: true})}
    >
      <div className={emblLocationListClasses}>
        <a href="https://www.embl.fr/" >Heidelberg</a>
        <div className={styleBundle('small')}>Main Laboratory</div>
      </div>
    </div>

    <div className={styleBundle({
      'small-collapse': true,
      'small-up-2': true,
      'padding-bottom-large': true,
      clearfix: true})}
    >
      <div className={emblLocationListClasses}>
        <a href="https://www.embl.fr/" >Monterotondo</a>
        <div className={styleBundle('small')}>Mouse Biology</div>
      </div>
    </div>

  </div>
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
        viewBox="0 0 12 10" width="2.5em" height="2.5em"
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

const _SideIcons = ({open}) => (
  <div
    className={styleBundle('columns', 'small-4', 'medium-2')}
    id="slide-menu"
  >
    <div className={styleBundle('local-buttons')}>
      <div
        className={styleBundle('local-offcanvas-menu', 'anim')}
        style={{transform: `translateX(${open?'-20em':'0em'})`}}
      >
        <HamburgerBtn svg={true} />
      </div>
      <div
        className={styleBundle('local-site-search', 'anim')}
        style={{transform: `translateX(${open?'-20em':'0em'})`}}
      >
        <div
          className={styleBundle('tool-search')}
          id="local-search"
          name="local-search"
        >
          <TextSearchBox
            maxLength="255"
            value=""
            className={styleBundle('search-box')}
            name="search"
          />
          <Link to="/search" className={iconFunctionalClasses} data-icon="1" />
        </div>
      </div>

    </div>
  </div>
);
_SideIcons.propTypes = {
  open: T.bool.isRequired,
};

const SideIcons = connect(
  ({ui: {sideNav: open}}) => ({open})
)(_SideIcons);


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
  <div className={ipro['smaller-container']}>
    <div className={ipro['main-header']}>
      <EbiSkipToDiv />
        <header
          id="local-masthead"
          className={ipro['local-masthead']}
        >
            <EbiGlobalHeader />
            <div className={styleBundle('masthead', 'row')}>
              <Title location={pathname}/>
              <SideIcons />
              <DynamicMenu location={pathname}/>
            </div>
        </header>
    </div>
  </div>
);
Header.propTypes = {
  pathname: T.string.isRequired,
};

export default Header;
