import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';

import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import styles from 'styles/blocks.css';
import ipro from 'styles/interpro-new.css';

const SchemaOrgData = createAsyncComponent(
  () => import(/* webpackChunkName: "schemaOrg" */'schema_org'),
  () => null,
  'SchemaOrgData'
);

const schemaProcessData = data => ({
  '@type': 'ProteinEntity',
  '@id': '@isBasedOn',
  inDataset: data.db,
  name: data.name,
});

const ContributingSignatures = ({contr}/*: {contr: Object} */) => (
  <div className={styles.card} style={{flex: '0 0 auto'}}>
    <h5>Contributing signatures:</h5>
    <AnimatedEntry className={ipro.chevron}>
      {Object.entries(contr).map(([db, accessions]) => (
        <li key={db}>
          <Link newTo={{description: {mainType: 'entry', mainDB: db}}}>
            {db}
          </Link>:
          <ul>
            {accessions.map(accession => (
              <li key={accession}>
                <SchemaOrgData
                  data={{db, name: accession}}
                  processData={schemaProcessData}
                />
                <Link
                  newTo={{description: {
                    mainType: 'entry', mainDB: db, mainAccession: accession,
                  }}}
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
