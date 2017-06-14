import React, {PureComponent} from 'react';
import T from 'prop-types';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';
import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import Table, {Column, SearchBox, PageSizeSelector, Exporter}
  from 'components/Table';

import styles from 'styles/blocks.css';
import f from 'styles/foundation';

const EntryAsync = createAsyncComponent(() => import(
  /* webpackChunkName: "entry-subpage" */'subPages/Entry'
));
const ProteinAsync = createAsyncComponent(() => import(
  /* webpackChunkName: "protein-subpage" */'subPages/Protein'
));
const SummaryAsync = createAsyncComponent(() => import(
  /* webpackChunkName: "structure-summary" */'components/Structure/Summary'
));

const propTypes = {
  data: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
  }).isRequired,
  isStale: T.bool.isRequired,
  location: T.shape({
    description: T.object.isRequired,
    search: T.object.isRequired,
  }).isRequired,
};

const Overview = ({data: {payload, loading}, location: {search: {type}}}) => {
  if (loading) return <div>Loading…</div>;
  return (
    <ul className={styles.card}>
      {Object.entries(payload.structures || {}).map(([name, count]) => (
        <li key={name}>
          <Link
            newTo={{
              description: {mainType: 'structure', mainDB: name},
              search: {type},
            }}
          >
            {name} ({count})
          </Link>
        </li>
      ))}
    </ul>
  );
};
Overview.propTypes = propTypes;

const List = ({
  data: {payload, loading, status},
  isStale,
  location: {search},
}) => {
  let _payload = payload;
  const HTTP_OK = 200;
  const notFound = !loading && status !== HTTP_OK;
  if (loading || notFound) {
    _payload = {
      results: [],
    };
  }
  return (
    <Table
      dataTable={_payload.results}
      isStale={isStale}
      actualSize={_payload.count}
      query={search}
      pathname={''}
      notFound={notFound}
    >
      <Exporter>
        <ul>
          <li>
            <a
              href={`${''}&format=json`}
              download="structures.json"
            >JSON</a><br/></li>
          <li><a href={''}>Open in API web view</a></li>
        </ul>
      </Exporter>
      <PageSizeSelector/>
      <SearchBox
        search={search.search}
        pathname={''}
      >
        Search structures
      </SearchBox>
      <Column
        accessKey="accession"
        renderer={(accession/*: string */) => (
          <Link
            newTo={location => ({
              ...location,
              description: {
                mainType: location.description.mainType,
                mainDB: location.description.mainDB,
                mainAccession: accession,
              },
            })}
          >
            {accession}
          </Link>
        )}
      >
        Accession
      </Column>
      <Column
        accessKey="name"
        renderer={
          (name/*: string */, {accession}/*: {accession: string} */) => (
            <Link
              newTo={location => ({
                ...location,
                description: {
                  mainType: location.description.mainType,
                  mainDB: location.description.mainDB,
                  mainAccession: accession,
                },
              })}
            >
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
          <Link
            newTo={location => ({
              ...location,
              description: {
                mainType: location.description.mainType,
                mainDB: location.description.mainDB,
              },
            })}
          >
            {db}
          </Link>
        )}
      >
        Source Database
      </Column>
    </Table>
  );
};
List.propTypes = propTypes;

const SummaryComponent = ({data: {payload}, location}) => (
  <SummaryAsync data={payload} location={location} />
);
SummaryComponent.propTypes = {
  data: T.shape({
    payload: T.any,
  }).isRequired,
  location: T.object.isRequired,
};

const pages = new Set([
  {value: 'entry', component: EntryAsync},
  {value: 'protein', component: ProteinAsync},
]);
const Summary = props => {
  const {data: {loading}} = props;
  if (loading) return <div>Loading…</div>;
  return (
    <Switch
      {...props}
      locationSelector={
        l => l.description.mainDetail || l.description.focusType
      }
      indexRoute={SummaryComponent}
      childRoutes={pages}
    />
  );
};
Summary.propTypes = {
  data: T.shape({
    loading: T.bool.isRequired,
  }).isRequired,
  location: T.object.isRequired,
};

// Keep outside! Otherwise will be redefined at each render of the outer Switch
const InnerSwitch = (props) => (
  <Switch
    {...props}
    locationSelector={
      l => l.description.mainAccession || l.description.focusType
    }
    indexRoute={List}
    childRoutes={[
      {value: /^[a-z\d]{4}$/i, component: Summary},
    ]}
    catchAll={List}
  />
);

class Structure extends PureComponent {
  render() {
    return (
      <main>
        <div className={f('row')}>
          <div className={f('large-12', 'columns')}>
            <Switch
              {...this.props}
              locationSelector={l => l.description.mainDB}
              indexRoute={Overview}
              catchAll={InnerSwitch}
            />
          </div>
        </div>
      </main>
    );
  }
}

export default loadData()(Structure);
// loadData will create an component that wraps Structure.
// Such component will request content and it will put it in the state and make
// it available for its children. Because there are not parameters when invoking
// the method,the data is requested from the api based on the current URL
