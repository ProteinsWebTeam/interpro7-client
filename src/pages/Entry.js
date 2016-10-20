/* @flow */
import React, {PropTypes as T, cloneElement} from 'react';
import {Link} from 'react-router/es6';
import ColorHash from 'color-hash/lib/color-hash';

import pageNavigation from 'components/PageNavigation';

import Table, {Column, Search, PageSizeSelector} from 'components/Table';
import Title from 'components/Title';

import {removeLastSlash} from 'utils/url';

import styles from 'styles/blocks.css';

const page = 'entry';
const EntryPageNavigation = pageNavigation(page);

const colorHash = new ColorHash();

const Entry = (
  {data, location: {query, pathname}, children}
  /*: {
    data: {
      results?: Array<Object>,
      entries?: {member_databases: Object, interpro: number},
      metadata?: Object,
     },
    location: {pathname: string, query: Object},
    children: React$Element<any>,
  } */
) => {
  let main;
  if (data) {
    if (Array.isArray(data.results)) {
      main = (
        <Table
          data={data}
          query={query}
          pathname={pathname}
        >
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
          <Column accessKey="type">Type</Column>
        </Table>
      );
    } else if (data.metadata) {
      main = (
        <div>
          <div style={{display: 'flex'}}>
            <div style={{flexGrow: 3}}>
              <Title metadata={data.metadata} pathname={pathname}/>
            </div>
            <div style={{flexGrow: 1}}>
              <EntryPageNavigation
                accession={data.metadata.accession}
                counters={data.metadata.counters}
                pathname={pathname}
              />
            </div>
          </div>
          {cloneElement(children, {data})}
        </div>
      );
    } else if (data.entries) {
      main = (
        <div>
          <div style={{display: 'flex'}} className={styles.card}>
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
          <div style={{display: 'flex'}} className={styles.card}>
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
  } else {
    // TODO: Improve message and navigation out of it.
    main = <div>There are no entries with the exiting filters.</div>;
  }
  return <main>{main}</main>;
};
Entry.propTypes = {
  data: T.object,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  children: T.node,
};
Entry.dataUrlMatch = /^entry/i;

export default Entry;
