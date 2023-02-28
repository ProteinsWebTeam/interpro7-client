import React from 'react';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData/ts';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import Link from 'components/generic/Link';

import { schemaProcessIntegrated } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import local from './style.css';

const f = foundationPartial(ipro, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

type Props = {
  intr: string;
  dataBase?: RequestedData<RootAPIPayload>;
};
const Integration = ({ intr, dataBase }: Props) => {
  const databases = dataBase?.payload?.databases;
  return (
    <div>
      <h5>Integrated to</h5>
      <ul className={f('chevron')}>
        <li>
          {databases && (
            <SchemaOrgData
              data={{
                name: intr,
                version: databases.interpro.version,
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

export default loadData<RootAPIPayload>({
  getUrl: getUrlForMeta,
  propNamespace: 'Base',
})(Integration);
