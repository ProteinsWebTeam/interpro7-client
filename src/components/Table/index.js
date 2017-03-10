/* eslint react/jsx-pascal-case: 0 */
import React, {PropTypes as T, Children} from 'react';

import _Header from './Header';
import _Exporter from './Exporter';
import _PageSizeSelector from './PageSizeSelector';
// import _Search from './Search';
import _SearchBox from './SearchBox';
import _Body from './Body';
import _Column from './Column';
import _Row from './Row';
import _Footer from './Footer';

const getData = (data, staleData) => {
  if (!data.loading) return data;
  if (staleData && staleData.payload) return staleData;
  return {payload: {results: [], count: 0}};
};

const Table = (
  {data, staleData, query, pathname, title, children}
  /*: {
   data: {loading: boolean, payload: Object},
   staleData: {loading: boolean, payload: Object},
   query: Object,
   pathname: string,
   children?: any
   } */
) => {
  const _query = query || {};
  const _children = Children.toArray(children);
  // Extract prop information out of every Column element's props
  const columns = _children.filter(child => child.type === _Column)
    .map(child => child.props);
  const search = _children.find(child => child.type === _SearchBox);
  const pageSize = _children.find(child => child.type === _PageSizeSelector);
  const exporter = _children.find(child => child.type === _Exporter);

  return (
    <div>
      {title && <h4>{title}</h4>}
      {exporter}
      {
        pageSize &&
        <_PageSizeSelector
          search={_query}
          pathname={pathname}
        />
      }
      {search}
      <table>
        <_Header columns={columns} />
        <_Body
          rows={getData(data, staleData).payload.results}
          columns={columns}
        />
      </table>
      <_Footer
        data={getData(data, staleData)}
        pagination={_query}
        pathname={pathname}
      />
    </div>
  );
};
Table.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }),
  staleData: T.shape({
    loading: T.bool,
    payload: T.object,
  }),
  query: T.object,
  pathname: T.string.isRequired,
  title: T.string,
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
