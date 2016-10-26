import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router/es6';

import {openSideNav} from 'actions/creators';

import Breadcrumb from '../Breadcrumb';

import logo from 'images/logo/logo_75x75.png';

import {foundationPartial} from 'styles/foundation';
import styles from './style.css';
import ebi_global_styles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css'
import ebi_theme from 'styles/theme-template.css';
import ebi_petrol_theme from 'styles/theme-embl-petrol.css';
const styleBundle = foundationPartial(styles, fonts, ebi_global_styles, ebi_petrol_theme, ebi_theme);




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
var iconClasses = styleBundle({
  'icon': true,
  'icon-generic': true
});

var iconFunctionalClasses = styleBundle({
  "icon": true,
  "icon-functional": true
});

var emblSelectorClasses = styleBundle({
  "float-right": true,
  "show-for-medium": true,
  "embl-selector": true
});

var emblButtonClasses = styleBundle({
  "button": true,
  "float-right": true
});

var emblLocationListClasses = styleBundle({
  "column": true,
  "padding-bottom-medium": true
});

const EbiGlobalHeader = () => (
  <div id={styleBundle('global-masthead')} className={styleBundle('clearfix')}>
    <a href="//www.ebi.ac.uk" title="Go to the EMBL-EBI homepage">
      <span className={styleBundle('ebi-logo')}></span>
    </a>
    <nav>
      <div className={styleBundle('row')}>
        <ul id={styleBundle('global-nav')} className={styleBundle('menu')}>

          <li id="home-mobile">
            <a href="//www.ebi.ac.uk"></a>
          </li>

          <li id="home" className={styleBundle('active')}>
            <a href="//www.ebi.ac.uk">
              <i className={iconClasses} data-icon="H"></i> EMBL-EBI
            </a>
          </li>

          <li id="services">
            <a href="//www.ebi.ac.uk/services">
              <i className={iconClasses} data-icon="("></i> Services
            </a>
          </li>

          <li id="research">
            <a href="//www.ebi.ac.uk/research">
              <i className={iconClasses} data-icon=")"></i> Research
            </a>
          </li>

          <li id="training">
            <a href="//www.ebi.ac.uk/training">
              <i className={iconClasses} data-icon="t"></i> Training
            </a>
          </li>

          <li id="about">
            <a href="//www.ebi.ac.uk/about">
              <i className={iconClasses} data-icon="i"></i> About us
            </a>
          </li>

          <li id="search">
            <a href="#"
               data-toggle={styleBundle("search-global-dropdown")}
               aria-controls={styleBundle("search-global-dropdown")}
               data-yeti-box={styleBundle("search-global-dropdown")}
               aria-haspopup="true"
               aria-expanded="false">
              <i className={iconFunctionalClasses} data-icon="1"></i>
              <span className={styleBundle('show-for-small-only')}>Search</span>
            </a>
            <EbiHeaderSearchForm />
          </li>

          <li className={emblSelectorClasses}>
            <button className={emblButtonClasses}
                    type="button"
                    data-toggle={styleBundle("embl-dropdown")}
                    aria-controls={styleBundle("embl-dropdown")}
                    data-is-focus="false"
                    data-yeti-box={styleBundle("embl-dropdown")}
                    aria-haspopup="true"
                    aria-expanded="false">Hinxton</button>
          </li>

        </ul>
      </div>
    </nav>
  </div>

);

const EbiSkipToDiv = () => (
  <div id={styleBundle("skip-to")}>
    <ul>
      <li><a href="#content">Skip to main content</a></li>
      <li><a href="#local-nav">Skip to local navigation</a></li>
      <li><a href="#global-nav">Skip to EBI global navigation menu</a></li>
      <li><a href="#global-nav-expanded">Skip to expanded EBI global navigation menu (includes all sub-sections)</a></li>
    </ul>
  </div>
);

const EbiHeaderSearchForm = () => (
<div id={styleBundle("search-global-dropdown")}
     className={styleBundle('dropdown-pane')}
     data-dropdown="arn8xj-dropdown"
     data-options="closeOnClick:true;"
     aria-hidden="true"
     data-yeti-box={styleBundle('dropdown-pane')}
     aria-labelledby="8m8za8-dd-anchor"
     data-events="resize"
     style={{
       top: "49.375[x",
       left: "1px"
     }}
>
  <form id={styleBundle('global-search')}
        name={styleBundle('global-search')}
        action="/ebisearch/search.ebi"
        method="GET">
    <fieldset>
      <div className={styleBundle("input-group")}>
        <input type="text"
               name="query"
               id={styleBundle("global-searchbox")}
               className={styleBundle("input-group-field")}
               placeholder="Search all of EMBL-EBI"></input>

        <div className={styleBundle("input-group-button")}>
          <input type="submit"
                 name="submit"
                 value="Search"
                 className="button"></input>
          <input type="hidden"
                 name="db"
                 value="allebi"></input>
          <input type="hidden"
                 name="requestFrom"
                 value="global-masthead"></input>
        </div>
      </div>
    </fieldset>
  </form>
</div>
);

const EmblDropdownDiv = () => (
  <div id={styleBundle("embl-dropdown")}
       className={styleBundle("dropdown-pane bottom")}
       data-dropdown={styleBundle("qs9ew3-dropdown")}
       aria-hidden="true"
       data-yeti-box={styleBundle("embl-dropdown")}
       data-resize={styleBundle("embl-dropdown")}
       aria-labelledby={styleBundle("36bcej-dd-anchor")}
       data-events="resize"
       style={{
         top: "48px",
         left: "1px"
       }}>

    <p>
      EMBL-EBI in Hinxton is one of five EMBL locations across europe.<br /> <a href="https://www.ebi.ac.uk/about" className={styleBundle({"small": true, "readmore": true})}>More about EMBL-EBI</a>
    </p>
    <h6>Connect to another EMBL location</h6>

    <div className={styleBundle({
      "small-collapse": true,
      "small-up-2": true,
      "padding-bottom-large": true,
      "clearfix": true})}>
      <div className={emblLocationListClasses}>
        <a href="https://www.embl.fr/" >Grenoble</a>
        <div className={styleBundle("small")}>Structural Biology</div>
      </div>
    </div>

    <div className={styleBundle({
      "small-collapse": true,
      "small-up-2": true,
      "padding-bottom-large": true,
      "clearfix": true})}>
      <div className={emblLocationListClasses}>
        <a href="https://www.embl.fr/" >Hamburg</a>
        <div className={styleBundle("small")}>Structural Biology</div>
      </div>
    </div>

    <div className={styleBundle({
      "small-collapse": true,
      "small-up-2": true,
      "padding-bottom-large": true,
      "clearfix": true})}>
      <div className={emblLocationListClasses}>
        <a href="https://www.embl.fr/" >Heidelberg</a>
        <div className={styleBundle("small")}>Main Laboratory</div>
      </div>
    </div>

    <div className={styleBundle({
      "small-collapse": true,
      "small-up-2": true,
      "padding-bottom-large": true,
      "clearfix": true})}>
      <div className={emblLocationListClasses}>
        <a href="https://www.embl.fr/" >Monterotondo</a>
        <div className={styleBundle("small")}>Mouse Biology</div>
      </div>
    </div>

  </div>
);

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
  <div>
    <EbiSkipToDiv />
    <div className={styleBundle("sticky-container")}
      style={{ height: "203.75px"}}
    >
      <div id={ebi_petrol_theme['local-masthead']}
           className={styleBundle('sticky')}
           data-sticky="o53j5f-sticky"
           data-sticky-on="large"
           data-top-anchor="180"
           data-btm-anchor="300000"
           data-resize={styleBundle("local-masthead")}
           data-events="resize"
      >
        <header className={styles.header}>
          <EbiGlobalHeader />
          <EmblDropdownDiv />
          <div className={styles.container}>
            <HeaderBackground />
            <TopLevel />
            <MediumLevel pageType={pathname.split('/').filter(x => x)[0]}/>
          </div>
          <Breadcrumb pathname={pathname} />
        </header>
      </div>
    </div>
  </div>
);
Header.propTypes = {
  pathname: T.string.isRequired,
};

export default Header;
