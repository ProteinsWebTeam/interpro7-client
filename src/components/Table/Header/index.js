import React, {PropTypes as T} from 'react';

import tblStyles from 'styles/tables.css';

const Header = ({columns}/*: {columns: Array<Object>} */) => (
  <thead className={tblStyles.header}>
  <tr>
    {columns.map(({accessKey, name, children}) => (
      <th key={accessKey}>{children || name || accessKey}</th>
    ))}
  </tr>
  </thead>
);
Header.propTypes = {
  columns: T.arrayOf(T.object).isRequired,
};

export default Header;
