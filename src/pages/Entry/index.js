import React, { PureComponent, Component } from 'react';
import T from 'prop-types';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';
import { GoLink } from 'components/ExtLink';
import MemberDBTabs from 'components/MemberDBTabs';
import EntryListFilter from 'components/Entry/EntryListFilters';
import { Loading } from 'components/SimpleCommonComponents';
import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';

import loadData from 'higherOrder/loadData';
import loadWebComponent from 'utils/loadWebComponent';
import loadable from 'higherOrder/loadable';
import { getUrlForApi } from 'higherOrder/loadData/defaults';

import subPages from 'subPages';
import config from 'config';

import { memberDB } from 'staticData/home';
import { HighlightedText } from 'components/SimpleCommonComponents';

import { foundationPartial } from 'styles/foundation';

import styles from 'styles/blocks.css';
import pageStyle from '../style.css';

const f = foundationPartial(pageStyle, styles);

const schemaProcessDataTable = mainDB => ({
  '@type': 'Dataset',
  '@id': '@mainEntityOfPage',
  identifier: mainDB,
  name: mainDB,
  version: '?',
  url: window.location.href,
  hasPart: '@hasPart',
  includedInDataCatalog: {
    '@type': 'DataCatalog',
    '@id': `${window.location.origin}/interpro7/`,
  },
});

const schemaProcessDataTableRow = data => ({
  '@type': 'DataRecord',
  '@id': '@hasPart',
  identifier: data.accession,
  name: data.mainDB,
  url: `${window.location.href}/${data.accession}`,
});

class List extends Component {
  static propTypes = {
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

  componentWillMount() {
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType,
      ),
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
          <SchemaOrgData data={mainDB} processData={schemaProcessDataTable} />
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
              className={f('col-type')}
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
                { accession } /*: {accession: string} */,
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
                    search: {},
                  })}
                >
                  <HighlightedText
                    text={name}
                    textToHighlight={search.search}
                  />
                </Link>
              )}
            >
              Name
            </Column>
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, data) => (
                <Link
                  title={accession}
                  newTo={location => ({
                    ...location,
                    description: {
                      mainType: location.description.mainType,
                      mainDB: location.description.mainDB,
                      mainAccession: accession,
                    },
                    search: {},
                  })}
                >
                  <SchemaOrgData
                    data={data}
                    processData={schemaProcessDataTableRow}
                  />
                  <span className={f('acc-row')}>
                    <HighlightedText
                      text={accession}
                      textToHighlight={search.search}
                    />
                  </span>
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
                    <div key={db} className={f('sign-row')}>
                      <span className={f('sign-cell')}>{db}</span>
                      <span className={f('sign-cell')}>
                        {mdb[db].map(accession => (
                          <span key={accession} className={f('sign-label')}>
                            <Link
                              title={`${accession} signature`}
                              newTo={{
                                description: {
                                  mainType: 'entry',
                                  mainDB: db,
                                  mainAccession: accession,
                                },
                                search: {},
                              }}
                            >
                              {accession}
                            </Link>
                          </span>
                        ))}
                      </span>
                    </div>
                  ))
                }
              >
                Signatures{' '}
                <span className={f('sign-label-head')} title="Signature ID">
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
                      search: {},
                    }}
                  >
                    {accession}
                  </Link>
                )}
              >
                Integrated
              </Column>
            )}

            {
              // TODO re-insert GO terms as column in table for Member databases when data available
            }

            {mainDB === 'InterPro' ? (
              <Column
                dataKey="go_terms"
                className={f('col-go')}
                renderer={(gos /*: Array<Object> */) =>
                  gos
                    .sort((a, b) => {
                      if (a.category > b.category) return 0;
                      if (a.category < b.category) return 1;
                      if (a.name > b.name) return 1;
                      return 0;
                    })
                    .map(go => (
                      <div
                        className={f('go-row')}
                        key={go.identifier}
                        style={{
                          backgroundColor: go.category
                            ? goColors[go.category]
                            : '#DDDDDD',
                        }}
                      >
                        <span className={f('go-cell')}>
                          <GoLink
                            id={go.identifier}
                            className={f('go')}
                            title={`${go.name} (${go.identifier})`}
                          >
                            {go.name ? go.name : 'None'}
                          </GoLink>
                        </span>
                      </div>
                    ))
                }
              >
                GO Terms{' '}
                <span
                  className={f('sign-label-head', 'bp')}
                  title="Biological process term"
                >
                  BP
                </span>{' '}
                <span
                  className={f('sign-label-head', 'mf')}
                  title="Molecular function term"
                >
                  MF
                </span>{' '}
                <span
                  className={f('sign-label-head', 'cc')}
                  title="Cellular component term"
                >
                  CC
                </span>
              </Column>
            ) : null}
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

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const subPagesForEntry = new Set();
for (const subPage of config.pages.entry.subPages) {
  subPagesForEntry.add({
    value: subPage,
    component: subPages.get(subPage),
  });
}

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
    return <Loading />;
  }
  return (
    <ErrorBoundary>
      <Switch
        {...props}
        locationSelector={l =>
          l.description.mainDetail || l.description.focusType
        }
        indexRoute={SummaryComponent}
        childRoutes={subPagesForEntry}
      />
    </ErrorBoundary>
  );
};
Summary.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }).isRequired,
  isStale: T.bool.isRequired,
};

const RedirectToInterPro = () => (
  <Redirect
    to={{
      description: {
        mainType: 'entry',
        mainDB: 'InterPro',
      },
    }}
  />
);

const dbAccs = new RegExp(
  `(${memberDB
    .map(db => db.accession)
    .filter(db => db)
    .join('|')}|IPR[0-9]{6})`,
  'i',
);

// Keep outside! Otherwise will be redefined at each render of the outer Switch
const InnerSwitch = props => (
  <ErrorBoundary>
    <Switch
      {...props}
      locationSelector={l =>
        l.description.mainAccession || l.description.focusType
      }
      indexRoute={List}
      childRoutes={[{ value: dbAccs, component: Summary }]}
      catchAll={List}
    />
  </ErrorBoundary>
);

const mapTypeToOntology = new Map([
  ['Domain', 'http://semanticscience.org/resource/SIO_001379.rdf'],
  ['Family', 'http://semanticscience.org/resource/SIO_001380.rdf'],
  ['Repeat', 'http://semanticscience.org/resource/SIO_000370.rdf'],
  ['Unknown', 'http://semanticscience.org/resource/SIO_000370.rdf'],
  ['Conserved_site', 'http://semanticscience.org/resource/SIO_010049.rdf'],
  ['Binding_site', 'http://semanticscience.org/resource/SIO_010040.rdf'],
  ['Active_site', 'http://semanticscience.org/resource/SIO_010041.rdf'],
  ['PTM', 'http://semanticscience.org/resource/SIO_010049.rdf'],
]);

const schemaProcessData = data => ({
  '@type': 'DataRecord',
  '@id': '@mainEntityOfPage',
  identifier: data.metadata.accession,
  isPartOf: {
    '@type': 'Dataset',
    '@id': 'InterPro release ??',
  },
  additionalType:
    mapTypeToOntology.get(data.metadata.type) ||
    mapTypeToOntology.get('Unknown'),
  mainEntity: '@mainEntity',
  isBasedOn: '@isBasedOn',
  isBasisFor: '@isBasisFor',
  citation: '@citation',
  seeAlso: '@seeAlso',
});

const schemaProcessData2 = data => ({
  '@type': ['StructuredValue', 'BioChemEntity', 'CreativeWork'],
  '@id': '@mainEntity',
  additionalType:
    mapTypeToOntology.get(data.metadata.type) ||
    mapTypeToOntology.get('Unknown'),
  identifier: data.metadata.accession,
  name: data.metadata.name.name || data.metadata.accession,
  alternateName: data.metadata.name.long || null,
  additionalProperty: '@additionalProperty',
  isContainedIn: '@isContainedIn',
});

class Entry extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
    isStale: T.bool.isRequired,
  };

  render() {
    return (
      <div
        className={f('with-data', { ['with-stale-data']: this.props.isStale })}
      >
        {this.props.data.payload &&
          this.props.data.payload.metadata &&
          this.props.data.payload.metadata.accession && (
            <SchemaOrgData
              data={this.props.data.payload}
              processData={schemaProcessData}
            />
          )}
        {this.props.data.payload &&
          this.props.data.payload.metadata &&
          this.props.data.payload.metadata.accession && (
            <SchemaOrgData
              data={this.props.data.payload}
              processData={schemaProcessData2}
            />
          )}
        <ErrorBoundary>
          <Switch
            {...this.props}
            locationSelector={l => l.description.mainDB}
            indexRoute={RedirectToInterPro}
            catchAll={InnerSwitch}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

export default loadData((...args) =>
  getUrlForApi(...args)
    .replace('logo', '')
    .replace('domain_architecture', ''),
)(Entry);
