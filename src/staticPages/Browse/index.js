// @flow
import React from 'react';
import Link from 'components/generic/Link';

import f from 'styles/foundation';

export default () =>
  <section>
    <nav>
      <div className={f('row')}>
        <div className={f('medium-8', 'large-8', 'columns')}>
          <ul>
            <li>
              <Link newTo={{ description: { mainType: 'entry' } }}>
                Entries
              </Link>
            </li>
            <li>
              <Link newTo={{ description: { mainType: 'protein' } }}>
                Proteins
              </Link>
            </li>
            <li>
              <Link newTo={{ description: { mainType: 'structure' } }}>
                Structures
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </section>;
