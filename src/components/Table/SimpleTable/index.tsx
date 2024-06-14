/* eslint react/jsx-pascal-case: 0 */
import React, {
  PureComponent,
  Children,
  PropsWithChildren,
  ReactElement,
} from 'react';

import _Header from '../Header';
import _Body from '../Body';
import _Column, { ColumnProps } from '../Column';
import _Row from '../Row';
import _Footer from '../Footer';
import TableView from '../views/Table';

import cssBinder from 'styles/cssBinder';

// import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from '../style.css';

const css = cssBinder(fonts, styles);

type Props<RowData = Record<string, unknown>> = PropsWithChildren<{
  dataTable: Array<RowData & {}>;
  rowKey?: string;
  isStale?: boolean;
  loading?: boolean;
  ok?: boolean;
  status?: number;
  query?: Record<string, unknown>;
  title?: string;
  notFound?: boolean;
  contentType?: string;
}>;

export default class Table<
  RowData = Record<string, unknown>,
> extends PureComponent<Props<RowData>> {
  render() {
    const {
      dataTable,
      rowKey,
      isStale,
      loading,
      ok,
      status,
      query,
      title,
      notFound,
      children,
    } = this.props;

    const _query = query || {};
    const _children = Children.toArray(children);
    // Extract prop information out of every Column element's props
    const columns = _children
      .filter((child) => (child as ReactElement).type === _Column)
      .map(
        (child) =>
          (child as ReactElement).props as ColumnProps<unknown, RowData>,
      );
    return (
      <div className={css('row')}>
        <div className={css('columns', 'result-page')}>
          <div className={css('row')}>
            <div className={css('columns')}>
              <div className={css('table-results-filtering')}>
                <div className={css('pagesize-wrapper')}>
                  {title && <h4>{title}</h4>}
                </div>
              </div>
            </div>
          </div>
          <div className={css('row')}>
            <div className={css('columns')}>
              <div
                className={css('table-main', { loading: loading || isStale })}
              >
                <TableView<RowData>
                  isStale={isStale}
                  loading={loading}
                  ok={ok}
                  status={status}
                  columns={columns}
                  notFound={notFound}
                  dataTable={dataTable}
                  rowKey={rowKey}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const Header = _Header;
export const Body = _Body;
export const Column = _Column;
export const Row = _Row;
export const Footer = _Footer;
