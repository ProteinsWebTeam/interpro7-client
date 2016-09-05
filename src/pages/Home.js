/* @flow */
import React from 'react';
import {Link} from 'react-router/es6';

import styles from 'styles/blocks.css';

const Home = () => (
  <main>
    <nav className={styles.card}>
      <ul>
        <li><Link to="entry">Entries</Link></li>
        <li><Link to="protein">Proteins</Link></li>
        <li><Link to="structure">Structures</Link></li>
      </ul>
    </nav>
  </main>
);

export default Home;
