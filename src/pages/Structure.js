// @flow
import React, {PropTypes as T, cloneElement} from 'react';
import {Link} from 'react-router/es';

import Title from 'components/Title';
import Table, {Column, Search, PageSizeSelector, Exporter}
  from 'components/Table';

import {removeLastSlash, buildLink} from 'utils/url';

import styles from 'styles/blocks.css';

const Structure = (
  {data, location: {query, pathname}, dataUrl, children}
  /*: {
    data: {
      results?: Array<Object>,
      structure?: Object,
      metadata?: Object,
    },
    location: {query: Object, pathname: string},
    dataUrl: string,
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
        </div>
        {cloneElement(children, {data})}
      </div>
    );
  } else if (data.structures) {
    main = (
      <ul className={styles.card}>
        {Object.entries(data.structures).map(([name, count]) => (
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
Structure.propTypes = {
  data: T.object,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  dataUrl: T.string,
  children: T.node,
};
Structure.dataUrlMatch = /^structure/i;

export default Structure;
