/* eslint react/jsx-pascal-case: 0 */
import React, {PropTypes as T, Children} from 'react';

import _Header from './Header';
import _Search from './Search';
import _SearchBox from './SearchBox';
import _Body from './Body';
import _Column from './Column';
import _Row from './Row';
import _Footer from './Footer';

import styles from 'styles/blocks.css';
import tblStyles from 'styles/tables.css';

const Table = (
  {data, query, pathname, children}
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

  return (
    <div className={styles.card}>
      {
        search &&
        <_SearchBox
          search={search.props}
          query={query.search}
          pathname={pathname}
        />
      }
      <table className={tblStyles.table}>
        <_Header columns={columns} />
        <_Body rows={data.results} columns={columns} />
        <_Footer
          data={data}
          pagination={query}
          pathname={pathname}
          width={columns.length}
        />
      </table>
    </div>
  );
};
Table.propTypes = {
  data: T.object.isRequired,
  query: T.object.isRequired,
  pathname: T.string.isRequired,
  children: T.any,
};

export default Table;
export const Header = _Header;
export const Search = _Search;
export const SearchBox = _SearchBox;
export const Body = _Body;
export const Column = _Column;
export const Row = _Row;
export const Footer = _Footer;
