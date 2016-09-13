import React, {Component, PropTypes as T, Children} from 'react';
import config from 'config';

import {Link, withRouter} from 'react-router/es6';
import {connect} from 'react-redux';

import debounce from 'lodash-es/debounce';

import styles from 'styles/blocks.css';
import tblStyles from 'styles/tables.css';
import f from 'styles/foundation';

const DEBOUNCE_RATE = 500;// In ms

const Header = ({columns}/*: {columns: Array<Object>} */) => (
  <thead className={tblStyles.header}>
    <tr>
      {columns.map(({accessKey, name, children}) => (
        <th key={accessKey}>{children || name || accessKey}</th>
      ))}
    </tr>
  </thead>
);
Header.propTypes = {
  columns: T.arrayOf(T.object).isRequired,
};

const defaultRenderer = (value/*: string | number */) => (
  <div>{value}</div>
);

const Row = ({row, columns}/*: {row: Object, columns: Array<Object>}*/) => (
  <tr>
    {columns.map(({accessKey, renderer = defaultRenderer}) => (
      <td
        key={accessKey}
        style={{width: accessKey === 'length' ? '100%' : 'auto'}}
      >
        {renderer(row[accessKey], row)}
      </td>
    ))}
  </tr>
);
Row.propTypes = {
  row: T.object.isRequired,
  columns: T.array.isRequired,
};

const Body = (
  {rows, columns}/*: {rows: Array<Object>, columns: Array<Object>}*/
) => (
  <tbody className={tblStyles.body}>
    {rows.map((row, i) => {
      const rowData = row.metadata || row;
      return (
        <Row key={rowData.accession || i} row={rowData} columns={columns} />
      );
    })}
  </tbody>
);
Body.propTypes = {
  rows: T.array.isRequired,
  columns: T.array.isRequired,
};

const Footer = (
  {data, pagination, pathname, width}
  /*: {data: Object, pagination: Object, pathname: string, width: number} */
) => {
  const page = parseInt(pagination.page || 1, 10);
  const pageSize = parseInt(
    pagination.page_size || config.pagination.pageSize, 10
  );
  const index = (page - 1) * pageSize + 1;
  const lastPage = Math.ceil(data.count / pageSize) || 1;
  return (
    <tfoot className={tblStyles.footer}>
      <tr>
        <td colSpan={width}>
          <ul
            className={f('pagination', 'text-center')}
            role="navigation"
            aria-label="Pagination"
          >
            <li>
              <Link to={{pathname, query: {page: 1, page_size: pageSize}}}>
                {'|<'}
              </Link>
            </li>
            <li>
              <Link
                to={{
                  pathname,
                  query: {page: page - 1 || 1, page_size: pageSize},
                }}
              >
                {'<'}
              </Link>
            </li>
            <li className={f('ellipsis')} aria-hidden="true" />
            <li className={f('current')}>
              {`${index}-${index + data.results.length - 1} of ${data.count}`}
            </li>
            <li className={f('ellipsis')} aria-hidden="true" />
            <li>
              <Link
                to={{
                  pathname,
                  query: {
                    page: Math.min(page + 1, lastPage),
                    page_size: pageSize,
                  },
                }}
              >
                {'>'}
              </Link>
            </li>
            <li>
              <Link
                to={{pathname, query: {page: lastPage, page_size: pageSize}}}
              >
                {'>|'}
              </Link>
            </li>
          </ul>
        </td>
      </tr>
    </tfoot>
  );
};
Footer.propTypes = {
  data: T.object.isRequired,
  pagination: T.object.isRequired,
  pathname: T.string.isRequired,
  width: T.number.isRequired,
};

class _SearchBox extends Component {
  static propTypes = {
    query: T.string,
    search: T.object.isRequired,
    router: T.object.isRequired,
    pathname: T.string.isRequired,
    pageSize: T.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {query: props.query};
  }

  componentWillMount() {
    this.routerPush = debounce(this.routerPush, DEBOUNCE_RATE);
  }

  componentWillReceiveProps({query = ''}) {
    this.setState({query});
  }

  handleChange = ({target: {value: query}}) => {
    this.setState({query});
    this.routerPush();
  };

  handleReset = () => this.setState({query: ''}, this.routerPush);

  routerPush = () => {
    const {pageSize, pathname} = this.props;
    const query/*: {page: number, page_size: number, search?: string} */ = {
      page: 1,
      page_size: pageSize,
    };
    const {query: search} = this.state;
    if (search) query.search = search;
    this.props.router.push({pathname, query});
  };

  render() {
    const {search: {children}} = this.props;
    const {query} = this.state;
    return (
      <form>
        <div className={f('input-group')}>
          <label className={f('input-group-label')} htmlFor="table-filter-text">
            {children || 'Filter'}:
          </label>
          <input
            id="table-filter-text"
            type="text"
            onChange={this.handleChange}
            value={query}
            placeholder="text filter"
            className={f('input-group-field')}
          />
          <div className={f('input-group-button')}>
            <input
              type="button"
              onClick={this.handleReset}
              value="Reset"
              className={f('button')}
            />
          </div>
        </div>
      </form>
    );
  }
}
const SearchBox = withRouter(
  connect(({settings: {pagination: {pageSize}}}) => ({pageSize}))(_SearchBox)
);

export const Column = () => null;
Column.propTypes = {
  accessKey: T.oneOfType([T.string, T.number]).isRequired,
  name: T.string,
  renderer: T.func,
  children: T.any,
};

export const Search = () => {};
Search.propTypes = {};

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
  const columns = _children.filter(child => child.type === Column)
    .map(child => child.props);
  const search = _children.find(child => child.type === Search);

  return (
    <div className={styles.card}>
      {
        search &&
        <SearchBox
          search={search.props}
          query={query.search}
          pathname={pathname}
        />
      }
      <table className={tblStyles.table}>
        <Header columns={columns} />
        <Body rows={data.results} columns={columns} />
        <Footer
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
