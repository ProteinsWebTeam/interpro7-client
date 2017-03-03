import React, {PropTypes as T} from 'react';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';
import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import ColorHash from 'color-hash/lib/color-hash';

import Table, {Column, SearchBox, PageSizeSelector, Exporter}
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

const List = ({data: {payload, loading}, location: {pathname, search}}) => {
  if (loading) return <div>Loading...</div>;
  const maxLength = payload.results.reduce((max, result) => (
    Math.max(max, (result.metadata || result).length)
  ), 0);
  return (
    <Table
      data={payload}
      query={search}
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
      <PageSizeSelector/>
      <SearchBox>Search proteins</SearchBox>
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

const SummaryAsync = createAsyncComponent(() => import('components/Protein/Summary'));
const StructureAsync = createAsyncComponent(() => import('subPages/Structure'));
const EntryAsync = createAsyncComponent(() => import('subPages/Entry'));

const pages = new Set([
  {path: 'structure', component: StructureAsync},
  {path: 'entry', component: EntryAsync},
]);

const Summary = (props) => {
  const {data: {payload, loading}, location, match} = props;
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <Switch
        {...props}
        main="protein"
        base={match}
        indexRoute={() => <SummaryAsync data={payload} location={location} />}
        childRoutes={pages}
      />

    </div>
  );
};
Summary.propTypes = {props: propTypes};

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
              childRoutes={[
                {path: /[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}/i, component: Summary},
              ]}
            />
          )}
        />
      </div>
    </div>
  </main>
);

export default loadData()(Protein);
