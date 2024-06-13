import React, { PropsWithChildren, useState } from 'react';

import {
  ConnectedSortButton,
  FilterButton,
  ColumnSearchBox,
} from 'components/SimpleCommonComponents/ColumnIcons';

import cssBinder from 'styles/cssBinder';

import s from '../style.css';

const css = cssBinder(s);

// TODO: move to the columns when that is migrated
type ColumnProps = PropsWithChildren<{
  dataKey: string;
  displayIf?: boolean;
  defaultKey?: string;
  name: string;
  headerStyle?: React.CSSProperties;
  headerClassName?: string;
  isSearchable: boolean;
  isSortable: boolean;
  showOptions: boolean;
  options: unknown;
  customiseSearch: unknown;
}>;

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
