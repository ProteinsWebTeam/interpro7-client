// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

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

const TextSearchAndResults = () => (
  <Wrapper>
    <SearchByText />
    <SearchResults />
  </Wrapper>
);
TextSearchAndResults.preload = () => {
  SearchByText.preload();
  SearchResults.preload();
};

const WrappedIPScanSearch = () => (
  <Wrapper>
    <IPScanSearch />
  </Wrapper>
);

const routes = new Set([
  { value: 'text', component: TextSearchAndResults },
  { value: 'sequence', component: WrappedIPScanSearch },
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
                activeClass={({ description: { search: { type } } }) =>
                  type === 'text' && f('is-active', 'is-active-tab')
                }
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
