import React, {PropTypes as T} from 'react';

const Header = ({columns}/*: {columns: Array<Object>} */) => (
  <thead>
  <tr>
    {columns.map(({accessKey, name, headerStyle, children}) => (
      <th key={accessKey} style={headerStyle}>{children || name || accessKey}</th>
    ))}
  </tr>
  </thead>
);
Header.propTypes = {
  columns: T.arrayOf(T.object).isRequired,
};

export default Header;
