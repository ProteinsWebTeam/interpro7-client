import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import MemberSymbol from 'components/Entry/MemberSymbol';
import loadable from 'higherOrder/loadable';
import Metadata from 'wrappers/Metadata';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import local from './style.css';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

const f = foundationPartial(ipro, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = ({ db, name }) => ({
  '@type': ['Entry', 'BioChemEntity', 'CreativeWork'],
  '@id': '@isBasedOn',
  isPartOf: {
    '@type': 'Dataset',
    '@id': db,
  },
  name,
});

const SignatureLink = ({ accession, db, data, label = null }) => {
  const tooltipContent =
    (data &&
      data.payload &&
      data.payload.metadata &&
      data.payload.metadata.name &&
      data.payload.metadata.name.name) ||
    accession;
  return (
    <Link
      to={{
        description: {
          main: { key: 'entry' },
          entry: { db, accession },
        },
      }}
    >
      <small>
        <span className={f('db-name')}>{db}:</span>{' '}
        <Tooltip title={`${tooltipContent} (${accession})`}>
          {label || accession}
        </Tooltip>
      </small>
    </Link>
  );
};
SignatureLink.propTypes = {
  accession: T.string.isRequired,
  db: T.string.isRequired,
  data: T.object,
  label: T.string,
};

const ContributingSignatures = ({ contr } /*: {contr: Object} */) => {
  const contrEntries = Object.entries(contr);
  return (
    <div className={f('side-panel', 'margin-top-small', 'margin-bottom-large')}>
      <div className={f('md-icon-list-box', 'margin-bottom-large')}>
        <h5>Contributing entr{contrEntries.length < 2 ? 'y' : 'ies'}</h5>
        <ul className={f('md-list')}>
          {contrEntries.map(([db, accessions]) => (
            <li key={db}>
              <MemberSymbol type={db} className={f('md-small')} />
              {Object.keys(accessions).map(accession => [
                <SchemaOrgData
                  key={`schema.org for ${accession}`}
                  data={{ db, name: accession }}
                  processData={schemaProcessData}
                />,
                <Metadata
                  key={accession}
                  endpoint="entry"
                  db={db}
                  accession={accession}
                >
                  <SignatureLink
                    key={accession}
                    db={db}
                    accession={accession}
                    label={accessions[accession]}
                  />
                </Metadata>,
              ])}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
ContributingSignatures.propTypes = {
  contr: T.object.isRequired,
};

export default ContributingSignatures;
