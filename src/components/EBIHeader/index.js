import React from 'react';

import {foundationPartial} from 'styles/foundation';
import EBIGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import EBITheme from 'styles/theme-template.css';
import EBIPetrolTheme from 'styles/theme-embl-petrol.css';
const styleBundle = foundationPartial(
  fonts, EBIPetrolTheme, EBITheme, EBIGlobalStyles
);

// This is temporary, assume the guidelines might change in the future
const iconClasses = styleBundle({
  icon: true,
  'icon-generic': true,
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

const iconFunctionalClasses = styleBundle({
  icon: true,
  'icon-functional': true,
});

const emblLocationListClasses = styleBundle({
  column: true,
  'padding-bottom-medium': true,
});

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
    className={styleBundle({'dropdown-pane': 'true', bottom: 'true'})}
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

const EBIHeader = () => (
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
            <button className={emblButtonClasses} type="button">Hinxton</button>
          </li>

        </ul>
      </div>
    </nav>
    <EmblDropdownDiv />
  </div>

);

export const EbiSkipToDiv = () => (
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

export default EBIHeader;
