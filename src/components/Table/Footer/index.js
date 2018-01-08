// @flow
/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }]*/
import React from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import config from 'config';

import { foundationPartial } from 'styles/foundation';
import s from '../style.css';
const f = foundationPartial(s);

const getPageLabels = (page, lastPage) => {
  let pages = [...Array(lastPage).keys()];
  const maxPagesDisplayed = 7;
  pages.splice(0, 1);
  if (lastPage > maxPagesDisplayed) {
    if (page < maxPagesDisplayed / 2) {
      pages = [1, 2, 3, 4, '…', lastPage];
    } else if (page > lastPage - maxPagesDisplayed / 2) {
      pages = [1, '…', lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
    } else {
      pages = [1, '…', page - 1, page, page + 1, '…', lastPage];
    }
  }
  return pages;
};

const Footer = ({
  actualSize /*: number */,
  pagination /*: Object */,
  notFound,
}) => {
  const page = parseInt(pagination.page || 1, 10);
  const pageSize = parseInt(
    pagination.page_size || config.pagination.pageSize,
    10,
  );
  const lastPage = Math.ceil(actualSize / pageSize) || 1;
  const pages = getPageLabels(page, lastPage);
  if (notFound) {
    return null;
  }
  return (
    <div className={f('pagination-box')}>
      <ul
        className={f('pagination', 'text-right')}
        role="navigation"
        aria-label="Pagination"
      >
        {page === 1 ? (
          <li className={f('disabled')}>
            Previous <span className={f('show-for-sr')}>You’re on page</span>
          </li>
        ) : (
          <li>
            <Link
              to={customLocation => ({
                ...customLocation,
                search: {
                  ...customLocation.search,
                  page: (customLocation.search.page || 1) - 1,
                  page_size: pageSize,
                  search: pagination.search,
                },
              })}
            >
              Previous
            </Link>
          </li>
        )}
        {pages.map(e => {
          if (e === '…') {
            return <li key={e} className={f('ellipsis')} />;
          } else if (page === e) {
            return (
              <li key={e} className={f('current')}>
                <span className={f('show-for-sr')}>You’re on page</span>
                {e}
              </li>
            );
          }
          return (
            <li key={e} className={page === e ? f('current') : ''}>
              <Link
                to={customLocation => ({
                  ...customLocation,
                  search: {
                    ...customLocation.search,
                    page: e,
                    page_size: pageSize,
                    search: pagination.search,
                  },
                })}
              >
                {e}
              </Link>
            </li>
          );
        })}
        {page === lastPage ? (
          <li className={f('disabled')}>
            Next <span className={f('show-for-sr')}>You’re on page</span>
          </li>
        ) : (
          <li>
            <Link
              to={customLocation => ({
                ...customLocation,
                search: {
                  ...customLocation.search,
                  page: (customLocation.search.page || 1) + 1,
                },
              })}
            >
              Next
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};
Footer.propTypes = {
  data: T.array,
  actualSize: T.number,
  pagination: T.object.isRequired,
  notFound: T.bool,
};

export default Footer;
