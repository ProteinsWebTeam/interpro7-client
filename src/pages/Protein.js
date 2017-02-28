import React, {PropTypes as T} from 'react';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';
import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import ColorHash from 'color-hash/lib/color-hash';

import Table, {Column, Search, /* PageSizeSelector,*/ Exporter}
  from 'components/Table';

import {removeLastSlash, buildLink} from 'utils/url';

import styles from 'styles/blocks.css';
import f from 'styles/foundation';

const SVG_WIDTH = 100;
const colorHash = new ColorHash();

const propTypes = {
  data: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
  }).isRequired,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
};

const Overview = ({data: {payload, loading}, location: {pathname}}) => {
  if (loading) return <div>Loading...</div>;
  return (
    <ul className={styles.card}>
      {Object.entries(payload.proteins || {}).map(([name, count]) => (
          <li key={name}>
            <Link to={`${removeLastSlash(pathname)}/${name}`}>
              {name} ({count})
            </Link>
          </li>
        ))}
    </ul>
  );
};
Overview.propTypes = propTypes;

const List = ({data: {payload, loading}, location: {pathname}}) => {
  if (loading) return <div>Loading...</div>;
  const maxLength = payload.results.reduce((max, result) => (
    Math.max(max, (result.metadata || result).length)
  ), 0);
  return (
    <Table
      data={payload}
      query={{}}
      pathname={pathname}
    >
      <Exporter>
        <ul>
          <li>
            <a
              href={`${''}&format=json`}
              download="proteins.json"
            >JSON</a><br/></li>
          <li><a href={`${''}`}>Open in API web view</a></li>
        </ul>
      </Exporter>
      {/* <PageSizeSelector pageSize={query.page_size}/>*/}
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
};
List.propTypes = propTypes;

const _Summary = createAsyncComponent(
  () => import('components/Protein/Summary')
);

const Summary = ({data: {payload, loading}, location}) => {
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <_Summary data={payload} location={location} />
    </div>
  );
};
Summary.propTypes = propTypes;

const Protein = ({...props}) => (
  <main>
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <Switch
          {...props}
          base="protein"
          indexRoute={Overview}
          catchAll={({match, ...props}) => (
            <Switch
              {...props}
              base={match}
              indexRoute={List}
              catchAll={Summary}
            />
          )}
        />
      </div>
    </div>
  </main>
);

export default loadData()(Protein);
