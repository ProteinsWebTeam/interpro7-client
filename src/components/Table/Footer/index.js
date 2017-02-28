/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }]*/
import React, {PropTypes as T} from 'react';
import Link from 'components/generic/Link';

import config from 'config';

import f from 'styles/foundation';

const getPageLabels = (page, lastPage) => {
  let pages = [...Array(lastPage).keys()];
  const maxPagesDisplayed = 7;
  pages.splice(0, 1);
  if (lastPage > maxPagesDisplayed){
    if (page < maxPagesDisplayed / 2) {
      pages = [1, 2, 3, 4, '...', lastPage];
    } else if (page > lastPage - maxPagesDisplayed / 2) {
      pages = [1, '...', lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
    } else {
      pages = [1, '...', page - 1, page, page + 1, '...', lastPage];
    }
  }
  return pages;
};

const Footer = (
  {data, pagination, pathname}
  /*: {data: Object, pagination: Object, pathname: string, width: number} */
) => {
  const page = parseInt(pagination.page || 1, 10);
  const pageSize = parseInt(
      pagination.page_size || config.pagination.pageSize, 10
    );
  const index = (page - 1) * pageSize + 1;
  const lastPage = Math.ceil(data.count / pageSize) || 1;
  const pages = getPageLabels(page, lastPage);

  return (
    <div>
        <div className={f('float-left')}>
          {`Showing ${index} to ${index + data.results.length - 1}
            of ${data.count} results`}
        </div>
        <ul
          className={f('pagination', 'text-right')}
          role="navigation"
          aria-label="Pagination"
        >
          {(page === 1) ?
            <li className={f('disabled')}>
              Previous <span className={f('show-for-sr')}>You're on page</span>
            </li> :
            <li>
              <Link to={{pathname, search: {
                page: page - 1,
                page_size: pageSize,
                search: pagination.search}}}
              >Previous</Link>
            </li>
          }
          {
            pages.map((e, i) => {
              if (e === '...') {
                return <li key={i} className={f('ellipsis')}/>;
              } else if (page === e) {
                return (
                  <li key={i} className={f('current')}>
                    <span className={f('show-for-sr')}>You're on page</span>{e}
                  </li>
                );
              }
              return (
                <li key={i} className={page === e ? f('current') : ''}>
                  <Link
                    to={{
                      pathname,
                      search: {
                        page: e,
                        page_size: pageSize,
                        search: pagination.search,
                      },
                    }}
                  >
                    {e}
                  </Link>
                </li>
              );
            })
          }
          {(page === lastPage) ?
            <li className={f('disabled')}>
              Next <span className={f('show-for-sr')}>You're on page</span>
            </li> :
            <li>
              <Link to={{pathname, search: {
                page: page + 1,
                page_size: pageSize,
                search: pagination.search}}}
              >Next</Link>
            </li>
          }
        </ul>
    </div>
  );
};
Footer.propTypes = {
  data: T.object.isRequired,
  pagination: T.object.isRequired,
  pathname: T.string.isRequired,
};

export default Footer;
