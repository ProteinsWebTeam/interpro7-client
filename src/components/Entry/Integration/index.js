import React from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = data => ({
  '@type': 'PhysicalEntity',
  '@id': '@isBasisFor',
  additionalType: '???ProteinAnnotation???',
  inDataset: 'InterPro',
  name: data,
});

const Integration = ({ intr }) => (
  <div>
    <h5>Integrated to</h5>
    <ul className={f('chevron')}>
      <li>
        <SchemaOrgData data={intr} processData={schemaProcessData} />
        <Link
          newTo={{
            description: {
              mainType: 'entry',
              mainDB: 'interPro',
              mainAccession: intr,
            },
          }}
        >
          {intr}
        </Link>
      </li>
    </ul>
  </div>
);
Integration.propTypes = {
  intr: T.string.isRequired,
};

export default Integration;
