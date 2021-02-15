// @flow
import React, { useState } from 'react';
import T from 'prop-types';

import {
  ConnectedSortButton,
  FilterButton,
  ColumnSearchBox,
} from 'components/SimpleCommonComponents/ColumnIcons';

const Header = (
  { columns, notFound } /*: {columns: Array<Object>, notFound?: boolean} */,
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
              showOptions = false,
              options,
              customiseSearch,
            }) => (
              <th
                key={defaultKey || dataKey}
                style={headerStyle}
                className={headerClassName}
              >
                {isSearchable && (
                  <>
                    <ConnectedSortButton field={dataKey} />{' '}
                    <FilterButton
                      isOpen={showFilter[dataKey]}
                      onClick={() =>
                        setShowFilter({
                          ...showFilter,
                          [dataKey]: !showFilter[dataKey],
                        })
                      }
                    />{' '}
                  </>
                )}
                {children || name || dataKey}
                {isSearchable && (
                  <ColumnSearchBox
                    field={dataKey}
                    forceToShow={showFilter[dataKey]}
                    showOptions={showOptions}
                    options={options}
                    customiseSearch={customiseSearch}
                  />
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
