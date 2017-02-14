import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';
import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import Table, {Column, Search, /*PageSizeSelector,*/ Exporter}
  from 'components/Table';

import {removeLastSlash, buildLink} from 'utils/url';

import styles from 'styles/blocks.css';
import f from 'styles/foundation';

const _Summary = createAsyncComponent(
  () => import('components/Structure/Summary')
);

const Overview = ({data: {payload, loading}, location: {pathname}}) => {
  if (loading) return <div>Loading...</div>;
  return (
    <ul className={styles.card}>
      {Object.entries(payload.structures || {}).map(([name, count]) => (
        <li key={name}>
          <Link to={`${pathname}/${name}`}>
            {name} ({count})
          </Link>
        </li>
      ))}
    </ul>
  );
};

const List = ({data: {payload, loading}, location: {pathname}}) => {
  if (loading) return <div>Loading...</div>;
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
          <li><a href={''}>Open in API web view</a></li>
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
};

const Summary = ({data: {payload, loading}, location}) => {
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <_Summary data={payload} location={location} />
    </div>
  )
};

const Structure = ({...props}) => (
  <main>
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <Switch
          {...props}
          base="structure"
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

export default loadData()(Structure);
