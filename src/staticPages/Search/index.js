import React, {PropTypes as T} from 'react';
import {Route} from 'react-router-dom';

import Tabs from 'components/Tabs';
import SearchResults from 'components/SearchResults';

import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import foundation from 'styles/foundation';
import styles from 'styles/blocks.css';

const SearchByText = createAsyncComponent(
  () => import('components/SearchByText')
);
const IPScanSearch = createAsyncComponent(
  () => import('components/IPScanSearch')
);
const IPScanStatus = createAsyncComponent(
  () => import('components/IPScanStatus')
);

const Search = ({data, location: {query}}) => (
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
      <Route
        path="*"
        component={SearchResults}
      />
      {/*<SearchResults data={data} query={query} />*/}
    </section>
  </main>
);

Search.propTypes = {
  data: T.object,
  location: T.object,
  children: T.node,
};

export default Search;
