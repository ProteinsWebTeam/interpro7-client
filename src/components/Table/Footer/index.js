// @flow
/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }]*/
import React from 'react';
import T from 'prop-types';

import PageSizeSelector from '../PageSizeSelector';
// $FlowFixMe
import CursorPaginationLinks from './CursorPaginationLinks';
// $FlowFixMe
import NumberedPaginationLinks from './NumberedPaginationLinks';
import { getCursor } from 'utils/url';

import { foundationPartial } from 'styles/foundation';

import s from '../style.css';

const f = foundationPartial(s);

const Footer = (
  {
    withPageSizeSelector,
    actualSize,
    pagination,
    notFound,
    nextAPICall,
    previousAPICall,
  } /*: {withPageSizeSelector: boolean, actualSize: number, pagination: Object, notFound: boolean, nextAPICall: string, previousAPICall: string } */,
) => {
  if (notFound) return null;

  const nextCursor = getCursor(nextAPICall);
  const previousCursor = getCursor(previousAPICall);

  return (
    <div className={f('table-footer')}>
      <div className={f('table-footer-content')}>
        {withPageSizeSelector && <PageSizeSelector search={pagination} />}
        <div className={f('pagination-box')}>
          <ul
            className={f('pagination', 'text-right')}
            role="navigation"
            aria-label="Pagination"
          >
            {nextCursor || previousCursor ? (
              <CursorPaginationLinks
                next={nextCursor}
                previous={previousCursor}
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
Footer.propTypes = {
  withPageSizeSelector: T.bool.isRequired,
  actualSize: T.number,
  pagination: T.object.isRequired,
  notFound: T.bool,
  nextAPICall: T.string,
  previousAPICall: T.string,
};

export default Footer;
