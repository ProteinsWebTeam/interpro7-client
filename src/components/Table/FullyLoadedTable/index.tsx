import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from 'reselect';

import Table, { Column, PageSizeSelector } from 'components/Table';
import { Renderer } from '../Column';

export const sortSubsetBy = <RowData extends Record<string, unknown>>(
  subset: Array<RowData>,
  search: InterProLocationSearch | undefined,
  keys: Array<string>,
  columnToString: Record<string, Column2StringFn<RowData>> = {},
) => {
  for (const key of keys) {
    const str = columnToString[key] || ((x) => `${x}`);
    if (search?.sort_by === key) {
      subset.sort((a, b) => (str(a[key]) > str(b[key]) ? 1 : -1));
    }
    if (search?.sort_by === `-${key}`) {
      subset.sort((a, b) => (str(a[key]) > str(b[key]) ? -1 : 1));
    }
  }
};

export const filterSubset = <RowData extends Record<string, unknown>>(
  subset: Array<RowData>,
  search: InterProLocationSearch | undefined,
  keys: Array<string>,
  columnToString: Record<string, Column2StringFn<RowData>> = {},
) => {
  let filteredSubset = [...subset];
  for (const key of keys) {
    if (search?.[key]) {
      const str =
        columnToString[key] || ((x) => JSON.stringify(x).toLowerCase());
      filteredSubset = filteredSubset.filter(
        (row) =>
          str(row[key], row).indexOf((search[key] as string).toLowerCase()) !==
          -1,
      );
    }
  }
  return filteredSubset;
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.search,
  (state: GlobalState) => state.settings.navigation.pageSize,
  (search, pageSize) => ({ search, pageSize }),
);

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export type Column2StringFn<RowData = unknown> = (
  cellValue: unknown,
  row?: RowData,
) => string;

type Props<RowData extends Record<string, unknown>> = {
  data: Array<RowData>;
  renderers?: Record<string, Renderer<unknown, RowData>>;
  columnToString?: Record<string, Column2StringFn<RowData>>;
  headerStyle?: Record<string, React.CSSProperties>;
  cellStyle?: Record<string, React.CSSProperties>;
  headerColumns?: Record<string, string>;
  headerClassName?: Record<string, string>;
  cellClassName?: Record<string, string>;
};
type AllProps<RowData extends Record<string, unknown>> = Props<RowData> &
  PropsFromRedux;

export const FullyLoadedTable = <RowData extends Record<string, unknown>>({
  data,
  renderers = {},
  columnToString = {},
  headerStyle = {},
  cellStyle = {},
  headerColumns = {},
  headerClassName = {},
  cellClassName = {},
  search,
  pageSize,
}: AllProps<RowData>) => {
  const keys = Object.keys(data?.[0] || {});
  let subset = data;
  subset = filterSubset(subset, search, keys);
  sortSubsetBy(subset, search, keys, columnToString);
  const size = Number(search?.page_size) || pageSize || 20;
  const page = Number(search?.page) || 1;
  subset = subset.slice((page - 1) * size, page * size);
  return (
    <Table actualSize={data.length} dataTable={subset} query={search}>
      <PageSizeSelector />
      {keys.map((key) => (
        <Column
          key={key}
          dataKey={key}
          renderer={renderers[key] || ((d) => d)}
          isSearchable={true}
          isSortable={true}
          headerStyle={{
            ...(headerStyle['*'] || {}),
            ...(headerStyle[key] || {}),
          }}
          cellStyle={{
            ...(cellStyle['*'] || {}),
            ...(cellStyle[key] || {}),
          }}
          headerClassName={`${headerClassName['*'] || ''} ${
            headerClassName[key] || ''
          }`}
          cellClassName={`${cellClassName['*'] || ''} ${
            cellClassName[key] || ''
          }`}
        >
          {headerColumns[key] || key}
        </Column>
      ))}
    </Table>
  );
};

// Define a generic connected component
const ConnectedFullyLoadedTable = <RowData extends Record<string, unknown>>(
  props: Props<RowData>,
) => {
  const ConnectedTable = connector(
    FullyLoadedTable as React.ComponentType<AllProps<RowData>>,
  );
  return <ConnectedTable {...props} />;
};

export default ConnectedFullyLoadedTable;
