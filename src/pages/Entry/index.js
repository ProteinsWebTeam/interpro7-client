import React, { PureComponent } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
// $FlowFixMe
import Callout from 'components/SimpleCommonComponents/Callout';

import Link from 'components/generic/Link';
// $FlowFixMe
import GoLink from 'components/ExtLink/GoLink';
import MemberDBSelector from 'components/MemberDBSelector';
import EntryListFilter from 'components/Entry/EntryListFilters';
import MemberSymbol from 'components/Entry/MemberSymbol';
import File from 'components/File';
// $FlowFixMe
import APIViewButton from 'components/Table/Exporter/APIViewButton';

import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
  HighlightToggler,
} from 'components/Table';
// $FlowFixMe
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';

import getExtUrlFor from 'utils/url-patterns';
import loadWebComponent from 'utils/load-web-component';
import loadable from 'higherOrder/loadable';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import { memberDBAccessions } from 'staticData/home';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import exporterStyle from 'components/Table/Exporter/style.css';
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';
import EntryCard from 'components/Entry/Card';

const f = foundationPartial(
  pageStyle,
  ebiStyles,
  fonts,
  exporterStyle,
  filtersAndTable,
);

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

const GO_COLORS = new Map([
  ['P', '#d1eaef'],
  ['F', '#e0f2d1'],
  ['C', '#f5ddd3'],
]);

const ArchiveCallout = ({ name, page }) => (
  <div className={f('row')}>
    <div className={f('columns', 'large-12')}>
      <Callout type="info">
        <p>
          <strong>{name} has retired</strong>
          <br />
          While {name} is no longer receiving updates, InterPro now serves as an
          archival source, granting continued access to its data.
          <br />
          Further information about {name} can be found{' '}
          <Link
            href={`${config.root.readthedocs.href + page}.html`}
            className={f('ext')}
            target="_blank"
          >
            in our documentation
          </Link>
          .
        </p>
      </Callout>
    </div>
  </div>
);

const AllEntriesDownload = (
  {
    description,
    search,
    count,
    fileType,
  } /*: {description: Object, search: Object, count: number, fileType: string} */,
) => (
  <File
    fileType={fileType}
    name={`entries.${fileType}`}
    count={count}
    customLocationDescription={description}
    search={search}
    endpoint={'entry'}
  />
);
AllEntriesDownload.propTypes = {
  description: T.object,
  search: T.object,
  count: T.number,
  fileType: T.string,
};

/*:: type Props = {
  data: {
   payload: Object,
   loading: boolean,
   ok: boolean,
   url: string,
   status: number
  },
  isStale: boolean,
  customLocation: {
    description: Object,
    search: Object
  },
  dataBase: {
   payload: Object,
   loading: boolean
  }
};*/
class List extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: dataPropType.isRequired,
    isStale: T.bool.isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
    dataBase: dataPropType,
  };

  componentDidMount() {
    loadWebComponent(() =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      ).then((m) => m.InterproType),
    ).as('interpro-type');
  }

  // eslint-disable-next-line
  render() {
    const {
      data,
      isStale,
      customLocation: { description, search },
      dataBase,
    } = this.props;
    let _payload = data.payload;
    const {
      entry: { db },
    } = description;

    const HTTP_OK = 200;
    const notFound = !data.loading && data.status !== HTTP_OK;
    const databases = dataBase?.payload?.databases;
    const isStaleButShouldntDisplayStale =
      isStale &&
      // eslint-disable-next-line camelcase
      _payload?.results?.[0]?.metadata?.source_database?.toLowerCase() !==
        db.toLowerCase();
    if (data.loading || notFound || isStaleButShouldntDisplayStale) {
      _payload = { results: [] };
    }
    const includeGrid = data.url;
    const shouldShowMemberDBSelector =
      description.entry.db.toLowerCase() !== 'interpro';
    return (
      <div className={f('row', 'filters-and-table')}>
        <nav>
          <div className={f('browse-side-panel')}>
            {shouldShowMemberDBSelector && (
              <>
                <div className={f('selector-container')}>
                  <MemberDBSelector
                    contentType="entry"
                    className="pp-left-side-db-selector"
                  />
                </div>
                <hr style={{ paddingTop: '0.5rem' }} />
              </>
            )}
            <EntryListFilter />
          </div>
        </nav>

        <section>
          {databases && db && databases[db.toLowerCase()] && (
            <SchemaOrgData
              data={{
                data: { db: databases[db.toLowerCase()] },
                location: window.location,
              }}
              processData={schemaProcessDataTable}
            />
          )}
          {db && ['prints', 'sfld'].includes(db) ? (
            <ArchiveCallout name={db.toUpperCase()} page={db.toLowerCase()} />
          ) : null}
          <Table
            dataTable={_payload.results}
            contentType="entry"
            loading={data.loading}
            ok={data.ok}
            status={data.status}
            isStale={isStale}
            actualSize={_payload.count}
            query={search}
            notFound={notFound}
            withGrid={!!includeGrid}
            databases={databases}
            nextAPICall={_payload.next}
            previousAPICall={_payload.previous}
            currentAPICall={data.url}
          >
            <Exporter>
              <div className={f('menu-grid')}>
                <label htmlFor="json">JSON</label>
                <AllEntriesDownload
                  description={description}
                  search={search}
                  count={_payload.count}
                  fileType="json"
                  name="json"
                />
                <label htmlFor="tsv">TSV</label>
                <AllEntriesDownload
                  description={description}
                  search={search}
                  count={_payload.count}
                  fileType="tsv"
                  name="tsv"
                />
                <label htmlFor="api">API</label>
                <APIViewButton url={data.url} />
              </div>
            </Exporter>
            <PageSizeSelector />
            <Card>
              {(data) => (
                <EntryCard data={data} search={search.search} entryDB={db} />
              )}
            </Card>
            <SearchBox loading={isStale}>Search entries</SearchBox>
            <HighlightToggler />
            {db === 'InterPro' && (
              <Column
                dataKey="type"
                headerClassName={f('col-type', 'table-center')}
                cellClassName={f('table-center')}
                renderer={(type) => {
                  const _type = type.replace('_', ' ');
                  return (
                    <Tooltip title={`${_type} type`}>
                      <interpro-type type={_type} dimension="26px" />
                    </Tooltip>
                  );
                }}
              />
            )}
            <Column
              dataKey="accession"
              isSortable={true}
              renderer={(accession /*: string */, row) => (
                <Link
                  to={(customLocation) => ({
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
                      text={accession || ''}
                      textToHighlight={search.search}
                    />
                  </span>
                </Link>
              )}
            >
              Accession
            </Column>

            <Column
              dataKey="counters.extra_fields.short_name"
              renderer={(_, meta, extra) =>
                extra.short_name ? (
                  <Link
                    to={(customLocation) => ({
                      description: {
                        ...customLocation.description,
                        entry: {
                          ...customLocation.description.entry,
                          accession: meta.accession,
                        },
                      },
                      search: {},
                    })}
                  >
                    <HighlightedText
                      text={extra.short_name}
                      textToHighlight={search.search}
                    />
                  </Link>
                ) : null
              }
            >
              Short name
            </Column>

            <Column
              dataKey="name"
              renderer={(
                name /*: string */,
                { accession } /*: {accession: string} */,
              ) => (
                <Link
                  to={(customLocation) => ({
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
              )}
            >
              Name
            </Column>

            {db !== 'InterPro' && (
              <Column
                dataKey="type"
                headerClassName={f('col-type', 'table-center')}
                cellClassName={f('table-center')}
                renderer={(type) => (
                  <Tooltip
                    title={`${type.replace('_', ' ')} type (as defined by ${
                      (databases && databases[db] && databases[db].name) || db
                    })`}
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
                  if (db.toLowerCase() === 'pfam' || !externalLinkRenderer)
                    return symbol;
                  return (
                    <Tooltip
                      title={`link to ${accession} on the ${
                        (databases && databases[db] && databases[db].name) || db
                      } website`}
                      distance={-5}
                      useContext={true}
                    >
                      <Link
                        target="_blank"
                        href={externalLinkRenderer(accession)}
                        style={{ borderBottomWidth: 0 }}
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
                renderer={(memberDataBases /*: Object */) => (
                  <div className={f('signature-container')}>
                    {memberDataBases &&
                      Object.entries(memberDataBases).map(([db, entries]) =>
                        Object.entries(entries).map(([accession, id]) => (
                          <Tooltip
                            key={accession}
                            title={`${id} (${
                              (databases &&
                                databases[db] &&
                                databases[db].name) ||
                              db
                            })`}
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
                Integrated Signature(s)
              </Column>
            ) : (
              <Column
                dataKey="integrated"
                headerClassName={f('table-center')}
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
                Integrated Into
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
                    {goTerms &&
                      Array.from(goTerms)
                        .sort((a, b) => {
                          if (a.category.code > b.category.code) return 0;
                          if (a.category.code < b.category.code) return 1;
                          if (a.name > b.name) return 1;
                          return 0;
                        })
                        .map((go) => (
                          <span key={go.identifier} className={f('go-list')}>
                            <Tooltip
                              title={`${go.category.name.replace(
                                '_',
                                ' ',
                              )} term`}
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
        </section>
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

const childRoutesReg = new RegExp(
  `(${memberDBAccessions.join('|')}|IPR[0-9]{6})`,
  'i',
);

const Entry = () => (
  <EndPointPage
    subpagesRoutes={childRoutesReg}
    listOfEndpointEntities={List}
    SummaryAsync={SummaryAsync}
    subPagesForEndpoint={subPagesForEntry}
  />
);

export default Entry;
