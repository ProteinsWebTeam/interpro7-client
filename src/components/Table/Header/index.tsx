import React, { useState } from 'react';

import {
  ConnectedSortButton,
  FilterButton,
  ColumnSearchBox,
} from 'components/SimpleCommonComponents/ColumnIcons';

import cssBinder from 'styles/cssBinder';

import s from '../style.css';
import { ColumnProps } from '../Column';

const css = cssBinder(s);

type Props = {
  columns: Array<ColumnProps>;
  notFound?: boolean;
};
const Header = ({ columns, notFound }: Props) => {
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
              isSortable = false,
              showOptions = false,
              options,
              customiseSearch,
            }) => (
              <th
                key={defaultKey || dataKey}
                style={headerStyle}
                className={headerClassName}
              >
                <div className={css('table-header')}>
                  {isSortable && <ConnectedSortButton field={dataKey} />}
                  {isSearchable && (
                    <FilterButton
                      isOpen={showFilter[dataKey]}
                      onClick={() =>
                        setShowFilter({
                          ...showFilter,
                          [dataKey]: !showFilter[dataKey],
                        })
                      }
                    />
                  )}
                  {children || name || dataKey}
                </div>
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

export default Header;
