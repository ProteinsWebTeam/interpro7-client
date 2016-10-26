/* eslint react/jsx-pascal-case: 0 */
import React, {PropTypes as T, Children} from 'react';

import _Header from './Header';
import _Exporter from './Exporter';
import _PageSizeSelector from './PageSizeSelector';
import _Search from './Search';
import _SearchBox from './SearchBox';
import _Body from './Body';
import _Column from './Column';
import _Row from './Row';
import _Footer from './Footer';

const Table = (
  {data, query, pathname, title, children}
  /*: {
   data: Object,
   query: Object,
   pathname: string,
   children?: any
   } */
) => {
  const _children = Children.toArray(children);
  // Extract prop information out of every Column element's props
  const columns = _children.filter(child => child.type === _Column)
    .map(child => child.props);
  const search = _children.find(child => child.type === _Search);
  const pageSize = _children.find(child => child.type === _PageSizeSelector);
  const exporter = _children.find(child => child.type === _Exporter);

  return (
    <div>
      {title && <h4>{title}</h4>}
      {
        exporter &&
        <_Exporter>
          {exporter.props.children}
        </_Exporter>
      }
      {
        pageSize &&
        <_PageSizeSelector
          query={query}
          pathname={pathname}
        />
      }
      {
        search &&
        <_SearchBox
          search={search.props}
          query={query.search}
          pathname={pathname}
        />
      }
      <table>
        <_Header columns={columns} />
        <_Body rows={data.results} columns={columns} />
      </table>
      <_Footer
        data={data}
        pagination={query}
        pathname={pathname}
      />
    </div>
  );
};
Table.propTypes = {
  data: T.object.isRequired,
  query: T.object.isRequired,
  pathname: T.string.isRequired,
  title: T.string,
  children: T.any,
};

export default Table;
export const Header = _Header;
export const Search = _Search;
export const PageSizeSelector = _PageSizeSelector;
export const Exporter = _Exporter;
export const SearchBox = _SearchBox;
export const Body = _Body;
export const Column = _Column;
export const Row = _Row;
export const Footer = _Footer;
