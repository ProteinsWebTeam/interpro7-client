import React, {PropTypes as T} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import Table, {Column, Search, /*PageSizeSelector,*/ Exporter}
  from 'components/Table';

import {removeLastSlash, buildLink} from 'utils/url';

import styles from 'styles/blocks.css';
import f from 'styles/foundation';

const Summary = createAsyncComponent(
  () => import('components/Structure/Summary')
);

const Structure = (
  {data, location: {query, pathname}, dataUrl}
  /*: {
    data: {
      results?: Array<Object>,
      structure?: Object,
      metadata?: Object,
    },
    location: {query: Object, pathname: string},
    dataUrl: string,
  } */
) => {
  let main;
  if (!data) {
    main = <div>Loading data...</div>;
  } else if (Array.isArray(data.results)) { // List of structures
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
        {/*<PageSizeSelector/>*/}
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
  } else if (data.metadata) { // Single Entry page
    main = (
      <div>
        <Summary data={data} location={{pathname}} />
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
  return (
    <main>
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          {main}
        </div>
      </div>
    </main>
  );
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

export default connect(({data: {urlKey, data}}) => ({urlKey, data}))(Structure);
