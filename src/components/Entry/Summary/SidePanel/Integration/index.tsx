import React from 'react';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData/ts';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import Link from 'components/generic/Link';

import { schemaProcessIntegrated } from 'schema_org/processors';

import cssBinder from 'styles/cssBinder';
import local from './style.css';

const css = cssBinder(local);

const SchemaOrgData: React.ElementType = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});
type Props = {
  intr: string;
};
interface LoadedProps extends Props, LoadDataProps<RootAPIPayload, 'Base'> {}

const Integration = ({ intr, dataBase }: LoadedProps) => {
  const databases = dataBase?.payload?.databases;
  return (
    <div>
      <h5>Integrated to</h5>
      <ul className={css('chevron')}>
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

export default loadData<RootAPIPayload, 'Base'>({
  getUrl: getUrlForMeta,
  propNamespace: 'Base',
})(Integration);
