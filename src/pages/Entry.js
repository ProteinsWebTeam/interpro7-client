import React, {PropTypes as T} from 'react';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';
import loadWebComponent from 'utils/loadWebComponent';

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
  isStale: T.bool.isRequired,
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

const List = ({data, isStale, location: {search, pathname}}) => {
  let _payload = data.payload;
  const HTTP_OK = 200;
  const notFound = !data.loading && data.status !== HTTP_OK;
  if (data.loading || notFound) {
    _payload = {
      results: [],
    };
  }
  loadWebComponent(
    () => import(
      /* webpackChunkName: "interpro-components" */'interpro-components'
    ).then(m => m.InterproType),
  ).as('interpro-type');
  return (
    <Table
      dataTable={_payload.results}
      isStale={isStale}
      actualSize={_payload.count}
      query={search}
      pathname={pathname}
      notFound={notFound}
    >
      <Exporter>
        <ul>
          <li>
            <a href={`${''}&format=json`} download="proteins.json">
              JSON
            </a><br/></li>
          <li><a href={`${''}`}>Open in API web view</a></li>
        </ul>
      </Exporter>
      <PageSizeSelector />
      <SearchBox
        search={search.search}
        pathname={pathname}
      >
        Search entries:
      </SearchBox>
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

const SummaryAsync = createAsyncComponent(() => import(
  /* webpackChunkName: "entry-summary" */'components/Entry/Summary'
));
const StructureAsync = createAsyncComponent(() => import(
  /* webpackChunkName: "structure-subpage" */'subPages/Structure'
));
const ProteinAsync = createAsyncComponent(() => import(
  /* webpackChunkName: "protein-subpage" */'subPages/Protein'
));

const pages = new Set([
  {path: 'structure', component: StructureAsync},
  {path: 'protein', component: ProteinAsync},
]);

const SummaryAsync2 = ({data: {payload}, location}) => (
  <SummaryAsync data={payload} location={location} />
);

const Summary = (props) => {
  const {data: {payload, loading}, location, match} = props;
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <Switch
        {...props}
        main="entry"
        base={match}
        indexRoute={SummaryAsync2}
        childRoutes={pages}
      />

    </div>
  );
};
Summary.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.object,
    status: T.number,
  }).isRequired,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  match: T.string,
};

const dbs = new RegExp(
  `^(${memberDB
    .map(db => db.apiType)
    .filter(db => db)
    .join('|')})$`,
  'i'
);
const dbAccs = new RegExp(
  `^(${memberDB
    .map(db => db.accession)
    .filter(db => db)
    .join('|')}|IPR[0-9]{6})$`,
  'i'
);

// Keep outside! Otherwise will be redefined at each render of the outer Switch
const InnerSwitch = ({match, ...props}) => (
  <Switch
    {...props}
    base={match}
    indexRoute={List}
    childRoutes={[
      {path: dbs, component: List},
      {path: dbAccs, component: Summary},
    ]}
  />
);
InnerSwitch.propTypes = {
  match: T.string,
};
const Entry = ({...props}) => (
  <main>
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <Switch
          {...props}
          base="entry"
          indexRoute={Overview}
          catchAll={InnerSwitch}
        />
      </div>
    </div>
  </main>
);
export default loadData()(Entry);
