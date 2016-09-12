/* @flow */
import React, {PropTypes as T, cloneElement} from 'react';
import {Link} from 'react-router/es6';
import ColorHash from 'color-hash/lib/color-hash';

import pageNavigation from 'components/PageNavigation';

import Table, {Column, Search} from 'components/Table';
import Title from 'components/Title';

import {removeLastSlash, buildLink} from 'utils/url';

import styles from 'styles/blocks.css';

const page = 'protein';
const ProteinPageNavigation = pageNavigation(page);

const SVG_WIDTH = 100;
const colorHash = new ColorHash();

const Protein = (
  {data, location: {query, pathname}, children}
  /*: {
    data: {
      results?: Array<Object>,
      proteins?: Object,
      metadata?: Object,
    },
    location: {pathname: string, query: Object},
    children: React$Element<any>,
  } */
) => {
  let main;
  if (!data) {
    main = 'Loading...';
  } else if (Array.isArray(data.results)) {
    const maxLength = data.results.reduce((max, result) => (
      Math.max(max, (result.metadata || result).length)
    ), 0);
    main = (
      <Table
        data={data}
        query={query}
        pathname={pathname}
      >
        <Search>Search proteins</Search>
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
            <Link to={buildLink(pathname, 'protein', db)}>{db}</Link>
          )}
        >
          Source Database
        </Column>
        <Column
          accessKey="length"
          renderer={(length/*: number */, row) => (
            <div
              title={`${length} amino-acids`}
              style={{
                width: `${length / maxLength * SVG_WIDTH}%`,
                padding: '0.2rem',
                backgroundColor: colorHash.hex(row.accession),
                borderRadius: '0.2rem',
                textAlign: 'start',
                overflowX: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'clip',
              }}
            >
              {length} amino-acids
            </div>
          )}
        >
          Length
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
            <ProteinPageNavigation
              accession={data.metadata.accession}
              counters={data.metadata.counters}
              pathname={pathname}
            />
          </div>
        </div>
        {cloneElement(children, {data})}
      </div>
    );
  } else if (data.proteins) {
    main = (
      <div style={{display: 'flex'}} className={styles.card}>
        {Object.entries(data.proteins).map(([name, count]) => (
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
Protein.propTypes = {
  data: T.object,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  children: T.node,
};
Protein.dataUrlMatch = /^protein/i;

export default Protein;
