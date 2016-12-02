import React, {PropTypes as T} from 'react';

import Tabs from 'components/Tabs';
import SearchByText from 'components/SearchByText';
import IPScanSearch from 'components/IPScanSearch';
import SearchResults from 'components/SearchResults';

import foundation from 'styles/foundation';
import styles from 'styles/blocks.css';

const Search = ({data, location: {query}}) => (
  <main>
    <section className={styles.card}>
      <fieldset className={foundation('fieldset')}>
        <legend>Search InterPro</legend>
        <Tabs>
          <div title="by text">
            <SearchByText />
          </div>
          <div title="by sequence">
            <IPScanSearch />
          </div>
        </Tabs>
      </fieldset>
      <SearchResults data={data} query={query} />
    </section>
  </main>
);

Search.propTypes = {
  data: T.object,
  location: T.object,
  children: T.node,
};

export default Search;
