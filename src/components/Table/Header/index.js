import React from 'react';
import T from 'prop-types';

const Header = ({columns}/*: {columns: Array<Object>} */) => (
  <thead>
    <tr>
      {columns.map(({accessKey, defaultKey, name, headerStyle, children}) => (
        <th key={defaultKey || accessKey} style={headerStyle}>
          {children || name || accessKey}
        </th>
      ))}
    </tr>
  </thead>
);
Header.propTypes = {
  columns: T.arrayOf(T.object).isRequired,
};

export default Header;
