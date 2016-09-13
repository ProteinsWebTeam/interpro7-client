import React, {PropTypes as T} from 'react';
import {Link} from 'react-router/es6';

import config from 'config';

import tblStyles from 'styles/tables.css';
import f from 'styles/foundation';

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

export default Footer;
