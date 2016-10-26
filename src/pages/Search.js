/**
 * Created by gsalazar on 13/10/2016.
 */
import React, {PropTypes as T} from 'react';
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

Search.propTypes = {
  data: T.object,
  location: T.object,
  children: T.node,
};

export default Search;
