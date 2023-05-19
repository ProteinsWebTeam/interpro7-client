import React from 'react';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData/ts';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import Link from 'components/generic/Link';
import MemberSymbol from 'components/Entry/MemberSymbol';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import cssBinder from 'styles/cssBinder';
import local from './style.css';

const css = cssBinder(local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = ({ db, name }: { db: string; name: string }) => ({
  '@type': ['Dataset'],
  // '@type': ['Entry', 'BioChemEntity', 'CreativeWork'],
  '@id': '@isBasedOn',
  description: `Model provided by the ${db} database. Name of the model: ${name}`,
  name,
  url: `https://www.ebi.ac.uk/interpro/entry/${db}/${name}`,
  isPartOf: `https://www.ebi.ac.uk/interpro/entry/${db}/`,
  license: 'https://creativecommons.org/licenses/by/4.0/',
});

const SignatureLink = React.memo(
  ({
    accession,
    db,
    label,
  }: {
    accession: string;
    db: string;
    label: string;
  }) => (
    <Link
      to={{
        description: {
          main: { key: 'entry' },
          entry: { db, accession },
        },
      }}
    >
      <small>
        <Tooltip title={`${label || 'Unintegrated'} (${accession})`}>
          {accession || label}
        </Tooltip>
      </small>
    </Link>
  )
);
SignatureLink.displayName = 'SignatureLink';

type Props = {
  contr: ContributingEntries;
  data?: RequestedData<RootAPIPayload>;
};

export const ContributingSignatures = ({ contr, data }: Props) => {
  const metaDB =
    !data || data.loading || !data.payload ? {} : data.payload.databases;
  const contrEntries = Object.entries(contr || {});
  return (
    <div className={css('side-panel')}>
      <div className={css('md-icon-list-box')}>
        <h5>
          Contributing Member Database Entr
          {contrEntries.length < 2 ? 'y' : 'ies'}
        </h5>
        <ul className={css('md-list')}>
          {contrEntries.map(([db, signatures]) => (
            <li key={db}>
              <MemberSymbol
                type={db as MemberDB}
                className={css('md-small')}
                svg={false}
              />
              <div className={css('db-label')}>
                <span className={css('db-name')}>
                  {(metaDB[db] && metaDB[db].name) || db}:{' '}
                </span>{' '}
                {Object.entries(signatures).map(([accession, name], index) => (
                  <React.Fragment key={accession}>
                    <SchemaOrgData
                      data={{ db, name: accession }}
                      processData={schemaProcessData}
                    />
                    {index ? ', ' : ''}
                    <SignatureLink db={db} accession={accession} label={name} />
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

export default loadData(getUrlForMeta)(React.memo(ContributingSignatures));
