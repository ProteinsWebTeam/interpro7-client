/* @flow */
import React from 'react';
import {Link} from 'react-router/es6';
import f from 'foundation-sites/dist/foundation.css';
import cn from 'classnames/bind';

cn.bind(f);
import styles from 'styles/blocks.css';

const Home = () => (
  <main>

      <div className={f.row}>
        <div className={cn('columns', 'large-12')}>

      <ul>
        <li><Link to="entry">Entries</Link></li>
        <li><Link to="protein">Proteins</Link></li>
        <li><Link to="structure">Structures</Link></li>
      </ul>

          </div>
        </div>

  </main>
);

export default Home;
