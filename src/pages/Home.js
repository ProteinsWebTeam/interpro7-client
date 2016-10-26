/* @flow */
import React from 'react';
import {Link} from 'react-router/es';
import f from 'foundation';
import SearchByText from 'components/SearchByText';


const Home = () => (
  <main>

      <div className={f('row')}>
        <div className={f('columns', 'large-12')}>

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
