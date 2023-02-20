// @flow
import React from 'react';

import LazyImage from 'components/LazyImage';
import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import local from '../style.css';

const f = foundationPartial(ipro, local);

const RepresentativeStructure = ({ accession, name }) => {
  return (
    <div className={f('side-panel', 'margin-top-small', 'margin-bottom-large')}>
      <div className={f('side-box')}>
        <h5>Representative structure</h5>
        <Link
          className={f('nolink')}
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
