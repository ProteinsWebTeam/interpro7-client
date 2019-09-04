/* eslint react/jsx-pascal-case: 0 */
import React, { PureComponent, Children } from 'react';
import T from 'prop-types';

import _Header from './Header';
import _Body from './Body';
import _Column from './Column';
import _Row from './Row';
import _Footer from './Footer';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './style.css';

const f = foundationPartial(ebiGlobalStyles, fonts, styles);

import TableView from './views/Table';

/*:: type Props = {
  dataTable: Array<Object>,
  rowKey?: string,
  isStale?: boolean,
  loading?: boolean,
  ok?: boolean,
  status?: number,
  query?: Object,
  title?: string,
  notFound?: boolean,
  contentType?: string,
  children?: any,
} */

export default class Table extends PureComponent /*:: <Props> */ {
  static propTypes = {
    dataTable: T.array,
    rowKey: T.string,
    isStale: T.bool,
    loading: T.bool,
    ok: T.bool,
    status: T.number,
    query: T.object,
    title: T.string,
    notFound: T.bool,
    contentType: T.string,
    children: T.any,
  };

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
      .filter(child => child.type === _Column)
      .map(child => child.props);
    return (
      <div className={f('row')}>
        <div className={f('columns', 'result-page')}>
          <div className={f('row')}>
            <div className={f('columns')}>
              <div className={f('table-results-filtering')}>
                <div className={f('pagesize-wrapper')}>
                  {title && <h4>{title}</h4>}
                </div>
              </div>
            </div>
          </div>
          <div className={f('row')}>
            <div className={f('columns')}>
              <div className={f('table-main', { loading: loading || isStale })}>
                <TableView
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
