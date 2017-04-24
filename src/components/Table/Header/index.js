import React, {PropTypes as T} from 'react';
import SortHandler from './SortHandler';

const Header = ({columns}/*: {columns: Array<Object>} */) => (
  <thead>
  <tr>
    {columns.map(({accessKey, name, headerStyle, sortField, children}) => (
      <th key={accessKey} style={headerStyle}>
        {sortField && <SortHandler sortField={sortField} /> }
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
