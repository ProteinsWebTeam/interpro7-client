import React, {PropTypes as T} from 'react';
import {Link} from 'react-router/es6';

import {buildLink} from 'utils/url';

import styles from 'styles/blocks.css';
import ipro from 'styles/interpro-new.css';

const Integration = ({intr, pathname}) => (
  <div className={styles.card} style={{flex: '0 0 auto'}}>
    <h5>Integrated to</h5>
    <ul className={ipro['chevron']}>
      <li>
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
