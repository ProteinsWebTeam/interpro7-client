import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Table, { Column, PageSizeSelector } from 'components/Table';

const FullyLoadedTable = ({
  data,
  renderers = {},
  columnToString = {},
  search,
  pageSize,
}) => {
  const keys = Object.keys(data?.[0] || {});
  let subset = data;
  for (const key of keys) {
    if (search[key]) {
      subset = subset.filter(
        row =>
          JSON.stringify(row[key])
            .toLowerCase()
            .indexOf(search[key].toLowerCase()) !== -1,
      );
    }
    const str = columnToString[key] || (x => `${x}`);
    if (search.sort_by === key) {
      subset.sort((a, b) => (str(a[key]) > str(b[key]) ? 1 : -1));
    }
    if (search.sort_by === `-${key}`) {
      subset.sort((a, b) => (str(a[key]) > str(b[key]) ? -1 : 1));
    }
  }
  const size = search.page_size || pageSize;
  const page = search?.page || 1;
  subset = subset.slice((page - 1) * size, page * size);

  return (
    <Table actualSize={data.length} dataTable={subset} query={search}>
      <PageSizeSelector />
      {keys.map(key => (
        <Column
          key={key}
          dataKey={key}
          renderer={renderers[key] || (d => d)}
          isSearchable={true}
        />
      ))}
    </Table>
  );
};
FullyLoadedTable.propTypes = {
  data: T.array.isRequired,
  search: T.object,
  pageSize: T.number,
  renderers: T.object,
  columnToString: T.object,
};

const mapStateToProps = createSelector(
  state => state.customLocation.search,
  state => state.settings.navigation.pageSize,
  (search, pageSize) => ({ search, pageSize }),
);

export default connect(mapStateToProps)(FullyLoadedTable);