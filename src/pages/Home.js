/* @flow */
import React from 'react';
import {Link} from 'react-router/es6';

import styles from 'styles/blocks.css';
import SearchByText from 'components/SearchByText';

const Home = () => (
  <main>
    <nav className={styles.card}>
      <ul>
        <li><Link to="entry">Entries</Link></li>
        <li><Link to="protein">Proteins</Link></li>
        <li><Link to="structure">Structures</Link></li>
      </ul>
    </nav>
    <section className={styles.card}>
      <SearchByText />
    </section>
  </main>
);

export default Home;
