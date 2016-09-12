/* @flow */
import React, {PropTypes as T, cloneElement} from 'react';
import {Link} from 'react-router/es6';
import ColorHash from 'color-hash/lib/color-hash';

import pageNavigation from 'components/PageNavigation';

import Title from 'components/Title';
import Table, {Column, Search} from 'components/Table';

import {removeLastSlash, buildLink} from 'utils/url';

import styles from 'styles/blocks.css';

const page = 'structure';
const StructurePageNavigation = pageNavigation(page);

const colorHash = new ColorHash();

const Structure = (
  {data, location: {query, pathname}, children}
  /*: {
    data: {
      results?: Array<Object>,
      structure?: Object,
      metadata?: Object,
    },
    location: {query: Object, pathname: string},
    children: React$Element<any>
  } */
) => {
  let main;
  if (Array.isArray(data.results)) {
    main = (
      <Table
        data={data}
        query={query}
        pathname={pathname}
      >
        <Search>Search structures</Search>
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
          accessKey="source_database"
          renderer={(db/*: string */) => (
            <Link to={buildLink(pathname, 'structure', db)}>{db}</Link>
          )}
        >
          Source Database
        </Column>
      </Table>
    );
  } else if (data.metadata) {
    main = (
      <div>
        <div style={{display: 'flex'}}>
          <div style={{flexGrow: 3}}>
            <Title metadata={data.metadata} pathname={pathname} />
          </div>
          <div style={{flexGrow: 1}}>
            <StructurePageNavigation
              accession={data.metadata.accession}
              counters={data.metadata.counters}
              pathname={pathname}
            />
          </div>
        </div>
        {cloneElement(children, {data})}
      </div>
    );
  } else if (data.structures) {
    main = (
      <div style={{display: 'flex'}} className={styles.card}>
        {Object.entries(data.structures).map(([name, count]) => (
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
        ))}
      </div>
    );
  }
  return <main>{main}</main>;
};
Structure.propTypes = {
  data: T.object,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  children: T.node,
};
Structure.dataUrlMatch = /^structure/i;

export default Structure;
