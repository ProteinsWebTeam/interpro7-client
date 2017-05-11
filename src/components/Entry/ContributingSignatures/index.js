import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';

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
  '@id': '@isBasedOn',
  inDataset: data.db,
  name: data.name,
});

const ContributingSignatures = (
  {contr, pathname}/*: {contr: Object, pathname: string} */
) => (
  <div className={styles.card} style={{flex: '0 0 auto'}}>
    <h5>Contributing signatures:</h5>
    <AnimatedEntry className={ipro.chevron}>
      {Object.entries(contr).map(([key, values]) => (
        <li key={key}>
          <Link to={buildLink(pathname, 'entry', key)}>{key}</Link>:
          <ul>
            {values.map(value => (
              <li key={value}>
                <SchemaOrgData
                  data={{db: key, name: value}}
                  processData={schemaProcessData}
                />
                <Link to={buildLink(pathname, 'entry', key, value)}>
                  {value}
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
  pathname: T.string.isRequired,
};

export default ContributingSignatures;
