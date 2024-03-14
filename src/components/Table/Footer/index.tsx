import React from 'react';

import PageSizeSelector from '../PageSizeSelector';
import CursorPaginationLinks from './CursorPaginationLinks';
import NumberedPaginationLinks from './NumberedPaginationLinks';

import { getCursor } from 'utils/url';

import cssBinder from 'styles/cssBinder';

import s from '../style.css';

const css = cssBinder(s);

type Props = {
  withPageSizeSelector: boolean;
  actualSize: number;
  pagination: {
    page?: string;
    page_size?: string;
  };
  notFound: boolean;
  nextAPICall?: string | null;
  previousAPICall?: string | null;
};
const Footer = ({
  withPageSizeSelector,
  actualSize,
  pagination,
  notFound,
  nextAPICall,
  previousAPICall,
}: Props) => {
  if (notFound) return null;

  const nextCursor = getCursor(nextAPICall);
  const previousCursor = getCursor(previousAPICall);

  return (
    <div className={css('table-footer')}>
      <div className={css('table-footer-content')}>
        {withPageSizeSelector && <PageSizeSelector search={pagination} />}
        <div className={css('pagination-box')}>
          <ul
            className={css('pagination', 'text-right')}
            role="navigation"
            aria-label="Pagination"
          >
            {nextCursor || previousCursor ? (
              <CursorPaginationLinks
                next={nextCursor as string}
                previous={previousCursor as string}
              />
            ) : (
              <NumberedPaginationLinks
                pagination={pagination}
                actualSize={actualSize}
              />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
