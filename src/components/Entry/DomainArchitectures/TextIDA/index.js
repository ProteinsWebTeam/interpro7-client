// @flow
import React from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';
import local from './style.css';

const f = foundationPartial(local);

const TextIDA = ({ accessions } /*: {accessions: Array<string>} */) => (
  <div style={{ display: 'flex' }}>
    <div>
      {accessions.map((accession, i) => (
        <React.Fragment key={i}>
          {i !== 0 && ' - '}
          <span className={f('ida-text-domain')}>
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db: accession.toLowerCase().startsWith('ipr')
                      ? 'InterPro'
                      : 'pfam',
                    accession,
                  },
                },
              }}
            >
              {' '}
              {accession}
            </Link>
          </span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

TextIDA.propTypes = {
  accessions: T.arrayOf(T.string),
};

export default TextIDA;
