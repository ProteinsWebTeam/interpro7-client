/* @flow */
import React, {PropTypes as T} from 'react';

import styles from './style.css';

const Tag = ({type}) => (
  <span className={styles[`${type.toLowerCase()}-tag`]}>
    {type[0]}
  </span>
);
Tag.propTypes = {
  type: T.string.isRequired,
};

const TypeTag = ({type, full}/*: {type: string, full: ?boolean}*/) => (
  <div>
    <Tag type={type} />
    {
      full &&
      <span className={styles[`${type.toLowerCase()}-text`]}>{type}</span>
    }
  </div>
);
TypeTag.propTypes = {
  type: T.string.isRequired,
  full: T.bool,
};

export default TypeTag;
