import React, {PropTypes as T} from 'react';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';
import Tabs from 'components/Tabs';
import SearchResults from 'components/SearchResults';

import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import foundation from 'styles/foundation';
import styles from 'styles/blocks.css';

const SearchByText = createAsyncComponent(() => import(
  /* webpackChunkName: "search-by-text" */'components/SearchByText'
));
const IPScanSearch = createAsyncComponent(
  () => import(/* webpackChunkName: "ipscan-search" */'components/IPScanSearch')
);
const IPScanStatus = createAsyncComponent(
  () => import(/* webpackChunkName: "ipscan-status" */'components/IPScanStatus')
);

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

const routes = new Set([
  {path: 'text', component: SearchByText},
  {path: 'sequence', component: IPScanSearchAndStatus},
]);

const RedirectToText = () => (
  <Redirect to="/search/text" />
);

const Search = () => (
  <main>
    <section className={styles.card}>
      <fieldset className={foundation('fieldset')}>
        <legend>Search InterPro</legend>
        <Tabs>
          <div title="by text">
            <SearchByText />
          </div>
          <div title="by sequence" to="/search/sequence">
            <IPScanSearch />
            <IPScanStatus refreshRate={120000} />
          </div>
        </Tabs>
        <div>new, below</div>
        <ul className={foundation('tabs')}>
          <li
            className={foundation('tabs-title')}
            onMouseOver={SearchByText.preload}
          >
            <Link to="/search/text">by text</Link>
          </li>
          <li
            className={foundation('tabs-title')}
            onMouseOver={IPScanSearchAndStatus.preload}
          >
            <Link to="/search/sequence">by sequence</Link>
          </li>
        </ul>
        <div className={foundation('tabs', 'tabs-content')}>
          <Switch
            base="search"
            indexRoute={RedirectToText}
            childRoutes={routes}
          />
        </div>
      </fieldset>
      <SearchResults />
      {/* <SearchResults data={data} query={query} />*/}
    </section>
  </main>
);

Search.propTypes = {
  children: T.node,
};

export default Search;
