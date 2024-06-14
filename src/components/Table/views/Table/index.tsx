import React, { PureComponent } from 'react';

import Header from 'components/Table/Header';
import Body from 'components/Table/Body';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from '../../style.css';
import { ColumnProps } from '../../Column';

const css = cssBinder(styles, fonts);

type Props<
  RowData = Record<string, unknown>,
  ExtraData = Record<string, unknown>,
> = {
  dataTable: Array<RowData>;
  rowKey?: string;
  isStale?: boolean;
  loading?: boolean;
  ok?: boolean;
  status?: number;
  notFound?: boolean;
  columns: Array<ColumnProps<unknown, RowData, ExtraData>>;
  rowClassName: string | ((rowData: RowData) => string);
  groups?: Array<string>;
  groupActions?: React.FC<{ group: string }>;
};

class TableView extends PureComponent<Props> {
  render() {
    const {
      loading,
      // isStale,
      ok,
      status,
      columns,
      notFound,
      dataTable,
      rowKey,
      rowClassName,
      groups,
      groupActions,
    } = this.props;
    return (
      <table
        className={css('table', 'light', 'nolink', 'sorting')}
        data-testid="data-table"
      >
        <Header columns={columns} notFound={notFound} />
        <Body
          rows={dataTable || []}
          rowKey={rowKey}
          columns={columns}
          notFound={!!notFound}
          loading={!!loading}
          // isStale={!!isStale}
          ok={ok}
          status={status || 0}
          rowClassName={rowClassName}
          groups={groups}
          groupActions={groupActions}
        />
      </table>
    );
  }
}

export default TableView;
