import React, {PropTypes as T} from 'react';

import Link from 'components/generic/Link';
import {buildLink} from 'utils/url';

import styles from 'styles/blocks.css';
import ipro from 'styles/interpro-new.css';

const ContributingSignatures = (
  {contr, pathname}/*: {contr: Object, pathname: string} */
) => (
  <div className={styles.card} style={{flex: '0 0 auto'}}>
    <h5>Contributing signatures:</h5>
    <ul className={ipro.chevron}>
      {Object.entries(contr).map(([key, values]) => (
        <li key={key}>
          <Link to={buildLink(pathname, 'entry', key)}>{key}</Link>:
          <ul>
            {values.map(value => (
              <li key={value}>
                <Link to={buildLink(pathname, 'entry', key, value)}>
                  {value}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </div>
);
ContributingSignatures.propTypes = {
  contr: T.object.isRequired,
  pathname: T.string.isRequired,
};

export default ContributingSignatures;
