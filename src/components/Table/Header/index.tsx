import React, { useState } from 'react';

import FilterButton from 'components/SimpleCommonComponents/ColumnIcons/FilterButton';
import ColumnSearchBox from 'components/SimpleCommonComponents/ColumnIcons/ColumnSearchBox';

import { ColumnProps } from '../Column';

import cssBinder from 'styles/cssBinder';

import s from '../style.css';
import SortButtonWithLabel from './SortButtonWithLabel';

const css = cssBinder(s);

type Props<
  RowData = Record<string, unknown>,
  ExtraData = Record<string, unknown>,
> = {
  columns: Array<ColumnProps<unknown, RowData, ExtraData>>;
  notFound?: boolean;
};
const Header = <
  RowData = Record<string, unknown>,
  ExtraData = Record<string, unknown>,
>({
  columns,
  notFound,
}: Props<RowData, ExtraData>) => {
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
                  {isSortable ? (
                    <SortButtonWithLabel
                      text={(children as string) || name || dataKey}
                      dataKey={dataKey}
                    />
                  ) : (
                    <span>{children || name || dataKey}</span>
                  )}
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
