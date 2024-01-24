import React, { PureComponent } from 'react';
import T from 'prop-types';
import {
  dataPropType,
  metadataPropType,
} from 'higherOrder/loadData/dataPropTypes';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
// $FlowFixMe
import { Card as NewCard } from 'components/SimpleCommonComponents/Card';
// $FlowFixMe
import CounterIcon from 'components/SimpleCommonComponents/Card/CounterIcon';

import Link from 'components/generic/Link';
// $FlowFixMe
import GoLink from 'components/ExtLink/GoLink';
import Description from 'components/Description';
import MemberDBSelector from 'components/MemberDBSelector';
import EntryListFilter from 'components/Entry/EntryListFilters';
import MemberSymbol from 'components/Entry/MemberSymbol';
import Loading from 'components/SimpleCommonComponents/Loading';
import File from 'components/File';

import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
  HighlightToggler,
} from 'components/Table';
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

/*:: type SummaryCounterEntriesProps = {
  entryDB: string,
  metadata: Object,
  counters: Object
};*/
class SummaryCounterEntries extends PureComponent /*:: <SummaryCounterEntriesProps> */ {
  static propTypes = {
    entryDB: T.string,
    metadata: metadataPropType.isRequired,
    counters: T.object.isRequired,
  };

  render() {
    const { entryDB, metadata, counters } = this.props;
    const {
      proteins,
      domain_architectures: domainArchitectures,
      taxa,
      structures,
      sets,
    } = counters;

    return (
      <div className={f('card-block', 'card-counter', 'label-off')}>
        <CounterIcon
          endpoint="protein"
          count={proteins}
          name={metadata.name}
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
        />

        <CounterIcon
          endpoint="domain architecture"
          count={domainArchitectures}
          name={metadata.name}
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
        />

        <CounterIcon
          endpoint="taxonomy"
          count={taxa}
          name={metadata.name}
          to={{
            description: {
              main: { key: 'entry' },
              entry: {
                db: entryDB,
                accession: metadata.accession,
              },
              taxonomy: { isFilter: true, db: 'uniprot' },
            },
          }}
        />

        <CounterIcon
          endpoint="structure"
          count={structures}
          name={metadata.name}
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
        />

        {
          // show sets counter + icon only when available
          entryDB.toLowerCase() === 'cdd' ||
          entryDB.toLowerCase() === 'pfam' ||
          entryDB.toLowerCase() === 'pirsf' ? (
            <CounterIcon
              endpoint="set"
              count={sets}
              name={metadata.name}
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
            />
          ) : null
        }
      </div>
    );
  }
}

const description2IDs = (description) =>
  (description.match(/"(PUB\d+)"/gi) || []).map((t) =>
    t.replace(/(^")|("$)/g, ''),
  );
/*:: type DescriptionEntriesProps = {
  description: Array<string>,
  literature: Object,
  accession: string
};*/
class DescriptionEntries extends PureComponent /*:: <DescriptionEntriesProps> */ {
  static propTypes = {
    description: T.arrayOf(T.string),
    literature: T.object,
    accession: T.string.isRequired,
  };

  render() {
    const { description, literature, accession } = this.props;

    if (!(description && description.length)) return null;

    const desc = description[0];

    const citations = description2IDs(desc.text);
    const included = Object.entries(literature || {})
      .filter(([id]) => citations.includes(id))
      .sort((a, b) => desc.indexOf(a[0]) - desc.indexOf(b[0]));

    return (
      <>
        <div className={f('card-description', 'card-block')}>
          <Description
            textBlocks={[desc]}
            literature={included}
            accession={accession}
            withoutIDs
          />
        </div>
      </>
    );
  }
}
/*:: type EntryCardProps = {
  data: Object,
  search: string,
  entryDB: string
};*/
class EntryCard extends PureComponent /*:: <EntryCardProps> */ {
  static propTypes = {
    data: dataPropType,
    search: T.string,
    entryDB: T.string,
  };

  render() {
    const { data, search, entryDB } = this.props;
    return (
      <NewCard
        imageComponent={
          entryDB.toLowerCase() === 'interpro' ? (
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
          )
        }
        title={
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
            <HighlightedText
              text={data.metadata.name || ''}
              textToHighlight={search}
            />
          </Link>
        }
        footer={
          <>
            {entryDB.toLowerCase() === 'interpro' ? (
              <div>{data.metadata.type.replace('_', ' ')}</div>
            ) : (
              <div>
                {data.metadata.integrated ? (
                  <div>
                    Integrated into{' '}
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
                    >
                      {data.metadata.integrated}
                    </Link>
                  </div>
                ) : (
                  'Not integrated'
                )}
              </div>
            )}
            <div>
              <HighlightedText
                text={data.metadata.accession || ''}
                textToHighlight={search}
              />
            </div>
          </>
        }
      >
        <div>
          {data.extra_fields ? (
            <SummaryCounterEntries
              entryDB={entryDB}
              metadata={data.metadata}
              counters={data.extra_fields.counters}
            />
          ) : (
            <Loading />
          )}
          {data.extra_fields ? (
            <DescriptionEntries
              db={data.metadata.source_database}
              accession={data.metadata.accession}
              description={data.extra_fields.description}
              literature={data.extra_fields.literature}
            />
          ) : (
            <Loading />
          )}
        </div>
      </NewCard>
    );
  }
}

const ArchiveCallout = ({ name, page }) => (
  <div className={f('row')}>
    <div className={f('columns', 'large-12')}>
      <div
        className={f('callout', 'info')}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: '2em',
            color: 'darkblue',
            paddingRight: '1rem',
          }}
          className={f('small', 'icon', 'icon-common', 'icon-info')}
        />{' '}
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
      </div>
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
                <Link
                  target="_blank"
                  href={data.url}
                  name="api"
                  className={f('button', 'hollow', 'imitate-progress-button')}
                >
                  <span
                    className={f('icon', 'icon-common', 'icon-export')}
                    data-icon="&#xf233;"
                  />
                  <span className={f('file-label')}>Web View</span>
                </Link>
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
