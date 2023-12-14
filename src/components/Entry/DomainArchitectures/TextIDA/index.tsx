import React from 'react';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';
import local from './style.css';

const css = cssBinder(local);

const TextIDA = ({ accessions }: { accessions: Array<string> }) => (
  <div style={{ display: 'flex' }}>
    <div>
      {accessions.map((accession, i) => (
        <React.Fragment key={i}>
          {i !== 0 && ' - '}
          <span className={css('ida-text-domain')}>
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

export default TextIDA;
