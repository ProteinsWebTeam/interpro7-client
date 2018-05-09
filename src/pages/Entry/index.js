import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';
import { GoLink } from 'components/ExtLink';
import MemberDBSelector from 'components/MemberDBSelector';
import EntryListFilter from 'components/Entry/EntryListFilters';
import MemberSymbol from 'components/Entry/MemberSymbol';
import Loading from 'components/SimpleCommonComponents/Loading';
import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import EntryMenu from 'components/EntryMenu';
import Title from 'components/Title';
import { NumberComponent } from 'components/NumberLabel';
import { ParagraphWithCites } from 'components/Description';

import getExtUrlFor from 'utils/url-patterns';
import { toPlural } from 'utils/pages';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';
import loadWebComponent from 'utils/load-web-component';
import loadable from 'higherOrder/loadable';
import { getUrlForApi, getUrlForMeta } from 'higherOrder/loadData/defaults';

import { mainDBLocationSelector } from 'reducers/custom-location/description';

import subPages from 'subPages';
import config from 'config';

import { memberDBAccessions } from 'staticData/home';

import { foundationPartial } from 'styles/foundation';

import styles from 'styles/blocks.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(pageStyle, styles, fonts);

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

class SummaryCounterEntries extends PureComponent {
  static propTypes = {
    entryDB: T.string,
    metadata: T.object.isRequired,
    data: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };

  render() {
    const {
      entryDB,
      metadata,
      data: { loading, payload },
    } = this.props;

    let proteins = 0;
    let domainArchitectures = 0;
    let organisms = 0;
    let structures = 0;
    let sets = 0;
    if (!loading && payload && payload.metadata) {
      proteins = payload.metadata.counters.proteins;
      domainArchitectures = payload.metadata.counters.domainArchitectures;
      organisms = payload.metadata.counters.organisms;
      structures = payload.metadata.counters.structures;
      sets = payload.metadata.counters.sets;
    }

    return (
      <div className={f('card-block', 'card-counter', 'label-off')}>
        <Tooltip
          title={`${proteins} ${toPlural('protein', proteins)} matching ${
            metadata.name
          }`}
          className={f('count-proteins')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: entryDB,
                  accession: metadata.accession,
                },
                protein: { isFilter: true, db: 'UniProt' },
              },
            }}
          >
            <div className={f('icon', 'icon-conceptual')} data-icon="&#x50;" />{' '}
            <NumberComponent
              loading={loading}
              value={proteins}
              abbr
              scaleMargin={1}
            />
            <span className={f('label-number')}>
              {toPlural('protein', proteins)}
            </span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`… domain architectures matching ${metadata.name}`}
          className={f('count-architectures')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: entryDB,
                  accession: metadata.accession,
                  detail: 'domain_architecture',
                },
              },
            }}
            // TODO: remove comment when we have the counter implemented
            // disabled={!domainArchitectures}
          >
            <div className={f('icon', 'icon-count-ida')} />{' '}
            <NumberComponent
              loading={loading}
              value={domainArchitectures}
              abbr
              scaleMargin={1}
            />
            <span className={f('label-number')}>domain architectures</span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${organisms} ${toPlural('organism', organisms)} matching ${
            metadata.name
          }`}
          className={f('count-organisms')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: entryDB,
                  accession: metadata.accession,
                },
                organism: { isFilter: true, db: 'taxonomy' },
              },
            }}
            disabled={!organisms}
          >
            <div className={f('icon', 'icon-count-species')} />{' '}
            <NumberComponent
              loading={loading}
              value={organisms}
              abbr
              scaleMargin={1}
            />
            <span className={f('label-number')}>
              {toPlural('organism', organisms)}
            </span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${structures} ${toPlural('structure', structures)} matching ${
            metadata.name
          }`}
          className={f('count-structures')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: entryDB,
                  accession: metadata.accession,
                },
                structure: { isFilter: true, db: 'PDB' },
              },
            }}
            disabled={!structures}
          >
            <div className={f('icon', 'icon-conceptual')} data-icon="s" />{' '}
            <NumberComponent
              loading={loading}
              value={structures}
              abbr
              scaleMargin={1}
            />
            <span className={f('label-number')}>
              {toPlural('structure', structures)}
            </span>
          </Link>
        </Tooltip>

        {// show sets counter + icon only when available
        entryDB.toLowerCase() === 'cdd' || entryDB.toLowerCase() === 'pfam' ? (
          <Tooltip
            title={`${sets} ${toPlural('set', sets)} matching ${metadata.name}`}
            className={f('count-sets')}
            style={{ display: 'flex' }}
          >
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db: entryDB,
                    accession: metadata.accession,
                  },
                  set: { isFilter: true, db: entryDB },
                },
              }}
              disabled={!sets}
            >
              <div className={f('icon', 'icon-count-set')} />{' '}
              <NumberComponent
                loading={loading}
                value={sets}
                abbr
                scaleMargin={1}
              />
              <span className={f('label-number')}>{toPlural('set', sets)}</span>
            </Link>
          </Tooltip>
        ) : null}
      </div>
    );
  }
}

class DescriptionEntries extends PureComponent {
  static propTypes = {
    description: T.arrayOf(T.string),
    db: T.string.isRequired,
    accession: T.string.isRequired,
  };

  render() {
    const { description, db, accession } = this.props;

    if (!(description && description.length)) return null;

    return (
      <React.Fragment>
        <div className={f('card-description')}>
          <ParagraphWithCites p={description[0]} withoutRefs />
        </div>
        <Link
          to={{
            description: {
              main: { key: 'entry' },
              entry: { db, accession },
            },
          }}
          className={f('card-description-link')}
        >
          […]
        </Link>
      </React.Fragment>
    );
  }
}

const getUrlForEntries = (accession, db) =>
  createSelector(
    state => state.settings.api,
    ({ protocol, hostname, port, root }) =>
      format({
        protocol,
        hostname,
        port,
        pathname:
          root +
          descriptionToPath({
            main: { key: 'entry' },
            entry: { db, accession },
          }),
      }),
  );

class EntryCard extends PureComponent {
  static propTypes = {
    data: T.object,
    search: T.string,
    entryDB: T.string,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextAccession = nextProps.data.metadata.accession;
    const nextDB = nextProps.data.metadata.source_database;
    if (nextAccession === prevState.accession || nextDB === prevState.db)
      return null;

    return {
      SummaryCounterEntriesWithData: loadData(
        getUrlForEntries(nextAccession, nextDB),
      )(SummaryCounterEntries),
      accession: nextAccession,
      db: nextDB,
    };
  }

  constructor(props) {
    super(props);

    const accession = props.data.metadata.accession;
    const db = props.data.metadata.source_database;
    this.state = {
      SummaryCounterEntriesWithData: loadData(getUrlForEntries(accession, db))(
        SummaryCounterEntries,
      ),
      accession,
      db,
    };
  }

  render() {
    const { data, search, entryDB } = this.props;
    const { SummaryCounterEntriesWithData } = this.state;
    return (
      <React.Fragment>
        <div className={f('card-header')}>
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: data.metadata.source_database,
                  accession: data.metadata.accession,
                },
              },
            }}
          >
            {entryDB.toLowerCase() === 'interpro' ? (
              <Tooltip title={`${data.metadata.type.replace('_', ' ')} type`}>
                <interpro-type
                  dimension="2em"
                  type={data.metadata.type.replace('_', ' ')}
                  aria-label="Entry type"
                />
              </Tooltip>
            ) : (
              <Tooltip title={`${entryDB} database`}>
                <MemberSymbol
                  size="2em"
                  type={entryDB}
                  aria-label="Database type"
                  className={f('md-small')}
                />
              </Tooltip>
            )}
            <h6>
              <HighlightedText
                text={data.metadata.name}
                textToHighlight={search}
              />
            </h6>
          </Link>
        </div>

        <SummaryCounterEntriesWithData
          entryDB={entryDB}
          metadata={data.metadata}
        />

        <DescriptionEntries
          db={data.metadata.source_database}
          accession={data.metadata.accession}
          description={data.extra_fields.description}
        />

        <div className={f('card-footer')}>
          {entryDB.toLowerCase() === 'interpro' ? (
            <span>{data.metadata.type.replace('_', ' ')}</span>
          ) : (
            <span>
              {data.metadata.integrated ? 'Integrated to ' : 'Not integrated'}
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: {
                      db: 'InterPro',
                      accession: data.metadata.integrated,
                    },
                  },
                }}
                disabled={!data.metadata.integrated}
              >
                {data.metadata.integrated}
              </Link>
            </span>
          )}
          <HighlightedText
            text={data.metadata.accession}
            textToHighlight={search}
          />
        </div>
      </React.Fragment>
    );
  }
}

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

  componentDidMount() {
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
      customLocation: {
        description: {
          entry: { db },
        },
        search,
      },
      dataBase,
    } = this.props;
    let _payload = data.payload;
    const HTTP_OK = 200;
    const notFound = !data.loading && data.status !== HTTP_OK;
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    if (data.loading || notFound) {
      _payload = { results: [] };
    }
    const urlHasParameter = data.url && data.url.includes('?');
    const includeGrid = data.url;
    return (
      <div className={f('row')}>
        <MemberDBSelector
          contentType="entry"
          className="left-side-db-selector"
        />
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
            contentType="entry"
            loading={data.loading}
            ok={data.ok}
            isStale={isStale}
            actualSize={_payload.count}
            query={search}
            notFound={notFound}
            withGrid={!!includeGrid}
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
            <Card>
              {data => (
                <EntryCard data={data} search={search.search} entryDB={db} />
              )}
            </Card>
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
                      <interpro-type type={_type} dimension="26px">
                        {_type}
                      </interpro-type>
                    </Tooltip>
                  );
                }}
              />
            )}
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, row) => (
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
                renderer={(db /*: string */, { accession }) => {
                  const externalLinkRenderer = getExtUrlFor(db);
                  const symbol = (
                    <MemberSymbol type={db} className={f('md-small')} />
                  );
                  if (!externalLinkRenderer) return symbol;
                  return (
                    <Tooltip
                      title={`link to ${accession} on the ${db} website`}
                    >
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href={externalLinkRenderer(accession)}
                      >
                        {symbol}
                      </Link>
                    </Tooltip>
                  );
                }}
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
                          className={f('signature', {
                            'corresponds-to-filter':
                              search.signature_in &&
                              search.signature_in.toLowerCase() ===
                                db.toLowerCase(),
                          })}
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

const subPagesForEntry = new Map();
for (const subPage of config.pages.entry.subPages) {
  subPagesForEntry.set(subPage, subPages.get(subPage));
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

const detailSelector = createSelector(customLocation => {
  const { key } = customLocation.description.main;
  return (
    customLocation.description[key].detail ||
    (Object.entries(customLocation.description).find(
      ([_key, value]) => value.isFilter,
    ) || [])[0]
  );
}, value => value);
const Summary = props => {
  const {
    data: { loading, payload },
  } = props;
  if (loading || !payload.metadata) {
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
        locationSelector={detailSelector}
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

const childRoutes = new Map([
  [new RegExp(`(${memberDBAccessions.join('|')}|IPR[0-9]{6})`, 'i'), Summary],
]);
const accessionSelector = createSelector(customLocation => {
  const { key } = customLocation.description.main;
  return (
    customLocation.description[key].accession ||
    (Object.entries(customLocation.description).find(
      ([_key, value]) => value.isFilter,
    ) || [])[0]
  );
}, value => value);
// Keep outside! Otherwise will be redefined at each render of the outer Switch
const InnerSwitch = props => (
  <ErrorBoundary>
    <Switch
      {...props}
      locationSelector={accessionSelector}
      indexRoute={List}
      childRoutes={childRoutes}
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
    const {
      data: { payload },
      dataBase,
    } = this.props;
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
            locationSelector={mainDBLocationSelector}
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
