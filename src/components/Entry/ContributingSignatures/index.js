import React from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import MemberSymbol from 'components/Entry/MemberSymbol';
import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

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

const SignatureLink = ({ accession, db, label }) => (
  <Link
    to={{
      description: {
        main: { key: 'entry' },
        entry: { db, accession },
      },
    }}
  >
    <small>
      <Tooltip title={`${label} (${accession})`}>{accession || label}</Tooltip>
    </small>
  </Link>
);
SignatureLink.propTypes = {
  accession: T.string.isRequired,
  db: T.string.isRequired,
  label: T.string.isRequired,
};

const ContributingSignatures = ({ contr, data } /*: {contr: Object} */) => {
  const metaDB = data.loading || !data.payload ? {} : data.payload.databases;
  const contrEntries = Object.entries(contr);
  return (
    <div className={f('side-panel', 'margin-top-small', 'margin-bottom-large')}>
      <div className={f('md-icon-list-box', 'margin-bottom-large')}>
        <h5>
          Contributing Entr
          {contrEntries.length < 2 ? 'y' : 'ies'}
        </h5>
        <ul className={f('md-list')}>
          {contrEntries.map(([db, signatures]) => (
            <li key={db}>
              <MemberSymbol type={db} className={f('md-small')} />
              <div>
                <span className={f('db-name')}>
                  {(metaDB[db] && metaDB[db].name) || db}:{' '}
                </span>{' '}
                {Object.entries(signatures).map(([accession, name], index) => (
                  <React.Fragment key={accession}>
                    <SchemaOrgData
                      data={{ db, name: accession }}
                      processData={schemaProcessData}
                    />
                    {index ? ', ' : ''}
                    <SignatureLink
                      db={db}
                      accession={accession.toUpperCase()}
                      label={name}
                    />
                  </React.Fragment>
                ))}
              </div>
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

export default loadData(getUrlForMeta)(ContributingSignatures);
