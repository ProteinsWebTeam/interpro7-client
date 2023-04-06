import React from 'react';

import LazyImage from 'components/LazyImage';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import local from '../style.css';

const css = cssBinder(local);

const RepresentativeStructure = ({
  accession,
  name,
}: {
  accession: string;
  name: string;
}) => {
  return (
    <div className={css('side-panel')}>
      <div className={css('side-box')}>
        <h5>Representative structure</h5>
        <Link
          className={css('nolink')}
          to={{
            description: {
              main: { key: 'structure' },
              structure: { db: 'pdb', accession },
            },
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <LazyImage
              src={`//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/getimg.pl?source=pdbsum&pdb_code=${accession}&file=traces.jpg`}
              alt={`structure with accession ${accession}`}
            />
          </div>

          <div>
            <b>{accession}</b>: {name}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RepresentativeStructure;
