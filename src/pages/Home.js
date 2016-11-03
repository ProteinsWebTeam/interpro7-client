/* @flow */
import React from 'react';

import styles from 'styles/blocks.css';
import SearchByText from 'components/SearchByText';

const Home = () => (
  <main>
    <section className={styles.card}>
      <SearchByText />
    </section>
  </main>
);

export default Home;
