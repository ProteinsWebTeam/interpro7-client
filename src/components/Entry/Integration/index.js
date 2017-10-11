import React from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import loadable from 'higherOrder/loadable';

import styles from 'styles/blocks.css';
import ipro from 'styles/interpro-new.css';

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
  <div className={styles.card} style={{ flex: '0 0 auto' }}>
    <h5>Integrated to</h5>
    <ul className={ipro.chevron}>
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
