import React, { PureComponent, Fragment } from 'react';
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
import { getUrlForApi, getUrlForMeta } from 'higherOrder/loadData/defaults';

import subPages from 'subPages';
import config from 'config';
import EntryMenu from 'components/EntryMenu';
import Title from 'components/Title';

import { memberDBAccessions } from 'staticData/home';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';

import { foundationPartial } from 'styles/foundation';

import styles from 'styles/blocks.css';
import pageStyle from '../style.css';

const f = foundationPartial(pageStyle, styles);

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
  schemaProcessMainEntity,
  schemaProcessDataRecord,
} from 'schema_org/processors';

const GO_COLORS = new Map([
  ['P', '#d1eaef'],
  ['F', '#e0f2d1'],
  ['C', '#f5ddd3'],
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
    dataBase: T.shape({
      payload: T.object,
      loading: T.bool.isRequired,
    }),
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
      dataBase,
    } = this.props;
    let _payload = data.payload;
    const HTTP_OK = 200;
    const notFound = !data.loading && data.status !== HTTP_OK;
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    if (data.loading || notFound) {
      _payload = {
        results: [],
      };
    }
    const urlHasParameter = data.url && data.url.includes('?');
    const includeGrid = data.url;
    return (
      <div className={f('row')}>
        <MemberDBTabs />

        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          <EntryListFilter />
          <hr />
          {databases &&
            db &&
            databases[db.toUpperCase()] && (
              <SchemaOrgData
                data={{
                  data: { db: databases[db.toUpperCase()] },
                  location: window.location,
                }}
                processData={schemaProcessDataTable}
              />
            )}
          <Table
            dataTable={_payload.results}
            loading={data.loading}
            ok={data.ok}
            isStale={isStale}
            actualSize={_payload.count}
            query={search}
            notFound={notFound}
            withGrid={includeGrid}
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
            {db === 'InterPro' && (
              <Column
                dataKey="type"
                headerClassName={f('col-type', 'table-center')}
                cellClassName={f('table-center')}
                renderer={type => {
                  const _type = type.replace('_', ' ');
                  return (
                    <Tooltip title={`${_type} type`}>
                      <interpro-type type={_type} size="26px">
                        {_type}
                      </interpro-type>
                    </Tooltip>
                  );
                }}
              />
            )}
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, data, row) => (
                <Tooltip title={accession}>
                  <Link
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
                      data={{
                        data: { row, endpoint: 'entry' },
                        location: window.location,
                      }}
                      processData={schemaProcessDataTableRow}
                    />
                    <span className={f('acc-row')}>
                      <HighlightedText
                        text={accession}
                        textToHighlight={search.search}
                      />
                    </span>
                  </Link>
                </Tooltip>
              )}
            >
              Accession
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

            {db !== 'InterPro' && (
              <Column
                dataKey="type"
                headerClassName={f('col-type', 'table-center')}
                cellClassName={f('table-center')}
                renderer={type => (
                  <Tooltip
                    title={`${type.replace(
                      '_',
                      ' ',
                    )} type (as defined by ${db})`}
                  >
                    {type.replace('_', ' ')}
                  </Tooltip>
                )}
              >
                {`${db} Type`}
              </Column>
            )}

            {db !== 'InterPro' && (
              <Column
                dataKey="source_database"
                headerClassName={f('table-center')}
                cellClassName={f('table-center')}
                renderer={(db /*: string */) => (
                  <Tooltip title={`${db} database`}>
                    <MemberSymbol type={db} className={f('md-small')} />
                  </Tooltip>
                )}
              >
                DB
              </Column>
            )}
            {db === 'InterPro' ? (
              <Column
                dataKey="member_databases"
                cellClassName={f('col-md')}
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
                Member Database
              </Column>
            ) : (
              <Column
                dataKey="integrated"
                renderer={(accession /*: string */) =>
                  accession ? (
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'InterPro', accession },
                        },
                        search: {},
                      }}
                    >
                      <Tooltip title={`${accession}`}>{accession}</Tooltip>
                    </Link>
                  ) : (
                    ''
                  )
                }
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
                headerClassName={f('col-go-head')}
                cellClassName={f('col-go')}
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
                        <span key={go.identifier} className={f('go-list')}>
                          <Tooltip
                            title={`${go.category.name.replace('_', ' ')} term`}
                          >
                            <span
                              className={f('go-circle')}
                              style={{
                                background:
                                  GO_COLORS.get(go.category.code) || '#ddd',
                              }}
                            />
                          </Tooltip>
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

const dbAccs = new RegExp(`(${memberDBAccessions.join('|')}|IPR[0-9]{6})`, 'i');

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

class Entry extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
    dataBase: T.shape({
      payload: T.object,
    }).isRequired,
  };

  render() {
    const { data: { payload }, dataBase } = this.props;
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;

    return (
      <div>
        {payload &&
          payload.metadata &&
          payload.metadata.accession && (
            <Fragment>
              <SchemaOrgData
                data={{
                  data: this.props.data.payload,
                  endpoint: 'entry',
                  version:
                    databases &&
                    databases[payload.metadata.source_database].version,
                }}
                processData={schemaProcessDataRecord}
              />
              <SchemaOrgData
                data={{
                  data: payload.metadata,
                  type: 'Entry',
                }}
                processData={schemaProcessMainEntity}
              />
            </Fragment>
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

export default loadData({ getUrl: getUrlForMeta, propNamespace: 'Base' })(
  loadData((...args) =>
    getUrlForApi(...args)
      .replace('/logo', '/')
      .replace('domain_architecture', ''),
  )(Entry),
);
