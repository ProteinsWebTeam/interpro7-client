/* @flow */
import React from 'react';
import {Link} from 'react-router/es';

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
