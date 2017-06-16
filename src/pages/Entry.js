import React, {Component} from 'react';
import T from 'prop-types';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';
import loadWebComponent from 'utils/loadWebComponent';

import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import Table, {
  Column, SearchBox, PageSizeSelector, Exporter,
} from 'components/Table';

import MemberDBTabs from 'components/Entry/MemberDBTabs';
// import BrowseTabs from 'components/BrowseTabs';
import EntryListFilter from 'components/Entry/EntryListFilters';

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
    description: T.object.isRequired,
    search: T.object.isRequired,
  }).isRequired,
};

const Overview = ({
  data: {payload, loading},
  location: {search: {type}},
  isStale,
}) => {
  if (loading || isStale) return <div>Loading…</div>;
  return (
    <div>
      Member databases:
      <ul className={styles.card}>
        {Object.entries(payload.entries.member_databases)
          .map(([name, count]) => (
            <li key={name}>
              <Link
                newTo={{
                  description: {mainType: 'entry', mainDB: name},
                  search: {type},
                }}
              >
                {name} ({count})
              </Link>
            </li>
          ))
        }
      </ul>
      <ul className={styles.card}>
        <li>
          <Link
            newTo={{
              description: {mainType: 'entry', mainDB: 'InterPro'},
              search: {type},
            }}
          >
            InterPro ({payload.entries ? payload.entries.interpro : 0})
          </Link>
        </li>
        <li>
          <Link
            newTo={{
              description: {mainType: 'entry', mainIntegration: 'Unintegrated'},
              search: {type},
            }}
          >
            Unintegrated ({payload.entries ? payload.entries.unintegrated : 0})
          </Link>
        </li>
      </ul>
    </div>
  );
};
Overview.propTypes = propTypes;

class List extends Component {
  static propTypes = propTypes;

  componentWillMount() {
    loadWebComponent(
      () => import(
        /* webpackChunkName: "interpro-components" */'interpro-components'
      ).then(m => m.InterproType),
    ).as('interpro-type');
  }

  render() {
    const {
      data, isStale,
      location: {description: {mainDB}, search},
    } = this.props;
    let _payload = data.payload;
    const HTTP_OK = 200;
    const notFound = !data.loading && data.status !== HTTP_OK;
    const goColors = {
      P: 'rgb(220, 254, 210)',
      F: 'rgb(254, 220, 210)',
      C: 'rgb(220, 210, 254)',
    };
    if (data.loading || notFound) {
      _payload = {
        results: [],
      };
    }
    return (
      <div className={f('row')}>
        <div className={f('shrink', 'columns')}>
          <MemberDBTabs/>
        </div>
        <div className={f('columns')}>
          <EntryListFilter /><hr/>
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
                  <a href={`${''}&format=json`} download="entries.json">
                    JSON
                  </a><br/></li>
                <li><a href={`${''}`}>Open in API web view</a></li>
              </ul>
            </Exporter>
            <PageSizeSelector />
            <SearchBox
              search={search.search}
              pathname={''}
            >
              Search entries:
            </SearchBox>
            <Column
              accessKey="type"
              renderer={(type) => (
                <interpro-type type={type.replace('_', ' ')} title={type}>
                  {type}
                </interpro-type>
              )}
            >Type</Column>
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
            {
              mainDB === 'InterPro' ?
                <Column
                  accessKey="member_databases"
                  renderer={(mdb/*: string */) => (
                    Object.keys(mdb).map(db => (
                      <div
                        key={db}
                        style={{
                          backgroundColor: '#DDDDDD',
                          padding: '1px',
                          marginBottom: '1px',
                        }}
                      >
                        {db}
                        {
                          mdb[db].map(accession => (
                            <span
                              key={accession}
                              className={f('label')}
                              style={{float: 'right'}}
                            >
                              <Link
                                newTo={{description: {
                                  mainType: 'entry',
                                  mainDB: db,
                                  mainAccession: accession,
                                }}}
                              >
                                {accession}
                              </Link>
                            </span>)
                          )
                        }
                      </div>
                    ))
                  )}
                >
                  Signatures <span className={f('label')}>Sign ID</span>
                </Column> :
                <Column
                  accessKey="integrated"
                  renderer={(accession/*: string */) => (
                    <Link
                      newTo={{description: {
                        mainType: 'entry',
                        mainDB: 'InterPro',
                        mainAccession: accession,
                      }}}
                    >
                      {accession}
                    </Link>
                  )}
                >
                  Integrated
                </Column>
            }
            <Column
              accessKey="go_terms"
              renderer={(gos/*: Array<Object> */) => (
                gos.map(go => (
                  <div
                    key={go.identifier}
                    style={{
                      backgroundColor: (
                        go.category ? goColors[go.category] : '#DDDDDD'
                      ),
                      padding: '1px',
                      marginBottom: '1px',
                    }}
                  >
                    {go.name ? go.name : 'None'}
                  </div>
                ))
              )}
            >
              GO Terms
            </Column>
          </Table>
        </div>
      </div>
    );
  }
}

const SummaryAsync = createAsyncComponent(() => import(
  /* webpackChunkName: "entry-summary" */'components/Entry/Summary'
));
const StructureAsync = createAsyncComponent(() => import(
  /* webpackChunkName: "structure-subpage" */'subPages/Structure'
));
const ProteinAsync = createAsyncComponent(() => import(
  /* webpackChunkName: "protein-subpage" */'subPages/Protein'
));

const SchemaOrgData = createAsyncComponent(
  () => import(/* webpackChunkName: "schemaOrg" */'schema_org'),
  () => null,
  'SchemaOrgData'
);

const pages = new Set([
  {value: 'structure', component: StructureAsync},
  {value: 'protein', component: ProteinAsync},
]);

const SummaryComponent = ({data: {payload}, location}) => (
  <SummaryAsync data={payload} location={location} />
);
SummaryComponent.propTypes = {
  data: T.shape({
    payload: T.object,
  }).isRequired,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
};

const Summary = props => {
  const {data: {loading, payload}, isStale} = props;
  if (loading || (isStale && !payload.metadata)) {
    return <div>Loading…</div>;
  }
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
    loading: T.bool,
    payload: T.object,
    status: T.number,
  }).isRequired,
  isStale: T.bool.isRequired,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  match: T.string,
};

const dbs = new RegExp(
  `(${memberDB
    .map(db => db.apiType)
    .filter(db => db)
    .join('|')})`,
  'i'
);
const dbAccs = new RegExp(
  `(${memberDB
    .map(db => db.accession)
    .filter(db => db)
    .join('|')}|IPR[0-9]{6})`,
  'i'
);

// Keep outside! Otherwise will be redefined at each render of the outer Switch
const InnerSwitch = (props) => (
  <Switch
    {...props}
    locationSelector={
      l => l.description.mainAccession || l.description.focusType
    }
    indexRoute={List}
    childRoutes={[
      {value: dbs, component: List},
      {value: dbAccs, component: Summary},
    ]}
    catchAll={List}
  />
);

const schemaProcessData = data => ({
  '@type': 'ProteinEntity',
  '@id': '@mainEntity',
  identifier: data.metadata.accession,
  name: data.metadata.name.name || data.metadata.accession,
  alternateName: data.metadata.name.long || null,
  inDataset: data.metadata.source_database,
  biologicalType: data.metadata.type,
  citation: '@citation',
  isBasedOn: '@isBasedOn',
  isBaseFor: '@isBaseFor',
});

const Entry = props => (
  <main>
    {props.data.payload && props.data.payload.accession &&
    <SchemaOrgData
      data={props.data.payload}
      processData={schemaProcessData}
    />
    }
    <Switch
      {...props}
      locationSelector={l => l.description.mainDB}
      indexRoute={Overview}
      catchAll={InnerSwitch}
    />
  </main>
);
Entry.propTypes = {
  data: T.shape({
    payload: T.object,
  }).isRequired,
};
export default loadData()(Entry);
