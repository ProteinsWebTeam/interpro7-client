/**
 * Created by gsalazar on 13/10/2016.
 */
import React from 'react';
import {Link, withRouter} from 'react-router/es6';

import styles from 'styles/blocks.css';
import SearchByText from 'components/SearchByText';
import SearchResults from 'components/SearchResults';

const Search = ({data, location: {query}}) => (
  <main>
    <section className={styles.card}>
      <SearchByText />
      <SearchResults data={data} query={query} />
    </section>
  </main>
);

export default Search;
