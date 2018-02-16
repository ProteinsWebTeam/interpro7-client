import React, { PureComponent } from 'react';
import T from 'prop-types';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';
import { GoLink } from 'components/ExtLink';
import MemberDBTabs from 'components/MemberDBTabs';
import EntryListFilter from 'components/Entry/EntryListFilters';
import MemberSymbol from 'components/Entry/MemberSymbol';
import Loading from 'components/SimpleCommonComponents/Loading';
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
import EntryMenu from 'components/EntryMenu';
import Title from 'components/Title';

import { memberDB } from 'staticData/home';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';

import { foundationPartial } from 'styles/foundation';

import styles from 'styles/blocks.css';
import pageStyle from '../style.css';

const f = foundationPartial(pageStyle, styles);

const schemaProcessDataTable = ({ db, location }) => ({
  '@type': 'Dataset',
  '@id': '@mainEntityOfPage',
  identifier: db,
  name: db,
  version: '?',
  url: location.href,
  hasPart: '@hasPart',
  includedInDataCatalog: {
    '@type': 'DataCatalog',
    '@id': `${location.origin}/interpro7/`,
  },
});

const schemaProcessDataTableRow = ({ data, location }) => ({
  '@type': 'DataRecord',
  '@id': '@hasPart',
  identifier: data.accession,
  name: data.db,
  url: `${location.href}/${data.accession}`,
});

const GO_COLORS = new Map([
  ['P', '#c2e6ec'],
  ['F', '#e5f5d7'],
  ['C', '#fbdcd0'],
]);

class List extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.object,
      loading: T.bool.isRequired,
      ok: T.bool,
    }).isRequired,
    isStale: T.bool.isRequired,
    customLocation: T.shape({
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
      customLocation: { description: { entry: { db } }, search },
    } = this.props;
    let _payload = data.payload;
    const HTTP_OK = 200;
    const notFound = !data.loading && data.status !== HTTP_OK;
    if (data.loading || notFound) {
      _payload = {
        results: [],
      };
    }
    const urlHasParameter = data.url && data.url.includes('?');
    return (
      <div className={f('row')}>
        <MemberDBTabs />

        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          <EntryListFilter />
          <hr />
          <SchemaOrgData
            data={{ db, location: window.location }}
            processData={schemaProcessDataTable}
          />
          <Table
            dataTable={_payload.results}
            isStale={isStale}
            loading={data.loading}
            ok={data.ok}
            actualSize={_payload.count}
            query={search}
            notFound={notFound}
          >
            <Exporter>
              <ul>
                <li>
                  <Link href={data.url} download="entries.json">
                    JSON
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${data.url}${urlHasParameter ? '&' : '?'}format=tsv`}
                    download="entries.tsv"
                  >
                    TSV
                  </Link>
                </li>
                <li>
                  <Link target="_blank" href={data.url}>
                    Open in API web view
                  </Link>
                </li>
              </ul>
            </Exporter>
            <PageSizeSelector />
            <SearchBox search={search.search}>&nbsp;</SearchBox>
            <Column
              dataKey="type"
              headerClassName={f('col-type', 'table-center')}
              cellClassName={f('table-center')}
              renderer={type =>
                db === 'InterPro' ? (
                  <Tooltip title={`${type.replace('_', ' ')} type`}>
                    <interpro-type type={type.replace('_', ' ')} size="26px">
                      {type}
                    </interpro-type>
                  </Tooltip>
                ) : (
                  type
                )
              }
            >
              {`${db !== 'InterPro' ? `${db} ` : ''}Type`}
            </Column>
            <Column
              dataKey="name"
              renderer={(
                name /*: string */,
                { accession } /*: {accession: string} */,
              ) => (
                <Tooltip title={`${name} (${accession})`}>
                  <Link
                    to={customLocation => ({
                      description: {
                        ...customLocation.description,
                        entry: {
                          ...customLocation.description.entry,
                          accession,
                        },
                      },
                      search: {},
                    })}
                  >
                    <HighlightedText
                      text={name}
                      textToHighlight={search.search}
                    />
                  </Link>
                </Tooltip>
              )}
            >
              Name
            </Column>
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, data) => (
                <Link
                  title={accession}
                  to={customLocation => ({
                    description: {
                      ...customLocation.description,
                      entry: {
                        ...customLocation.description.entry,
                        accession,
                      },
                    },
                  })}
                >
                  <SchemaOrgData
                    data={{ data, location: window.location }}
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
            {db !== 'InterPro' && (
              <Column
                dataKey="source_database"
                headerClassName={f('table-center')}
                cellClassName={f('table-center')}
                renderer={(db /*: string */) => (
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: { db },
                      },
                      search: {},
                    }}
                  >
                    <MemberSymbol type={db} />
                  </Link>
                )}
              >
                DB
              </Column>
            )}
            {db === 'InterPro' ? (
              <Column
                dataKey="member_databases"
                renderer={(memberDataBases /*: object */) => (
                  <div className={f('signature-container')}>
                    {Object.entries(memberDataBases).map(([db, entries]) =>
                      Object.entries(entries).map(([accession, id]) => (
                        <Tooltip
                          key={accession}
                          title={`${id} (${db})`}
                          className={f('signature')}
                        >
                          <Link
                            to={{
                              description: {
                                main: { key: 'entry' },
                                entry: { db, accession },
                              },
                            }}
                          >
                            {accession}
                          </Link>
                        </Tooltip>
                      )),
                    )}
                  </div>
                )}
              >
                Member DB
              </Column>
            ) : (
              <Column
                dataKey="integrated"
                renderer={(accession /*: string */) => (
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: { db: 'InterPro', accession },
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

            {db === 'InterPro' ? (
              <Column
                dataKey="go_terms"
                headerClassName={f('col-go')}
                renderer={(goTerms /*: Array<Object> */) => (
                  <div className={f('go-container')}>
                    {Array.from(goTerms)
                      .sort((a, b) => {
                        if (a.category.code > b.category.code) return 0;
                        if (a.category.code < b.category.code) return 1;
                        if (a.name > b.name) return 1;
                        return 0;
                      })
                      .map(go => (
                        <span key={go.identifier} className={f('go')}>
                          <span
                            className={f('go-circle')}
                            style={{
                              background:
                                GO_COLORS.get(go.category.code) || '#ddd',
                            }}
                          />
                          <Tooltip title={`${go.name} (${go.identifier})`}>
                            <GoLink id={go.identifier} className={f('ext')}>
                              {go.name ? go.name : 'None'}
                            </GoLink>
                          </Tooltip>
                        </span>
                      ))}
                  </div>
                )}
              >
                GO Terms{' '}
                <Tooltip title="Biological process category">
                  <span className={f('sign-label-head', 'bp')}>BP</span>
                </Tooltip>{' '}
                <Tooltip title="Molecular function category">
                  <span className={f('sign-label-head', 'mf')}>MF</span>
                </Tooltip>{' '}
                <Tooltip title="Cellular component category">
                  <span className={f('sign-label-head', 'cc')}>CC</span>
                </Tooltip>
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

const SummaryComponent = ({ data: { payload }, isStale, customLocation }) => (
  <SummaryAsync
    data={payload}
    isStale={isStale}
    customLocation={customLocation}
  />
);
SummaryComponent.propTypes = {
  data: T.shape({
    payload: T.object,
  }).isRequired,
  isStale: T.bool.isRequired,
  customLocation: T.object.isRequired,
};

const Summary = props => {
  const { data: { loading, payload }, isStale } = props;
  if (loading || (isStale && !payload.metadata)) {
    return <Loading />;
  }
  return (
    <ErrorBoundary>
      <div className={f('row')}>
        <div className={f('medium-12', 'large-12', 'columns')}>
          <Title metadata={payload.metadata} mainType="entry" />
          <EntryMenu metadata={payload.metadata} />
        </div>
      </div>
      <Switch
        {...props}
        locationSelector={l => {
          const { key } = l.description.main;
          return (
            l.description[key].detail ||
            (Object.entries(l.description).find(
              ([_key, value]) => value.isFilter,
            ) || [])[0]
          );
        }}
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
        main: { key: 'entry' },
        entry: { db: 'InterPro' },
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
      locationSelector={l => {
        const { key } = l.description.main;
        return (
          l.description[key].accession ||
          (Object.entries(l.description).find(
            ([_key, value]) => value.isFilter,
          ) || [])[0]
        );
      }}
      indexRoute={List}
      childRoutes={[{ value: dbAccs, component: Summary }]}
      catchAll={List}
    />
  </ErrorBoundary>
);

const mapTypeToOntology = new Map([
  ['Domain', 'DomainAnnotation'],
  ['Family', 'FamilyAnnotation'],
  ['Repeat', 'RepeatAnnotation'],
  ['Unknown', 'UnknownAnnotation'],
  ['Conserved_site', 'ConservedSiteAnnotation'],
  ['Binding_site', 'BindingSiteAnnotation'],
  ['Active_site', 'ActiveSiteAnnotation'],
  ['PTM', 'PTMAnnotation'],
]);

const schemaProcessData = data => ({
  '@type': 'DataRecord',
  '@id': '@mainEntityOfPage',
  identifier: data.metadata.accession,
  isPartOf: {
    '@type': 'Dataset',
    '@id': 'InterPro release ??',
  },
  mainEntity: '@mainEntity',
  isBasedOn: '@isBasedOn',
  isBasisFor: '@isBasisFor',
  citation: '@citation',
  seeAlso: '@seeAlso',
});

const schemaProcessData2 = data => ({
  '@type': [
    'StructuredValue',
    'CreativeWork',
    'BioChemEntity',
    'Entry',
    mapTypeToOntology.get(data.metadata.type) ||
      mapTypeToOntology.get('Unknown'),
  ],
  '@id': '@mainEntity',
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
  };

  render() {
    return (
      <div>
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
            locationSelector={l => l.description[l.description.main.key].db}
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
    .replace('/logo', '/')
    .replace('domain_architecture', ''),
)(Entry);
