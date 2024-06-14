// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

// $FlowFixMe
import Header from 'components/Table/Header';
// $FlowFixMe
import Body from 'components/Table/Body';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from '../../style.css';

const f = foundationPartial(styles, ipro, fonts);

/*:: type Props = {
  dataTable: Array<Object>,
  rowKey?: string,
  isStale?: boolean,
  loading?: boolean,
  ok?: boolean,
  status?: number,
  notFound?: boolean,
  columns: Array<string>,
  rowClassName?: string | function,
  groups?: Array<string>,
  groupActions?: Array<(string)=>any>,
} */

class TableView extends PureComponent /*:: <Props> */ {
  static propTypes = {
    loading: T.bool,
    isStale: T.bool,
    ok: T.bool,
    status: T.number,
    columns: T.array,
    notFound: T.bool,
    dataTable: T.array,
    rowKey: T.string,
    rowClassName: T.oneOfType([T.string, T.func]),
    groups: T.arrayOf(T.string),
    groupActions: T.elementType,
  };

  render() {
    const {
      loading,
      isStale,
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
        className={f('table', 'light', 'nolink', 'sorting')}
        data-testid="data-table"
      >
        <Header columns={columns} notFound={notFound} />
        <Body
          rows={dataTable || []}
          rowKey={rowKey}
          columns={columns}
          notFound={notFound}
          loading={loading}
          isStale={isStale}
          ok={ok}
          status={status}
          rowClassName={rowClassName}
          groups={groups}
          groupActions={groupActions}
        />
      </table>
    );
  }
}

export default TableView;
