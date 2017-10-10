import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';

import loadable from 'higherOrder/loadable';

import styles from 'styles/blocks.css';
import ipro from 'styles/interpro-new.css';

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = ({ name, db }) => ({
  '@type': ['BioChemEntity', 'CreativeWork'],
  '@id': '@isBasedOn',
  additionalType: 'http://semanticscience.org/resource/SIO_000370.rdf',
  isPartOf: {
    '@type': 'Dataset',
    '@id': db,
  },
  name,
});

const ContributingSignatures = ({ contr } /*: {contr: Object} */) => (
  <div className={styles.card} style={{ flex: '0 0 auto' }}>
    <h5>Contributing signatures:</h5>
    <AnimatedEntry className={ipro.chevron}>
      {Object.entries(contr).map(([db, accessions]) => (
        <li key={db}>
          <Link newTo={{ description: { mainType: 'entry', mainDB: db } }}>
            {db}
          </Link>:
          <ul>
            {accessions.map(accession => (
              <li key={accession}>
                <SchemaOrgData
                  data={{ db, name: accession }}
                  processData={schemaProcessData}
                />
                <Link
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
              </li>
            ))}
          </ul>
        </li>
      ))}
    </AnimatedEntry>
  </div>
);
ContributingSignatures.propTypes = {
  contr: T.object.isRequired,
};

export default ContributingSignatures;
