// @flow
import React, { useState } from 'react';
import T from 'prop-types';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../style.css';

import { SearchBox } from 'components/Table';

const f = foundationPartial(local, fonts);

const Header = (
  { columns, notFound } /*: {columns: Array<Object>, notFound: boolean} */,
) => {
  const [showFilter, setShowFilter] = useState(
    Object.fromEntries(columns.map(({ dataKey }) => [dataKey, false])),
  );
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
              headerClassName,
              isSearchable = false,
            }) => (
              <th
                key={defaultKey || dataKey}
                style={headerStyle}
                className={headerClassName}
              >
                {children || name || dataKey}
                {isSearchable && (
                  <>
                    {' '}
                    <button
                      onClick={() =>
                        setShowFilter({
                          ...showFilter,
                          [dataKey]: !showFilter[dataKey],
                        })
                      }
                    >
                      <span
                        className={f('icon-filter', 'icon', 'icon-common', {
                          open: showFilter[dataKey],
                        })}
                        data-icon="f"
                      />
                    </button>
                    {showFilter[dataKey] && <SearchBox field={dataKey} />}
                  </>
                )}
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
