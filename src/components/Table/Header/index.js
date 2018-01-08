// @flow
import React from 'react';
import T from 'prop-types';

const Header = ({ columns, notFound } /*: {columns: Array<Object>} */) => {
  if (notFound) {
    return null;
  }
  return (
    <thead>
      <tr>
        {columns
          .filter(({ displayIf = true }) => displayIf)
          .map(
            ({
              dataKey,
              defaultKey,
              name,
              headerStyle,
              children,
              className,
            }) => (
              <th
                key={defaultKey || dataKey}
                style={headerStyle}
                className={className}
              >
                {children || name || dataKey}
              </th>
            ),
          )}
      </tr>
    </thead>
  );
};
Header.propTypes = {
  columns: T.arrayOf(T.object).isRequired,
  notFound: T.bool,
};

export default Header;
