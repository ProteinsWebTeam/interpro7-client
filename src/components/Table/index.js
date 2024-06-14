// @flow
/* eslint react/jsx-pascal-case: 0 */
import React, { PureComponent, Children } from 'react';
import T from 'prop-types';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';

// $FlowFixMe
import _Header from './Header';
import _Exporter from './Exporter';
import _PageSizeSelector from './PageSizeSelector';
import _SearchBox from './SearchBox';
import _HighlightToggler from './HighlightToggler';
// $FlowFixMe
import _Body from './Body';
// $FlowFixMe
import _Column from './Column';
import _Card from './Card';
// $FlowFixMe
import _Row from './Row';
// $FlowFixMe
import _Footer from './Footer';
import _TotalNb from './TotalNb';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './style.css';

const f = foundationPartial(ebiGlobalStyles, fonts, styles);

export const ExtraOptions = ({ children }) => <>{children}</>;
ExtraOptions.propTypes = { children: T.any };
/*:: type Props = {
  dataTable: Array<Object>,
  rowKey?: string,
  isStale?: boolean,
  loading?: boolean,
  ok?: boolean,
  status?: number,
  actualSize: number,
  query?: Object,
  title?: string,
  notFound?: ?boolean,
  contentType?: string,
  children?: any,
  withTree?: boolean,
  withGrid?: boolean,
  withSunburst?: boolean,
  withKeySpecies?: boolean,
  rowClassName?: any,
  nextAPICall?: ?string,
  previousAPICall?: ?string,
  showTableIcon?: boolean,
  onFocusChanged?: ?function,
  shouldGroup?: boolean,
  groupActions?: (string)=>any
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
const KeySpecies = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "keyspecies-view" */ 'components/Taxonomy/KeySpeciesTable'
    ),
});
const Sunburst = loadable({
  loader: () =>
    import(
      // $FlowFixMe
      /* webpackChunkName: "sunburst-view" */ 'components/Related/Taxonomy/Sunburst'
    ),
});

const isTaxaInEntry = ({ description }) =>
  description.main.key === 'entry' &&
  description.taxonomy.isFilter &&
  description.taxonomy.order === 1;

const RedirectToDefault = () => (
  <Redirect
    to={(customLocation) => ({
      ...customLocation,
      hash:
        // The default view for taxonomy in entries is the sunburst
        isTaxaInEntry(customLocation) ? 'sunburst' : 'table',
    })}
  />
);

// redirects to default type if the 'withXXXX' type is not in the props
const safeGuard = (
  withType /*: string */,
  Component /*: typeof GridView | typeof TreeView */,
) => {
  const SafeGuarded = ({ [withType]: extractedWithType, ...props }) =>
    extractedWithType ? <Component {...props} /> : <RedirectToDefault />;
  SafeGuarded.displayName = `safeGuard(${withType}, ${
    Component.name || Component.displayName
  })`;
  return SafeGuarded;
};

const mainChildRoutes = new Map([
  ['table', TableView],
  ['grid', safeGuard('withGrid', GridView)],
  ['tree', safeGuard('withTree', TreeView)],
  ['sunburst', safeGuard('withSunburst', Sunburst)],
  ['keyspecies', safeGuard('withKeySpecies', KeySpecies)],
]);

const footerChildRoutes = new Map([
  ['tree', () => null],
  ['sunburst', () => null],
  ['keyspecies', () => null],
]);
const hashSelector = (customLocation) => customLocation.hash;

const TableViewButtons = (
  { tableIcon, card, withTree, withSunburst, withKeySpecies } /*: {
    tableIcon: boolean,
    card: boolean,
    withTree: boolean,
    withSunburst: boolean,
    withKeySpecies: boolean,
  } */,
) => (
  <div className={f('type-selector', 'pp-table-options')}>
    {tableIcon && (
      <Tooltip title="View your results as a table">
        <Link
          to={(l) => ({ ...l, hash: 'table' })}
          className={f('icon-view', 'table-view')}
          activeClass={f('active')}
          aria-label="view your results as a table"
          data-testid="view-table-button"
        />
      </Tooltip>
    )}
    {card && (
      <div className={f('test-support-grid')}>
        <Tooltip title="View your results in a grid">
          <Link
            to={(l) => ({ ...l, hash: 'grid' })}
            className={f('icon-view', 'grid-view', {
              disabled: !card,
            })}
            activeClass={f('active')}
            aria-disabled={card ? 'false' : 'true'}
            aria-label="view your results in a grid"
            data-testid="view-grid-button"
          />
        </Tooltip>
      </div>
    )}
    {withTree && (
      <Tooltip title="View your results as a tree">
        <Link
          to={(l) => ({ ...l, hash: 'tree' })}
          className={f('icon-view', 'tree-view', {
            disabled: !withTree,
          })}
          activeClass={f('active')}
          aria-disabled={withTree ? 'false' : 'true'}
          aria-label="view your results as a tree"
          data-testid="view-tree-button"
        />
      </Tooltip>
    )}
    {withSunburst && (
      <Tooltip title="Display a sunburst view">
        <Link
          to={(l) => ({ ...l, hash: 'sunburst' })}
          className={f('icon-view', 'sunburst-view', {
            disabled: !withSunburst,
          })}
          activeClass={f('active')}
          aria-disabled={withSunburst ? 'false' : 'true'}
          aria-label="view your results as a sunburst"
          data-testid="view-sunburst-button"
        />
      </Tooltip>
    )}
    {withKeySpecies && (
      <Tooltip title="View only key species">
        <Link
          to={(l) => ({ ...l, hash: 'keyspecies' })}
          className={f('icon-view', 'keyspecies-view', {
            disabled: !withKeySpecies,
          })}
          activeClass={f('active')}
          aria-disabled={withKeySpecies ? 'false' : 'true'}
          aria-label="view only key species"
          data-testid="view-keyspecies-button"
        />
      </Tooltip>
    )}
  </div>
);
TableViewButtons.propTypes = {
  tableIcon: T.bool,
  card: T.bool,
  withTree: T.bool,
  withSunburst: T.bool,
  withKeySpecies: T.bool,
};
class Table extends PureComponent /*:: <Props> */ {
  static propTypes = {
    dataTable: T.array,
    rowKey: T.string,
    isStale: T.bool,
    loading: T.bool,
    ok: T.bool,
    status: T.number,
    actualSize: T.number,
    query: T.object,
    nextAPICall: T.string,
    previousAPICall: T.string,
    title: T.string,
    notFound: T.bool,
    contentType: T.string,
    children: T.any,
    withTree: T.bool,
    withGrid: T.bool,
    withKeySpecies: T.bool,
    withSunburst: T.bool,
    rowClassName: T.oneOfType([T.string, T.func]),
    showTableIcon: T.bool,
    shouldGroup: T.bool,
    onFocusChanged: T.func,
    groupActions: T.elementType,
  };

  render() {
    const {
      dataTable,
      rowKey,
      isStale,
      loading,
      ok,
      status,
      actualSize,
      query,
      nextAPICall,
      previousAPICall,
      title,
      notFound,
      contentType,
      children,
      withTree,
      withSunburst,
      withKeySpecies,
      rowClassName,
      showTableIcon,
      onFocusChanged,
      shouldGroup,
      groupActions,
    } = this.props;

    const _query = query || {};
    const _children = Children.toArray(children);
    // Extract prop information out of every Column element's props
    const columns = _children
      .filter((child) => child.type === _Column)
      .map((child) => child.props);
    // Extract card renderer out of the Card child (child as a function)
    let card = _children.find((child) => child.type === _Card);
    if (card) card = card.props.children;
    //
    const search = _children.find((child) => child.type === _SearchBox);
    const hToggler = _children.find(
      (child) => child.type === _HighlightToggler,
    );
    const withPageSizeSelector = !!_children.find(
      (child) => child.type === _PageSizeSelector,
    );
    const exporter = _children.find((child) => child.type === _Exporter);
    const extraOptions = _children.find((child) => child.type === ExtraOptions);
    const tableIcon = showTableIcon === undefined ? true : showTableIcon;
    let data = [...(dataTable || [])];
    let groups = null;
    if (shouldGroup) {
      data = data.sort((a, b) => {
        if (!a.group) return -1;
        if (!b.group) return 1;
        if (a.group === b.group) return 0;
        return a.group > b.group ? 1 : -1;
      });
      groups = Array.from(new Set(data.map(({ group }) => group)));
    }
    return (
      <div className={f('row')}>
        <div className={f('columns', 'result-page')}>
          <div className={f('row')}>
            <div className={f('columns')}>
              <div className={f('table-results-filtering')}>
                <div
                  className={f({
                    'pagesize-wrapper': !!title || !!data?.length,
                  })}
                >
                  {title && <h4>{title}</h4>}
                  <_TotalNb
                    {...this.props}
                    className={f('hide-for-small-only')}
                    data={data}
                    actualSize={actualSize}
                    pagination={_query}
                    contentType={contentType}
                    notFound={notFound}
                  />
                </div>
                <TableViewButtons
                  tableIcon={tableIcon}
                  card={!!card}
                  withTree={!!withTree}
                  withSunburst={!!withSunburst}
                  withKeySpecies={!!withKeySpecies}
                />
                <div className={f('filter-wrapper')}>
                  {search}
                  {hToggler}
                  {exporter}
                  {extraOptions}
                </div>
              </div>
            </div>
          </div>
          <div className={f('row')}>
            <div className={f('columns')}>
              <_TotalNb
                {...this.props}
                className={f('show-for-small-only')}
                data={data}
                actualSize={actualSize}
                pagination={_query}
                notFound={notFound}
              />
              <div className={f('table-main', { loading: loading || isStale })}>
                <Switch
                  locationSelector={hashSelector}
                  indexRoute={RedirectToDefault}
                  childRoutes={mainChildRoutes}
                  catchAll={RedirectToDefault}
                  // passed down props
                  isStale={isStale}
                  loading={loading}
                  ok={ok}
                  status={status}
                  columns={columns}
                  card={card}
                  notFound={notFound}
                  dataTable={data}
                  rowKey={rowKey}
                  withTree={withTree}
                  withSunburst={withSunburst}
                  withKeySpecies={withKeySpecies}
                  withGrid={!!card}
                  rowClassName={rowClassName}
                  onFocusChanged={onFocusChanged}
                  groups={groups}
                  groupActions={groupActions}
                />
              </div>
              <Switch
                locationSelector={hashSelector}
                indexRoute={_Footer}
                childRoutes={footerChildRoutes}
                catchAll={_Footer}
                // passed down props
                withPageSizeSelector={withPageSizeSelector}
                actualSize={actualSize}
                pagination={_query}
                nextAPICall={nextAPICall}
                previousAPICall={previousAPICall}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default React.memo(Table);

export const Header = _Header;
export const PageSizeSelector = _PageSizeSelector;
export const Exporter = _Exporter;
export const SearchBox = _SearchBox;
export const HighlightToggler = _HighlightToggler;
export const Body = _Body;
export const Column = _Column;
export const Card = _Card;
export const Row = _Row;
export const Footer = _Footer;
