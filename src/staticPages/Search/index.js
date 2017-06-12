import React from 'react';
import T from 'prop-types';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';
import SearchResults from 'components/SearchResults';

import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import {foundationPartial} from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import styles from 'styles/blocks.css';

const f = foundationPartial(ipro);

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
  <Redirect to={{description: {mainType: 'search', mainDB: 'text'}}} />
);

const Search = () => (
  <main>
    <section className={styles.card}>
      <fieldset className={f('fieldset')}>
        <legend>Search InterPro</legend>
        <ul className={f('tabs')}>
          <li
            className={f('tabs-title')}
            onMouseOver={SearchByText.preload}
          >
            <Link
              newTo={{description: {mainType: 'search', mainDB: 'text'}}}
              activeClass={f('is-active', 'is-active-tab')}
            >
              by text
            </Link>
          </li>
          <li
            className={f('tabs-title')}
            onMouseOver={IPScanSearchAndStatus.preload}
          >
            <Link
              newTo={{description: {mainType: 'search', mainDB: 'sequence'}}}
              activeClass={f('is-active', 'is-active-tab')}
            >
              by sequence
            </Link>
          </li>
        </ul>
        <div className={f('tabs', 'tabs-content')}>
          <div className={f('tabs-panel', 'is-active')}>
            <Switch
              base="search"
              indexRoute={RedirectToText}
              childRoutes={routes}
            />
          </div>
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
