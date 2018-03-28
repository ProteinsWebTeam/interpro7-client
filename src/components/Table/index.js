/* eslint react/jsx-pascal-case: 0 */
import React, { PureComponent, Children } from 'react';
import T from 'prop-types';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';

import _Header from './Header';
import _Exporter from './Exporter';
import _PageSizeSelector from './PageSizeSelector';
// import _Search from './Search';
import _SearchBox from './SearchBox';
import _Body from './Body';
import _Column from './Column';
import _Row from './Row';
import _Footer from './Footer';
import _TotalNb from './TotalNb';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './style.css';

const f = foundationPartial(styles, fonts);

/*:: type Props = {
  dataTable: Array<Object>,
  isStale: ?boolean,
  actualSize: number,
  query: Object,
  title: string,
  notFound: ?boolean,
  contentType? string,
  children?: any,
} */

const TableView = loadable({
  loader: () => import(/* webpackChunkName: "table-view" */ './views/Table'),
});

// const ListView = loadable({
//   loader: () => import(/* webpackChunkName: "list-view" */ './views/List'),
// });

// const GridView = loadable({
//   loader: () => import(/* webpackChunkName: "grid-view" */ './views/Grid'),
// });

const TreeView = loadable({
  loader: () => import(/* webpackChunkName: "tree-view" */ './views/Tree'),
});

export default class Table extends PureComponent /*:: <Props> */ {
  static propTypes = {
    dataTable: T.array,
    isStale: T.bool,
    loading: T.bool,
    ok: T.bool,
    actualSize: T.number,
    query: T.object,
    title: T.string,
    notFound: T.bool,
    contentType: T.string,
    children: T.any,
    withTree: T.bool,
  };

  render() {
    const {
      dataTable,
      isStale,
      loading,
      ok,
      actualSize,
      query,
      title,
      notFound,
      contentType,
      children,
      withTree,
    } = this.props;

    const _query = query || {};
    const _children = Children.toArray(children);
    // Extract prop information out of every Column element's props
    const columns = _children
      .filter(child => child.type === _Column)
      .map(child => child.props);
    const search = _children.find(child => child.type === _SearchBox);
    const withPageSizeSelector = !!_children.find(
      child => child.type === _PageSizeSelector,
    );
    const exporter = _children.find(child => child.type === _Exporter);

    return (
      <div className={f('row')}>
        <div className={f('columns', 'table-view')}>
          <div className={f('row')}>
            <div className={f('columns')}>
              <div className={f('table-results-filtering')}>
                <div className={f('pagesize-wrapper')}>
                  {title && <h4>{title}</h4>}
                  <_TotalNb
                    className={f('hide-for-small-only')}
                    data={dataTable}
                    actualSize={actualSize}
                    pagination={_query}
                    contentType={contentType}
                    notFound={notFound}
                  />
                </div>
                <div
                  className={f('show-for-large')}
                  style={{ lineHeight: 0, display: 'flex' }}
                >
                  <Tooltip title="View your results as a table">
                    <Link
                      to={l => ({ ...l, hash: 'table' })}
                      className={f('icon-view', 'table-view')}
                      aria-label="view your results as a table"
                      onMouseOver={TableView.preload}
                      onFocus={TableView.preload}
                    />
                  </Tooltip>{' '}
                  <Tooltip title="View your results as a list">
                    <Link
                      to={l => ({ ...l, hash: 'list' })}
                      className={f('icon-view', 'list-view', 'disabled')}
                      aria-disabled="true"
                      disabled
                      aria-label="view your results as a list"
                      // onMouseOver={ListView.preload}
                      // onFocus={ListView.preload}
                    />
                  </Tooltip>{' '}
                  <Tooltip title="View your results in a grid">
                    <Link
                      to={l => ({ ...l, hash: 'grid' })}
                      className={f('icon-view', 'grid-view', 'disabled')}
                      aria-disabled="true"
                      disabled
                      aria-label="view your results in a grid"
                      // onMouseOver={GridView.preload}
                      // onFocus={GridView.preload}
                    />
                  </Tooltip>
                  <Tooltip title="View your results as a tree">
                    <Link
                      to={l => ({ ...l, hash: 'tree' })}
                      className={f('icon-view', 'tree-view', {
                        disabled: !withTree,
                      })}
                      aria-disabled={withTree ? 'false' : 'true'}
                      disabled={!withTree}
                      aria-label="view your results as a tree"
                      onMouseOver={TreeView.preload}
                      onFocus={TreeView.preload}
                    />
                  </Tooltip>
                </div>
                <div className={f('filter-wrapper')}>
                  {search}
                  {exporter}
                </div>
              </div>
            </div>
          </div>
          <div className={f('row')}>
            <div className={f('columns')}>
              <_TotalNb
                className={f('show-for-small-only')}
                data={dataTable}
                actualSize={actualSize}
                pagination={_query}
                notFound={notFound}
              />
              <Switch
                locationSelector={({ hash }) => hash}
                indexRoute={TableView}
                childRoutes={[
                  { value: 'table', component: TableView },
                  { value: 'list', component: () => 'LIST!' },
                  { value: 'grid', component: () => 'GRID!' },
                  { value: 'tree', component: TreeView },
                ]}
                catchAll={TableView}
                // passed down props
                isStale={isStale}
                loading={loading}
                ok={ok}
                columns={columns}
                notFound={notFound}
                dataTable={dataTable}
              />
              <Switch
                locationSelector={({ hash }) => hash}
                indexRoute={_Footer}
                childRoutes={[{ value: 'tree', component: () => null }]}
                catchAll={_Footer}
                // passed down props
                withPageSizeSelector={withPageSizeSelector}
                actualSize={actualSize}
                pagination={_query}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const Header = _Header;
export const PageSizeSelector = _PageSizeSelector;
export const Exporter = _Exporter;
export const SearchBox = _SearchBox;
export const Body = _Body;
export const Column = _Column;
export const Row = _Row;
export const Footer = _Footer;
