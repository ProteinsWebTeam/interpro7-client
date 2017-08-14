/* eslint react/jsx-pascal-case: 0 */
import React, { Children } from 'react';
import T from 'prop-types';

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

import fonts from 'styles/ebi/fonts.css';
import { foundationPartial } from 'styles/foundation';
import styles from './style.css';

const f = foundationPartial(styles, fonts);

// const getData = (data, staleData) => {
//   if (!data.loading) return data;
//   if (staleData && staleData.payload) return staleData;
//   return {payload: {results: [], count: 0}};
// };

const Table = ({
  dataTable,
  isStale,
  actualSize,
  query,
  pathname,
  title,
  notFound,
  children,
}) =>
  /*: {
   dataTable: Array<Object>,
   isStale: ?boolean,
   actualSize: number
   query: Object,
   pathname: string,
   children?: any
   } */
  {
    const _query = query || {};
    const _children = Children.toArray(children);
    // Extract prop information out of every Column element's props
    const columns = _children
      .filter(child => child.type === _Column)
      .map(child => child.props);
    const search = _children.find(child => child.type === _SearchBox);
    const pageSize = _children.find(child => child.type === _PageSizeSelector);
    const exporter = _children.find(child => child.type === _Exporter);

    return (
      <div className={f('row')}>
        <div className={f('columns', 'table-view')}>
          <div className={f('row')}>
            <div className={f('columns')}>
              <div className={f('table-results-filtering')}>
                <div className={f('pagesize-wrapper')}>
                  {title &&
                    <h4>
                      {title}
                    </h4>}
                  <_TotalNb
                    data={dataTable}
                    actualSize={actualSize}
                    pagination={_query}
                    pathname={pathname}
                    notFound={notFound}
                  />
                </div>
                <div className={f('show-for-large')} style={{ lineHeight: 0 }}>
                  <a
                    className={f('icon-view', 'table-view')}
                    title="View your results as a table"
                  />
                  <a
                    className={f('icon-view', 'list-view', 'disabled')}
                    data-icon="i"
                    title="View your results as a list"
                  />
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
              <table className={f('table', 'light', { isStale })}>
                <_Header columns={columns} />
                <_Body rows={dataTable || []} columns={columns} />
              </table>
            </div>
          </div>
          <div className={f('row')}>
            <div className={f('columns')}>
              <div className={f('table-footer')}>
                {pageSize &&
                  <_PageSizeSelector search={_query} pathname={pathname} />}
                <_Footer
                  data={dataTable}
                  actualSize={actualSize}
                  pagination={_query}
                  pathname={pathname}
                  notFound={notFound}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
Table.propTypes = {
  dataTable: T.array,
  isStale: T.bool,
  actualSize: T.number,
  query: T.object,
  pathname: T.string.isRequired,
  title: T.string,
  notFound: T.bool,
  children: T.any,
};

export default Table;
export const Header = _Header;
// export const Search = _Search;
export const PageSizeSelector = _PageSizeSelector;
export const Exporter = _Exporter;
export const SearchBox = _SearchBox;
export const Body = _Body;
export const Column = _Column;
export const Row = _Row;
export const Footer = _Footer;
