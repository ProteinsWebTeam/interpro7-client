import React from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import local from './style.css';

const f = foundationPartial(ipro, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = data => ({
  '@type': ['BioChemEntity', 'CreativeWork'],
  '@id': '@isBasisFor',
  additionalType: 'http://semanticscience.org/resource/SIO_000370.rdf',
  isPartOf: {
    '@type': 'Dataset',
    '@id': 'InterPro release ??',
  },
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
              mainDB: 'InterPro',
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
