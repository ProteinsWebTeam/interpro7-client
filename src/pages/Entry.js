/* @flow */
import React, {PropTypes as T, cloneElement} from 'react';
import {Link} from 'react-router/es';
import ColorHash from 'color-hash/lib/color-hash';
import Table, {Column, Search, PageSizeSelector, Exporter}
  from 'components/Table';

import {removeLastSlash} from 'utils/url';

const colorHash = new ColorHash();

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
          <PageSizeSelector/>
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
          <Column accessKey="name">Name</Column>
          <Column
            accessKey="type"
            renderer={(type) => (
              <interpro-type type={type} expanded>{type}</interpro-type>
            )}
          >Type</Column>
        </Table>
      );
  } else if (data.metadata) { // Single Entry page + including menu
    main = (
        <div>
          {children && cloneElement(children, {data})}
        </div>
      );
  } else if (data.entries) { // Member Database page
    main = (
        <div>
          <div style={{display: 'flex'}}>
            {Object.entries(data.entries.member_databases)
              .map(([name, count]) => (
                <Link
                  to={`${removeLastSlash(pathname)}/${name}`}
                  style={{
                    flex: count,
                    textAlign: 'center',
                    padding: '1em 0',
                    backgroundColor: colorHash.hex(name),
                  }}
                  key={name}
                >
                  {name} ({count})
                </Link>
              ))
            }
          </div>
          <div style={{display: 'flex'}}>
            <Link
              to={`${removeLastSlash(pathname)}/interpro`}
              style={{
                flex: data.entries ? data.entries.interpro : 1,
                textAlign: 'center',
                padding: '1em 0',
                backgroundColor: colorHash.hex('interpro'),
              }}
            >
              InterPro ({data.entries ? data.entries.interpro : 0})
            </Link>
          </div>
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
