import React, {PropTypes as T} from 'react';

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

const Search = () => (
  <main>
    <section className={styles.card}>
      <fieldset className={foundation('fieldset')}>
        <legend>Search InterPro</legend>
        <Tabs>
          <div title="by text" to="/search/text">
            <SearchByText />
          </div>
          <div title="by sequence" to="/search/sequence">
            <IPScanSearch />
            <IPScanStatus refreshRate={120000} />
          </div>
        </Tabs>
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
