import React from 'react';
import T from 'prop-types';

const Header = ({ columns } /*: {columns: Array<Object>} */) => (
  <thead>
    <tr>
      {columns.map(
        ({ dataKey, defaultKey, name, headerStyle, children, className }) => (
          <th
            key={defaultKey || dataKey}
            style={headerStyle}
            className={className}
          >
            {children || name || dataKey}
          </th>
        )
      )}
    </tr>
  </thead>
);
Header.propTypes = {
  columns: T.arrayOf(T.object).isRequired,
};

export default Header;
