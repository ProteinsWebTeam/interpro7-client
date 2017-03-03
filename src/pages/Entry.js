import React, {PropTypes as T} from 'react';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';

import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import Table, {
  Column, SearchBox, PageSizeSelector, Exporter,
} from 'components/Table';

import {removeLastSlash} from 'utils/url';

import styles from 'styles/blocks.css';
import f from 'styles/foundation';
import {memberDB} from 'staticData/home';

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
      <div>
        Member databases:
        <ul className={styles.card}>
          {Object.entries(payload.entries.member_databases)
            .map(([name, count]) => (
              <li key={name}>
                <Link to={`${removeLastSlash(pathname)}/${name}`}>
                  {name} ({count})
                </Link>
              </li>
            ))
          }
        </ul>
        <ul className={styles.card}>
          <li>
            <Link to={`${removeLastSlash(pathname)}/interpro`}>
              InterPro ({payload.entries ? payload.entries.interpro : 0})
            </Link>
          </li>
          <li>
            <Link to={`${removeLastSlash(pathname)}/unintegrated`}>
              Unintegrated ({payload.entries ? payload.entries.unintegrated : 0})
            </Link>
          </li>
        </ul>
      </div>
  );
};
Overview.propTypes = propTypes;

const List = ({data: {payload, loading}, location: {search, pathname}}) => {
  if (loading) return <div>Loading...</div>;
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
      <PageSizeSelector />
      <SearchBox>Search entries</SearchBox>
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
};
List.propTypes = propTypes;

const SummaryAsync = createAsyncComponent(() => import('components/Entry/Summary'));
const StructureAsync = createAsyncComponent(() => import('subPages/Structure'));
const ProteinAsync = createAsyncComponent(() => import('subPages/Protein'));

const pages = new Set([
  {path: 'structure', component: StructureAsync},
  {path: 'protein', component: ProteinAsync},
]);

const Summary = (props) => {
  const {data: {payload, loading}, location, match} = props;
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <Switch
        {...props}
        main="entry"
        base={match}
        indexRoute={() => <SummaryAsync data={payload} location={location} />}
        childRoutes={pages}
      />

    </div>
  );
};
Summary.propTypes = propTypes;

const Entry = ({...props}) => {
  const dbs = new RegExp(
    '^('+memberDB
      .map(db=>db.apiType)
      .filter(db=>db)
      .join("|")+')$',
    'i'
  );
  const db_accs =new RegExp(
    '^('+memberDB
      .map(db=>db.accession)
      .filter(db=>db)
      .join("|")+'|IPR\d{6})$',
    'i'
  );
  return (
    <main>
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <Switch
            {...props}
            base="entry"
            indexRoute={Overview}
            catchAll={({match, ...props}) => (
              <Switch
                {...props}
                base={match}
                indexRoute={List}
                childRoutes={[
                  {path: dbs, component: List},
                  {path: db_accs, component: Summary},
                ]}
              />
            )}
          />
        </div>
      </div>
    </main>
  );
}
export default loadData()(Entry);
