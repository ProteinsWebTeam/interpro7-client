import React, {PropTypes as T} from 'react';
import {Link} from 'react-router/es6';

import {buildLink} from 'utils/url';

import styles from 'styles/blocks.css';

const Integration = ({intr, pathname}) => (
  <div className={styles.card} style={{flex: '0 0 auto'}}>
    Integrated to <Link to={buildLink(pathname, 'entry', 'interpro', intr)}>
      {intr}
    </Link>
  </div>
);
Integration.propTypes = {
  intr: T.string.isRequired,
  pathname: T.string.isRequired,
};

export default Integration;
