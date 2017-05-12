import React, {PureComponent} from 'react';
import T from 'prop-types';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';
import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import Table, {Column, SearchBox, PageSizeSelector, Exporter}
  from 'components/Table';

import {removeLastSlash, buildLink} from 'utils/url';

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
    pathname: T.string.isRequired,
  }).isRequired,
  match: T.string,
};

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
Overview.propTypes = propTypes;

const List = ({
  data: {payload, loading, status},
  isStale,
  location: {pathname, search},
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
      pathname={pathname}
      notFound={notFound}
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
      <PageSizeSelector/>
      <SearchBox
        search={search.search}
        pathname={pathname}
      >
        Search structures
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
List.propTypes = propTypes;

const pages = new Set([
  {path: 'entry', component: EntryAsync},
  {path: 'protein', component: ProteinAsync},
]);
const Summary = props => {
  const {data: {payload, loading}, location, match} = props;
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <Switch
        {...props}
        main="structure"
        base={match}
        indexRoute={() => <SummaryAsync data={payload} location={location} />}
        childRoutes={pages}
      />
    </div>
  );
};
Summary.propTypes = {
  data: T.shape({
    payload: T.object.isRequired,
    loading: T.bool.isRequired,
  }).isRequired,
  location: T.object.isRequired,
  match: T.string.isRequired,
};

// Keep outside! Otherwise will be redefined at each render of the outer Switch
const InnerSwitch = ({match, ...props}) => (
  <Switch
    {...props}
    base={match}
    indexRoute={List}
    childRoutes={[{path: /^\d[a-zA-Z\d]{3}$/, component: Summary}]}
  />
);
InnerSwitch.propTypes = {
  match: T.string,
};

class Structure extends PureComponent {
  componentWillUpdate(nextProps) {
    console.table(
      Object.entries(this.props).map(([key, value]) => ({
        key,
        equal: nextProps[key] === value,
      }))
    );
  }

  render() {
    return (
      <main>
        <div className={f('row')}>
          <div className={f('large-12', 'columns')}>
            <Switch
              {...this.props}
              base="structure"
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
