/* eslint react/jsx-pascal-case: 0 */
import React, { PureComponent, Children } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';

import _Header from './Header';
import _Exporter from './Exporter';
import _PageSizeSelector from './PageSizeSelector';
import _SearchBox from './SearchBox';
import _Body from './Body';
import _Column from './Column';
import _Card from './Card';
import _Row from './Row';
import _Footer from './Footer';
import _TotalNb from './TotalNb';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './style.css';

const f = foundationPartial(ebiGlobalStyles, fonts, styles);

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

const GridView = loadable({
  loader: () => import(/* webpackChunkName: "grid-view" */ './views/Grid'),
});

const TreeView = loadable({
  loader: () => import(/* webpackChunkName: "tree-view" */ './views/Tree'),
});

const RedirectToDefault = () => (
  <Redirect to={customLocation => ({ ...customLocation, hash: 'table' })} />
);

// redirects to default type if the 'withXXXX' type is not in the props
const safeGuard = (withType, Component) => {
  const SafeGuarded = ({ [withType]: extractedWithType, ...props }) =>
    extractedWithType ? <Component {...props} /> : <RedirectToDefault />;
  SafeGuarded.displayName = `safeGuard(${withType}, ${Component.name ||
    Component.displayName})`;
  return SafeGuarded;
};

const mainChildRoutes = new Map([
  ['table', TableView],
  // ['list', () => 'LIST!'],
  ['grid', safeGuard('withGrid', GridView)],
  ['tree', safeGuard('withTree', TreeView)],
]);

const footerChildRoutes = new Map([['tree', () => null]]);
const hashSelector = createSelector(
  customLocation => customLocation.hash,
  value => value,
);

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
    withGrid: T.bool,
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
    // Extract card renderer out of the Card child (child as a function)
    let card = _children.find(child => child.type === _Card);
    if (card) card = card.props.children;
    //
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
                <div className={f('type-selector', 'show-for-large')}>
                  <Tooltip title="View your results as a table">
                    <Link
                      to={l => ({ ...l, hash: 'table' })}
                      className={f('icon-view', 'table-view')}
                      activeClass={f('active')}
                      aria-label="view your results as a table"
                      onMouseOver={TableView.preload}
                      onFocus={TableView.preload}
                    />
                  </Tooltip>
                  <div className={f('test-support-grid')}>
                    <Tooltip title="View your results in a grid">
                      <Link
                        to={l => ({ ...l, hash: 'grid' })}
                        className={f('icon-view', 'grid-view', {
                          disabled: !card,
                        })}
                        activeClass={f('active')}
                        aria-disabled={card ? 'false' : 'true'}
                        aria-label="view your results in a grid"
                        onMouseOver={GridView.preload}
                        onFocus={GridView.preload}
                      />
                    </Tooltip>
                  </div>
                  <Tooltip title="View your results as a tree">
                    <Link
                      to={l => ({ ...l, hash: 'tree' })}
                      className={f('icon-view', 'tree-view', {
                        disabled: !withTree,
                      })}
                      activeClass={f('active')}
                      aria-disabled={withTree ? 'false' : 'true'}
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
                locationSelector={hashSelector}
                indexRoute={RedirectToDefault}
                childRoutes={mainChildRoutes}
                catchAll={RedirectToDefault}
                // passed down props
                isStale={isStale}
                loading={loading}
                ok={ok}
                columns={columns}
                card={card}
                notFound={notFound}
                dataTable={dataTable}
                withTree={withTree}
                withGrid={!!card}
              />
              <Switch
                locationSelector={hashSelector}
                indexRoute={_Footer}
                childRoutes={footerChildRoutes}
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
export const Card = _Card;
export const Row = _Row;
export const Footer = _Footer;
