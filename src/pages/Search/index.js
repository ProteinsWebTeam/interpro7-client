import React from 'react';
import T from 'prop-types';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';
import SearchResults from 'components/SearchResults';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const SearchByText = loadable({
  loader: () =>
    import(/* webpackChunkName: "search-by-text" */ 'components/SearchByText'),
});
const IPScanSearch = loadable({
  loader: () =>
    import(/* webpackChunkName: "ipscan-search" */ 'components/IPScan/Search'),
});
const IPScanStatus = loadable({
  loader: () =>
    import(/* webpackChunkName: "ipscan-status" */ 'components/IPScan/Status'),
});
const IPScanResult = loadable({
  loader: () =>
    import(/* webpackChunkName: "ipscan-result" */ 'components/IPScan/Result'),
});

const IPScanSearchAndStatus = () => (
  <div>
    <IPScanSearch />
    <IPScanStatus refreshRate={120000} />
  </div>
);
IPScanSearchAndStatus.preload = () => {
  IPScanSearch.preload();
  IPScanStatus.preload();
};

const InnerSwitch = props => (
  <ErrorBoundary>
    <Switch
      {...props}
      locationSelector={l => l.description.mainAccession}
      indexRoute={IPScanSearchAndStatus}
      catchAll={IPScanResult}
    />
  </ErrorBoundary>
);

const routes = new Set([
  { value: 'text', component: SearchByText },
  { value: 'sequence', component: InnerSwitch },
]);

const RedirectToText = () => (
  <Redirect to={{ description: { mainType: 'search', mainDB: 'text' } }} />
);

const Search = () => (
  <div className={f('row')}>
    <div className={f('columns')}>
      <fieldset className={f('fieldset')}>
        <legend>Search InterPro</legend>
        <ul className={f('tabs')}>
          <li
            className={f('tabs-title')}
            onMouseOver={SearchByText.preload}
            onFocus={SearchByText.preload}
          >
            <Link
              newTo={{ description: { mainType: 'search', mainDB: 'text' } }}
              activeClass={f('is-active', 'is-active-tab')}
            >
              by text
            </Link>
          </li>
          <li
            className={f('tabs-title')}
            onMouseOver={IPScanSearchAndStatus.preload}
            onFocus={IPScanSearchAndStatus.preload}
          >
            <Link
              newTo={{
                description: { mainType: 'search', mainDB: 'sequence' },
              }}
              activeClass={f('is-active', 'is-active-tab')}
            >
              by sequence
            </Link>
          </li>
        </ul>
        <div className={f('tabs', 'tabs-content')}>
          <div className={f('tabs-panel', 'is-active')}>
            <ErrorBoundary>
              <Switch
                locationSelector={l => l.description.mainDB}
                indexRoute={RedirectToText}
                childRoutes={routes}
              />
            </ErrorBoundary>
          </div>
        </div>
      </fieldset>
      <SearchResults />
      {/* <SearchResults data={data} query={query} />*/}
    </div>
  </div>
);

Search.propTypes = {
  children: T.node,
};

export default Search;
