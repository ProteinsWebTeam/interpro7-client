/* @flow */
import React, {PropTypes as T, cloneElement} from 'react';
import {Link} from 'react-router/es';
import ColorHash from 'color-hash/lib/color-hash';

import Table, {Column, Search, PageSizeSelector, Exporter}
  from 'components/Table';

import {removeLastSlash, buildLink} from 'utils/url';

import styles from 'styles/blocks.css';
import f from 'styles/foundation';


const SVG_WIDTH = 100;
const colorHash = new ColorHash();

const Protein = (
  {data, location: {query, pathname}, dataUrl, children}
  /*: {
    data: {
      results?: Array<Object>,
      proteins?: Object,
      metadata?: Object,
    },
    location: {pathname: string, query: Object},
    dataUrl: string,
    children: React$Element<any>,
  } */
) => {
  let main;
  if (!data) {
    main = 'Loading...';
  } else if (Array.isArray(data.results)) { // List of proteins
    const maxLength = data.results.reduce((max, result) => (
      Math.max(max, (result.metadata || result).length)
    ), 0);
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
            <PageSizeSelector pageSize={query.page_size}/>
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
        </div>
      </div>
    );
  } else if (data.metadata) { // Single Protein page
    main = (
      <div>
        {cloneElement(children, {data})
          /* The children content defined in routes points to
             components/Protein/Summary
           */
        }
      </div>
    );
  } else if (data.proteins) { // List of protein databases
    main = (
      <ul className={styles.card}>
        {Object.entries(data.proteins).map(([name, count]) => (
          <li key={name}>
            <Link to={`${removeLastSlash(pathname)}/${name}`}>
              {name} ({count})
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return <main>{main}</main>;
};
Protein.propTypes = {
  data: T.object,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  dataUrl: T.string,
  children: T.node,
};
Protein.dataUrlMatch = /^protein/i;

export default Protein;
