// @flow
import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import MemberSymbol from 'components/Entry/MemberSymbol';
import loadable from 'higherOrder/loadable';
import Metadata from 'wrappers/Metadata';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import local from './style.css';

import { Tooltip } from 'react-tippy';

const f = foundationPartial(ipro, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = ({ name, db }) => ({
  '@type': ['Entry', 'BioChemEntity', 'CreativeWork'],
  '@id': '@isBasedOn',
  isPartOf: {
    '@type': 'Dataset',
    '@id': db,
  },
  name,
});

const SignatureLink = ({ accession, db, data }) => {
  const tooltipContent =
    (data &&
      data.payload &&
      data.payload.metadata &&
      data.payload.metadata.name &&
      data.payload.metadata.name.name) ||
    accession;
  return (
    <Link
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
          <Tooltip title={tooltipContent}>
            <span>{accession}</span>
          </Tooltip>
        </small>
      </div>
    </Link>
  );
};
SignatureLink.propTypes = {
  accession: T.string.isRequired,
  db: T.string.isRequired,
  data: T.object,
};

const ContributingSignatures = ({ contr } /*: {contr: Object} */) => (
  <div className={f('side-panel', 'margin-top-small', 'margin-bottom-large')}>
    <div className={f('md-icon-list-box', 'margin-bottom-large')}>
      <h5>Contributing signatures</h5>
      <ul className={f('md-list')}>
        {Object.entries(contr).map(([db, accessions]) => (
          <li key={db}>
            <MemberSymbol type={db} className={f('md-small')} />
            {accessions.map(accession => (
              <Metadata
                endpoint="entry"
                db={db}
                accession={accession}
                key={accession}
              >
                <SignatureLink key={accession} db={db} accession={accession} />
              </Metadata>
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
