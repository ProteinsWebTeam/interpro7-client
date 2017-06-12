import React from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

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
  '@id': '@isBaseFor',
  inDataset: 'InterPro',
  name: data,
});

const Integration = ({intr}) => (
  <div className={styles.card} style={{flex: '0 0 auto'}}>
    <h5>Integrated to</h5>
    <ul className={ipro.chevron}>
      <li>
        <SchemaOrgData data={intr} processData={schemaProcessData} />
        <Link
          newTo={{description: {
            mainType: 'entry', mainDB: 'iNtErPrO', mainAccession: intr,
          }}}
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
