// @flow
import React from 'react';
import {Link} from 'react-router';

import f from 'styles/foundation';

export default () => (
  <main>
    <nav>
      <div className={f('row')}>
        <div className={f('medium-8', 'large-8', 'columns')}>
          <ul>
            <li><Link to="entry">Entries</Link></li>
            <li><Link to="protein">Proteins</Link></li>
            <li><Link to="structure">Structures</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  </main>
);
