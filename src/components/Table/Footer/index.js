import React, {PropTypes as T} from 'react';
import {Link} from 'react-router/es6';

import config from 'config';

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
  let pages = [...Array(lastPage).keys()];
  if (lastPage>7){
    if (page<4)
      pages= [1,2,3,4,"...",lastPage];
    else if (page>lastPage-4)
      pages= [1,"...",lastPage-3,lastPage-2,lastPage-1,lastPage];
    else
      pages = [1, "...", page-1,page,page+1, "...", lastPage];
  }else
    pages.splice(0,1);
  return (
    <div>
        <div className={f("float-left")}>
          {`Showing ${index} to ${index + data.results.length - 1} of ${data.count} results`}
        </div>
        <ul
          className={f('pagination', 'text-right')}
          role="navigation"
          aria-label="Pagination"
        >
          {(page==1)?<li className={f("disabled")}>Previous <span className={f("show-for-sr")}>You're on page</span></li>:
            <li>
              <Link to={{pathname, query: {
                page: page-1,
                page_size: pageSize,
                search: pagination.search}}}
              >Previous</Link>

            </li>
          }
          { pages.map(e=>{
              if (e=="...")
                return <li className={f("ellipsis")} aria-hidden="true" />;
              else if (page==e)
                return (
                  <li className={f("current")} aria-hidden="true">
                    <span className={f("show-for-sr")}>You're on page</span>{e}
                  </li>);
              return(
                <li className={page==e?f("current"):""}>
                  <Link to={{pathname, query: {
                    page: e,
                    page_size: pageSize,
                    search: pagination.search}}}>
                    {e}
                  </Link>
                </li>
            )})
          }
          {(page==lastPage)?<li className={f("disabled")}>Next <span className={f("show-for-sr")}>You're on page</span></li>:
            <li>
              <Link to={{pathname, query: {
                page: page+1,
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
  width: T.number.isRequired,
};

export default Footer;
