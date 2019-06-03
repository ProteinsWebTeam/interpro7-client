import React, { useState } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';
import HelpBanner from 'components/Help/HelpBanner';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataWebPage } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import ipro from 'styles/interpro-new.css';
import style from './style.css';
import InfoBanner from 'components/Help/InfoBanner';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, ipro, style, fonts);

const SearchByText = loadable({
  loader: () =>
    import(/* webpackChunkName: "search-by-text" */ 'components/SearchByText'),
});
const SearchResults = loadable({
  loader: () =>
    import(/* webpackChunkName: "search-results" */ 'components/SearchResults'),
});
const IPScanSearch = loadable({
  loader: () =>
    import(/* webpackChunkName: "ipscan-search" */ 'components/IPScan/Search'),
});
const IDASearch = loadable({
  loader: () =>
    import(/* webpackChunkName: "ida-search" */ 'components/SearchByIDA'),
});
const IDAResults = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "ida-results" */ 'components/Entry/DomainArchitectures/IDAResults'
    ),
});
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const TextSearchAndResults = () => (
  <Wrapper topic="TextSearch">
    <SearchByText />
    <SearchResults />
  </Wrapper>
);
TextSearchAndResults.preload = () => {
  SearchByText.preload();
  SearchResults.preload();
};

const WrappedIPScanSearch = () => (
  <Wrapper topic="InterProScan">
    <IPScanSearch />
  </Wrapper>
);
WrappedIPScanSearch.preload = () => {
  IPScanSearch.preload();
};

const WrappedIDASearch = () => (
  <Wrapper topic="IDA">
    <IDASearch />
    <IDAResults />
  </Wrapper>
);

const routes = new Map([
  ['text', TextSearchAndResults],
  ['sequence', WrappedIPScanSearch],
  ['ida', WrappedIDASearch],
]);

const RedirectToDefault = ({
  customLocation: {
    search: { q: value },
  },
}) => {
  // TODO: after a decent amount of time, remove from here…
  // This logic is only to handle old IP6 URL structure and redirect to new one
  if (typeof value === 'string') {
    return (
      <Redirect
        to={{
          description: {
            main: { key: 'search' },
            search: { type: 'text', value },
          },
        }}
      />
    );
  }
  // TODO: …to there
  return (
    <Redirect
      to={{
        description: { main: { key: 'search' }, search: { type: 'sequence' } },
      }}
    />
  );
};
RedirectToDefault.propTypes = {
  customLocation: T.shape({
    search: T.shape({
      q: T.string,
    }).isRequired,
  }).isRequired,
};

const Wrapper = ({ topic, children }) => {
  const [showHelp, setShowHelp] = useState(false);
  const toggleShowHelp = () => setShowHelp(!showHelp);
  return (
    <div className={f('row')}>
      <SchemaOrgData
        data={{
          name: 'InterPro Search Page',
          description: 'Search InterPro data and website',
          location: window.location,
        }}
        processData={schemaProcessDataWebPage}
      />
      <div className={f('columns', 'margin-bottom-large')}>
        <h3>Search InterPro</h3>
        <ul className={f('tabs', 'main-style', 'margin-top-large')}>
          <li
            className={f('tabs-title')}
            onMouseOver={WrappedIPScanSearch.preload}
            onFocus={WrappedIPScanSearch.preload}
          >
            <Link
              to={{
                description: {
                  main: { key: 'search' },
                  search: { type: 'sequence' },
                },
              }}
              activeClass={f('is-active', 'is-active-tab')}
            >
              by sequence
            </Link>
          </li>
          <li
            className={f('tabs-title')}
            onMouseOver={TextSearchAndResults.preload}
            onFocus={TextSearchAndResults.preload}
          >
            <Link
              to={{
                description: {
                  main: { key: 'search' },
                  search: { type: 'text' },
                },
              }}
              activeClass={({
                description: {
                  search: { type },
                },
              }) => type === 'text' && f('is-active', 'is-active-tab')}
            >
              by text
            </Link>
          </li>
          <li
            className={f('tabs-title')}
            onMouseOver={WrappedIPScanSearch.preload}
            onFocus={WrappedIPScanSearch.preload}
          >
            <Link
              to={{
                description: {
                  main: { key: 'search' },
                  search: { type: 'ida' },
                },
              }}
              activeClass={f('is-active', 'is-active-tab')}
            >
              by domain architecture
            </Link>
          </li>
        </ul>
        <div className={f('tabs', 'tabs-content')}>
          <div className={f('tabs-panel', 'is-active')}>
            <ErrorBoundary>
              <div className={f('tabs-panel-content')}>
                <div className={f('search-form')}>
                  {Array.isArray(children) ? children[0] : children}
                </div>
                <div>
                  <button onClick={toggleShowHelp} className={f('hollow')}>
                    <span
                      className={f('icon', 'icon-common', 'show-help', {
                        expanded: showHelp,
                      })}
                      data-icon="&#xf137;"
                    />
                  </button>
                </div>
                <div className={f('help-col', { removed: !showHelp })}>
                  {
                    <>
                      <InfoBanner topic={topic} />
                      <HelpBanner topic={topic} />
                    </>
                  }
                </div>
              </div>
              {Array.isArray(children) && children.slice(1)}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};
Wrapper.propTypes = {
  topic: T.string,
  children: T.node.isRequired,
};

const locationSelector = createSelector(
  customLocation => customLocation.description.search.type,
  value => value,
);

const Search = () => (
  <Switch
    locationSelector={locationSelector}
    indexRoute={RedirectToDefault}
    childRoutes={routes}
  />
);

export default Search;
