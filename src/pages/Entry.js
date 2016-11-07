/* @flow */
import React, {PropTypes as T, cloneElement} from 'react';
import {Link} from 'react-router/es';

import Table, {
  Column, Search, PageSizeSelector, Exporter,
} from 'components/Table';

import {removeLastSlash} from 'utils/url';

import f from 'styles/foundation';

const Entry = (
  {data, location: {query, pathname}, dataUrl, children}
  /*: {
    data: {
      results?: Array<Object>,
      entries?: {member_databases: Object, interpro: number},
      metadata?: Object,
     },
    location: {pathname: string, query: Object},
    dataUrl: string,
    children: React$Element<any>,
  } */
) => {
  let main;
  // if (data) {
  if (Array.isArray(data.results)) { // List of entries
    main = (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <Table
            data={data}
            query={query}
            pathname={pathname}
          >
            <Exporter>
              <ul>
                <li>
                  <a
                    href={`${dataUrl}&format=json`}
                    download="proteins.json"
                  >JSON</a><br/></li>
                <li><a href={`${dataUrl}`}>Open in API web view</a></li>
              </ul>
            </Exporter>
            <PageSizeSelector />
            <Search>Search entries</Search>
            <Column
              accessKey="accession"
              renderer={(acc/*: string */) => (
                <Link to={`${removeLastSlash(pathname)}/${acc}`}>
                  {acc}
                </Link>
              )}
            >
              Accession
            </Column>
            <Column
              accessKey="name"
              renderer={
                (name/*: string */, {accession}/*: {accession: string} */) => (
                  <Link to={`${removeLastSlash(pathname)}/${accession}`}>
                    {name}
                  </Link>
                )
              }
            >
              Name
            </Column>
            <Column
              accessKey="type"
              renderer={(type) => (
                <interpro-type type={type.replace('_', ' ')} expanded>
                  {type}
                </interpro-type>
              )}
            >Type</Column>
          </Table>
        </div>
      </div>
    );
  } else if (data.metadata) { // Single Entry page
    main = (
        <div>
          {children && cloneElement(children, {data})
            /* The children content defined in routes points to
             components/Entry/Summary
             */
          }
        </div>
      );
  } else if (data.entries) { // List of Member Databases
    main = (
        <div>
          <ul>Member databases:
            {Object.entries(data.entries.member_databases)
              .map(([name, count]) => (
                <li key={name}>
                  <Link to={`${removeLastSlash(pathname)}/${name}`}>
                    {name} ({count})
                  </Link>
                </li>
              ))
            }
          </ul>
          <ul>
            <li>
              <Link to={`${removeLastSlash(pathname)}/interpro`}>
                InterPro ({data.entries ? data.entries.interpro : 0})
              </Link>
            </li>
            <li>
              <Link to={`${removeLastSlash(pathname)}/unintegrated`}>
                Unintegrated ({data.entries ? data.entries.unintegrated : 0})
              </Link>
            </li>
          </ul>
        </div>
      );
  }
  // } else {
  //   // TODO: Improve message and navigation out of it.
  //   main = <div>There are no entries with the exiting filters.</div>;
  // }
  return <main>{main}</main>;
};
Entry.propTypes = {
  data: T.object,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  dataUrl: T.string,
  children: T.node,
};
Entry.dataUrlMatch = /^entry/i;

export default Entry;
