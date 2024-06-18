/* eslint react/jsx-pascal-case: 0 */
import React, {
  PureComponent,
  Children,
  PropsWithChildren,
  ReactElement,
} from 'react';

import Switch from 'components/generic/Switch';
import Redirect from 'components/generic/Redirect';

import _Header from './Header';
import _Exporter from './Exporter';
import _PageSizeSelector from './PageSizeSelector';
import _SearchBox from './SearchBox';
import _HighlightToggler from './HighlightToggler';
import _Body from './Body';
import _Column, { ColumnProps } from './Column';
import _Card from './Card';
import _Row from './Row';
import _Footer from './Footer';
import _TotalNb from './TotalNb';
import TableViewButtons from './ViewButtons';

import loadable from 'higherOrder/loadable';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './style.css';

const css = cssBinder(fonts, styles);

export const ExtraOptions = ({ children }: PropsWithChildren<{}>) => (
  <>{children}</>
);

type Props<RowData extends object> = PropsWithChildren<{
  dataTable?: Array<RowData & { group?: string | number }>;
  rowKey?: string;
  isStale?: boolean;
  loading?: boolean;
  ok?: boolean;
  status?: number | null;
  actualSize?: number;
  query?: Record<string, unknown>;
  title?: string;
  notFound?: boolean;
  contentType?: string;
  withTree?: boolean;
  withGrid?: boolean;
  withSunburst?: boolean;
  withKeySpecies?: boolean;
  rowClassName?: string | ((rowData: RowData) => string);
  currentAPICall?: string | null;
  nextAPICall?: string | null;
  previousAPICall?: string | null;
  showTableIcon?: boolean;
  onFocusChanged?: (id: string) => void;
  shouldGroup?: boolean;
  groupActions?: React.FC<{ group: string }>;
  databases?: DBsInfo;
  dbCounters?: MetadataCounters;
}>;

const TableView = loadable({
  loader: () => import(/* webpackChunkName: "table-view" */ './views/Table'),
  loading: () => null,
});

const GridView = loadable({
  loader: () => import(/* webpackChunkName: "grid-view" */ './views/Grid'),
  loading: () => null,
});

const TreeView = loadable({
  loader: () => import(/* webpackChunkName: "tree-view" */ './views/Tree'),
  loading: () => null,
});
const KeySpecies = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "keyspecies-view" */ 'components/Taxonomy/KeySpeciesTable'
    ),
  loading: () => null,
});
const Sunburst = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "sunburst-view" */ 'components/Related/Taxonomy/Sunburst'
    ),
  loading: () => null,
});

const isTaxaInEntry = ({ description }: InterProLocation) =>
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
  withType: string,
  Component: typeof GridView | typeof TreeView,
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
const hashSelector = (customLocation: InterProLocation) => customLocation.hash;

class Table<RowData extends object> extends PureComponent<Props<RowData>> {
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
      .filter((child) => (child as ReactElement).type === _Column)
      .map(
        (child) =>
          (child as ReactElement).props as ColumnProps<unknown, RowData>,
      );
    // Extract card renderer out of the Card child (child as a function)
    let card = _children.find(
      (child) => (child as ReactElement).type === _Card,
    );
    if (card) card = (card as ReactElement).props.children;
    //
    const search = _children.find(
      (child) => (child as ReactElement).type === _SearchBox,
    );
    const hToggler = _children.find(
      (child) => (child as ReactElement).type === _HighlightToggler,
    );
    const withPageSizeSelector = !!_children.find(
      (child) => (child as ReactElement).type === _PageSizeSelector,
    );
    const exporter = _children.find(
      (child) => (child as ReactElement).type === _Exporter,
    );
    const extraOptions = _children.find(
      (child) => (child as ReactElement).type === ExtraOptions,
    );
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
      <div className={css('vf-stack', 'vf-stack--200')}>
        <div className={css('result-page')}>
          <div className={css('vf-stack')}>
            <div className={css('table-results-filtering')}>
              <div
                className={css({
                  'pagesize-wrapper': !!title || !!data?.length,
                })}
              >
                {title && <h4>{title}</h4>}
                <_TotalNb
                  {...this.props}
                  className={css('hide-for-small-only')}
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
              <div className={css('filter-wrapper')}>
                {search}
                {hToggler}
                {exporter}
                {extraOptions}
              </div>
            </div>
          </div>
          <div className={css('vf-stack')}>
            <_TotalNb
              {...this.props}
              className={css('show-for-small-only')}
              data={data}
              actualSize={actualSize}
              pagination={_query}
              notFound={notFound}
            />
            <div className={css('table-main', { loading: loading || isStale })}>
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
    );
  }
}
export default Table;

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
