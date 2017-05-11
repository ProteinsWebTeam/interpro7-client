import React from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import {buildLink} from 'utils/url';

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

const Integration = ({intr, pathname}) => (
  <div className={styles.card} style={{flex: '0 0 auto'}}>
    <h5>Integrated to</h5>
    <ul className={ipro.chevron}>
      <li>
        <SchemaOrgData data={intr} processData={schemaProcessData} />
        <Link to={buildLink(pathname, 'entry', 'interpro', intr)}>
          {intr}
        </Link>
      </li>
    </ul>
  </div>
);
Integration.propTypes = {
  intr: T.string.isRequired,
  pathname: T.string.isRequired,
};

export default Integration;
