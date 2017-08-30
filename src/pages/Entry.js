import React, { Component } from 'react';
import T from 'prop-types';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import { GoLink } from 'components/ExtLink';

import loadData from 'higherOrder/loadData';
import loadWebComponent from 'utils/loadWebComponent';
import loadable from 'higherOrder/loadable';
import { getUrlForApi } from 'higherOrder/loadData/defaults';

import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';

import MemberDBTabs from 'components/Entry/MemberDBTabs';
import EntryListFilter from 'components/Entry/EntryListFilters';

import classname from 'classnames/bind';
import pageStyle from './style.css';
const ps = classname.bind(pageStyle);

import styles from 'styles/blocks.css';
import f from 'styles/foundation';
import { memberDB } from 'staticData/home';

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
  data: { payload, loading },
  location: { search: { type } },
  isStale,
}) => {
  if (loading || isStale) return <div>Loading…</div>;
  return (
    <div>
      Member databases:
      <ul className={styles.card}>
        {Object.entries(
          payload.entries.member_databases
        ).map(([name, count]) => (
          <li key={name}>
            <Link
              newTo={{
                description: { mainType: 'entry', mainDB: name },
                search: { type },
              }}
            >
              {name} ({count})
            </Link>
          </li>
        ))}
      </ul>
      <ul className={styles.card}>
        <li>
          <Link
            newTo={{
              description: { mainType: 'entry', mainDB: 'InterPro' },
              search: { type },
            }}
          >
            InterPro ({payload.entries ? payload.entries.interpro : 0})
          </Link>
        </li>
        <li>
          <Link
            newTo={{
              description: {
                mainType: 'entry',
                mainIntegration: 'Unintegrated',
              },
              search: { type },
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
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType
      )
    ).as('interpro-type');
  }

  render() {
    const {
      data,
      isStale,
      location: { description: { mainDB }, search },
    } = this.props;
    let _payload = data.payload;
    const HTTP_OK = 200;
    const notFound = !data.loading && data.status !== HTTP_OK;
    const goColors = {
      P: '#c2e6ec',
      F: '#e5f5d7',
      C: '#fbdcd0',
    };
    if (data.loading || notFound) {
      _payload = {
        results: [],
      };
    }
    return (
      <div className={f('row')}>
        <MemberDBTabs />

        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          <EntryListFilter />
          <hr />
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
                  <a href={data.url} download="entries.json">
                    JSON
                  </a>
                </li>
                <li>
                  <a href={data.url} download="entries.tsv">
                    TSV
                  </a>
                </li>
                <li>
                  <a target="_blank" rel="noopener noreferrer" href={data.url}>
                    Open in API web view
                  </a>
                </li>
              </ul>
            </Exporter>
            <PageSizeSelector />
            <SearchBox search={search.search} pathname={''}>
              &nbsp;
            </SearchBox>
            <Column
              dataKey="type"
              className={ps('col-type')}
              renderer={type => (
                <interpro-type
                  type={type.replace('_', ' ')}
                  title={type}
                  size="26px"
                >
                  {type}
                </interpro-type>
              )}
            >
              Type
            </Column>
            <Column
              dataKey="name"
              renderer={(
                name /*: string */,
                { accession } /*: {accession: string} */
              ) => (
                <Link
                  title={`${name} (${accession})`}
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
              )}
            >
              Name
            </Column>
            <Column
              dataKey="accession"
              renderer={(accession /*: string */) => (
                <Link
                  title={accession}
                  newTo={location => ({
                    ...location,
                    description: {
                      mainType: location.description.mainType,
                      mainDB: location.description.mainDB,
                      mainAccession: accession,
                    },
                  })}
                >
                  <span className={ps('acc-row')}>{accession}</span>
                </Link>
              )}
            >
              Accession
            </Column>
            {mainDB === 'InterPro' ? (
              <Column
                dataKey="member_databases"
                renderer={(mdb /*: string */) =>
                  Object.keys(mdb).map(db => (
                    <div key={db} className={ps('sign-row')}>
                      <span className={ps('sign-cell')}>{db}</span>
                      <span className={ps('sign-cell')}>
                        {mdb[db].map(accession => (
                          <span key={accession} className={ps('sign-label')}>
                            <Link
                              title={`${accession} signature`}
                              newTo={{
                                description: {
                                  mainType: 'entry',
                                  mainDB: db,
                                  mainAccession: accession,
                                },
                              }}
                            >
                              {accession}
                            </Link>
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
              >
                Signatures{' '}
                <span className={ps('sign-label-head')} title="Signature ID">
                  ID
                </span>
              </Column>
            ) : (
              <Column
                dataKey="integrated"
                renderer={(accession /*: string */) => (
                  <Link
                    newTo={{
                      description: {
                        mainType: 'entry',
                        mainDB: 'InterPro',
                        mainAccession: accession,
                      },
                    }}
                  >
                    {accession}
                  </Link>
                )}
              >
                Integrated
              </Column>
            )}
            <Column
              dataKey="go_terms"
              className={ps('col-go')}
              renderer={(gos /*: Array<Object> */) =>
                gos.map(go => (
                  <div
                    className={ps('go-row')}
                    key={go.identifier}
                    style={{
                      backgroundColor: go.category
                        ? goColors[go.category]
                        : '#DDDDDD',
                    }}
                  >
                    <span className={ps('go-cell')}>
                      <GoLink
                        id={go.identifier}
                        className={f('go')}
                        title={`${go.name} (${go.identifier})`}
                      >
                        {go.name ? go.name : 'None'}
                      </GoLink>
                    </span>
                  </div>
                ))}
            >
              GO Terms{' '}
              <span
                className={ps('sign-label-head', 'bp')}
                title="Biological process term"
              >
                BP
              </span>{' '}
              <span
                className={ps('sign-label-head', 'mf')}
                title="Molecular function term"
              >
                MF
              </span>{' '}
              <span
                className={ps('sign-label-head', 'cc')}
                title="Cellular component term"
              >
                CC
              </span>
            </Column>
          </Table>
        </div>
      </div>
    );
  }
}

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "entry-summary" */ 'components/Entry/Summary'),
});
const StructureAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "structure-subpage" */ 'subPages/Structure'),
});
const ProteinAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-subpage" */ 'subPages/Protein'),
});
const SpeciesAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "entry-subpage" */ 'subPages/Species'),
});
const DomainAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "entry-subpage" */ 'subPages/DomainArchitecture'),
});
const HmmModelsAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "entry-subpage" */ 'subPages/HmmModels'),
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const pages = new Set([
  { value: 'structure', component: StructureAsync },
  { value: 'protein', component: ProteinAsync },
  { value: 'species', component: SpeciesAsync },
  { value: 'domain_architecture', component: DomainAsync },
  { value: 'hmm_models', component: HmmModelsAsync },
]);

const SummaryComponent = ({ data: { payload }, isStale, location }) => (
  <SummaryAsync data={payload} isStale={isStale} location={location} />
);
SummaryComponent.propTypes = {
  data: T.shape({
    payload: T.object,
  }).isRequired,
  isStale: T.bool.isRequired,
  location: T.object.isRequired,
};

const Summary = props => {
  const { data: { loading, payload }, isStale } = props;
  if (loading || (isStale && !payload.metadata)) {
    return <div>Loading…</div>;
  }
  return (
    <Switch
      {...props}
      locationSelector={l =>
        l.description.mainDetail || l.description.focusType}
      indexRoute={SummaryComponent}
      childRoutes={pages}
    />
  );
};
Summary.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }).isRequired,
  isStale: T.bool.isRequired,
};

const dbAccs = new RegExp(
  `(${memberDB
    .map(db => db.accession)
    .filter(db => db)
    .join('|')}|IPR[0-9]{6})`,
  'i'
);

// Keep outside! Otherwise will be redefined at each render of the outer Switch
const InnerSwitch = props => (
  <Switch
    {...props}
    locationSelector={l =>
      l.description.mainAccession || l.description.focusType}
    indexRoute={List}
    childRoutes={[{ value: dbAccs, component: Summary }]}
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
  <div className={ps('with-data', { ['with-stale-data']: props.isStale })}>
    {props.data.payload &&
    props.data.payload.accession && (
      <SchemaOrgData
        data={props.data.payload}
        processData={schemaProcessData}
      />
    )}
    <Switch
      {...props}
      locationSelector={l => l.description.mainDB}
      indexRoute={Overview}
      catchAll={InnerSwitch}
    />
  </div>
);
Entry.propTypes = {
  data: T.shape({
    payload: T.object,
  }).isRequired,
  isStale: T.bool.isRequired,
};
export default loadData((...args) =>
  getUrlForApi(...args)
    .replace('species', '')
    .replace('hmm_models', '')
    .replace('domain_architecture', '')
)(Entry);
