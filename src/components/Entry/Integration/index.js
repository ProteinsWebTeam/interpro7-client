import React from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import local from './style.css';

import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { schemaProcessIntegrated } from 'schema_org/processors';

const f = foundationPartial(ipro, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const Integration = ({ intr, dataBase }) => {
  const databases = dataBase && dataBase.payload && dataBase.payload.databases;
  return (
    <div>
      <h5>Integrated to</h5>
      <ul className={f('chevron')}>
        <li>
          {databases && (
            <SchemaOrgData
              data={{
                name: intr,
                version: databases.INTERPRO.version,
              }}
              processData={schemaProcessIntegrated}
            />
          )}
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: { db: 'InterPro', accession: intr },
              },
            }}
          >
            {intr}
          </Link>
        </li>
      </ul>
    </div>
  );
};
Integration.propTypes = {
  intr: T.string.isRequired,
  dataBase: T.shape({
    payload: T.shape({
      databases: T.object,
    }),
  }).isRequired,
};

export default loadData({ getUrl: getUrlForMeta, propNamespace: 'Base' })(
  Integration,
);
