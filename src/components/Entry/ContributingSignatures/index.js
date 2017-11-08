import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import MemberSymbol from 'components/Entry/MemberSymbol';
import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import local from './style.css';

const f = foundationPartial(ipro, local);

const MaskSvgIcons = () => (
  <svg
    viewBox="0 0 200 200"
    style={{
      position: 'fixed',
      width: 0,
      height: 0,
      top: -1800,
      left: -1800,
      /* to hide SVG on the page as display:none is not working */
    }}
  >
    <defs>
      <clipPath id="cut-off-center">
        <rect x="33%" y="38%" width="68" height="68" />
      </clipPath>
      <clipPath id="cut-off-bottom">
        <polygon points="0,68 68,0 68,68" />
      </clipPath>
    </defs>
  </svg>
);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = ({ name, db }) => ({
  '@type': ['BioChemEntity', 'CreativeWork'],
  '@id': '@isBasedOn',
  additionalType: 'http://semanticscience.org/resource/SIO_000370.rdf',
  isPartOf: {
    '@type': 'Dataset',
    '@id': db,
  },
  name,
});

const ContributingSignatures = ({ contr } /*: {contr: Object} */) => (
  <div className={f('side-panel', 'margin-top-small', 'margin-bottom-large')}>
    <div className={f('md-icon-list-box', 'margin-bottom-large')}>
      <h5>Contributing signatures</h5>
      <ul className={f('md-list')}>
        {Object.entries(contr).map(([db, accessions]) => (
          <li key={db}>
            <MaskSvgIcons />

            <MemberSymbol type={db} className={f('md-small')} />
            {accessions.map(accession => (
              <Link
                key={accession}
                newTo={{
                  description: {
                    mainType: 'entry',
                    mainDB: db,
                    mainAccession: accession,
                  },
                }}
              >
                <div className={f('md-list-text')}>
                  <small>
                    <span style={{ color: '#4b555b' }}>{db}:</span>{' '}
                    <span>{accession}</span>
                  </small>
                </div>
              </Link>
            ))}
          </li>
        ))}
      </ul>
    </div>

    <div className={f('md-list-box', 'margin-bottom-large')}>
      <h5>Contributing signatures</h5>
      <div className={f('table-chevron')}>
        {Object.entries(contr).map(([db, accessions]) => (
          <div key={db} className={f('sign-row')}>
            <span className={f('sign-cell')}>{db}</span>

            {accessions.map(accession => (
              <span key={accession} className={f('sign-cell')}>
                <SchemaOrgData
                  data={{ db, name: accession }}
                  processData={schemaProcessData}
                />
                <span className={f('sign-label')}>
                  <Link
                    className={f('neutral')}
                    newTo={{
                      description: {
                        mainType: 'entry',
                        mainDB: db,
                        mainAccession: accession,
                      },
                    }}
                  >
                    {accession}
                  </Link>
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);
ContributingSignatures.propTypes = {
  contr: T.object.isRequired,
};

export default ContributingSignatures;
