import React, {PropTypes as T} from 'react';
import Link from 'components/Link';
import {connect} from 'react-redux';

import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import {webComponents} from 'utils/polyfills';

import Table, {
  Column, Search, /*PageSizeSelector,*/ Exporter,
} from 'components/Table';

import {removeLastSlash} from 'utils/url';

import f from 'styles/foundation';

(async () => {
  // Waits for Web Components tobe present somehow (native or polyfill)
  await webComponents();
  // Then, load the webcomponents needed
  import('interpro-components/src');
})();

const Summary = createAsyncComponent(() => import('components/Entry/Summary'));

const Entry = (
  {data, location: {query, pathname}, dataUrl}
  /*: {
    data: {
      results?: Array<Object>,
      entries?: {
        member_databases: Object,
        interpro: number,
        unintegrated: number
      },
      metadata?: Object,
     },
    location: {pathname: string, query: Object},
    dataUrl: string,
  } */
) => {
  let main;
  if (!data) {
    main = <div>Loading data...</div>;
  } else if (Array.isArray(data.results)) { // List of entries
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
        {/*<PageSizeSelector />*/}
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
    );
  } else if (data.metadata) { // Single Entry page
    main = (
      <div>
        <Summary data={data} location={{pathname}} />
      </div>
    );
  } else if (data.entries) { // List of Member Databases
    main = (
        <div>
          Member databases:
          <ul>
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
  } else {
    // TODO: Improve message and navigation out of it.
    main = <div>There are no entries with the exiting filters.</div>;
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
Entry.propTypes = {
  data: T.object,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  dataUrl: T.string,
};
Entry.dataUrlMatch = /^entry/i;

export default connect(({data: {urlKey, data}}) => ({urlKey, data}))(Entry);
