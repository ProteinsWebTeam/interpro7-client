import React, { PureComponent } from 'react';
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
    import(/* webpackChunkName: "sequence-page" */ 'pages/Sequence'),
});

const TextSearchAndResults = () => (
  <Wrapper>
    <SearchByText key="search" />
    <SearchResults key="results" />
  </Wrapper>
);

const IPScanSearchAndStatus = () => (
  <Wrapper>
    <IPScanSearch key="search" />
    <IPScanStatus key="status" refreshRate={120000} />
  </Wrapper>
);
IPScanSearchAndStatus.preload = () => {
  IPScanSearch.preload();
  IPScanStatus.preload();
};

const InnerSwitch = props => (
  <ErrorBoundary>
    <Switch
      {...props}
      locationSelector={l => l.description.search.accession}
      indexRoute={IPScanSearchAndStatus}
      catchAll={IPScanResult}
    />
  </ErrorBoundary>
);

const routes = new Set([
  { value: 'text', component: TextSearchAndResults },
  { value: 'sequence', component: InnerSwitch },
]);

const RedirectToText = () => (
  <Redirect
    to={{ description: { main: { key: 'search' }, search: { type: 'text' } } }}
  />
);

class Wrapper extends PureComponent {
  static propTypes = {
    children: T.node.isRequired,
  };

  render() {
    return (
      <div className={f('row')}>
        <div className={f('columns', 'margin-bottom-large')}>
          <h3>Search InterPro</h3>
          <ul className={f('tabs', 'main-style', 'margin-top-large')}>
            <li
              className={f('tabs-title')}
              onMouseOver={SearchByText.preload}
              onFocus={SearchByText.preload}
            >
              <Link
                to={{
                  description: {
                    main: { key: 'search' },
                    search: { type: 'text' },
                  },
                }}
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
          </ul>
          <div className={f('tabs', 'tabs-content')}>
            <div className={f('tabs-panel', 'is-active')}>
              <ErrorBoundary>{this.props.children}</ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Search = () => (
  <Switch
    locationSelector={l => l.description.search.type}
    indexRoute={RedirectToText}
    childRoutes={routes}
  />
);

export default Search;
